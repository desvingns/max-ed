#!/usr/bin/env python3
"""Makes the mp3 voice clips for the chess station lines and registers them in site/voice/manifest.json.

Same voices as the rest of the game (Microsoft Edge neural TTS through the `edge-tts` package).
Only lines that are missing (or whose text changed) are generated, so it is safe to re-run.

    pip install edge-tts miniaudio lameenc numpy
    python3 tools/chess/gen-voice.py            # generate what is missing
    python3 tools/chess/gen-voice.py --force    # regenerate all chess lines
    python3 tools/chess/gen-voice.py --reprocess  # only re-run trimming / loudness on the existing chess clips

Behind a TLS-intercepting proxy set SSL_CERT_FILE / HTTPS_PROXY as usual; the CA bundle is honoured.
"""
import asyncio, hashlib, json, os, ssl, subprocess, sys
from pathlib import Path

import aiohttp
import edge_tts
import lameenc
import miniaudio
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
VOICE = ROOT / "site" / "voice"
MANIFEST = VOICE / "manifest.json"
# speakers the chess lines use besides Цок (copied from the game's speaker table)
EXTRA_SPEAKERS = {"pyx": {"voice": "ru-RU-SvetlanaNeural", "pitch": "+30Hz", "rate": "+6%"}}
FORCE = "--force" in sys.argv
REPROCESS = "--reprocess" in sys.argv
TARGET_DB = -14.6  # loudness of the voiced part, matches the clips already in the game


def load_lines():
    raw = subprocess.check_output(["node", str(ROOT / "tools/chess/dump-voice.mjs")])
    data = json.loads(raw)
    return data["lines"], {**EXTRA_SPEAKERS, **data["speakers"]}


def postprocess(path):
    """Edge TTS pads every clip with ~1.4 s of silence and is quieter than the game's other clips:
    trim to 45 ms before / 100 ms after the speech, bring the voiced part to TARGET_DB (peak <= -1 dB)."""
    d = miniaudio.mp3_read_file_f32(str(path))
    a = np.array(d.samples).reshape(-1, d.nchannels).mean(axis=1)
    sr = d.sample_rate
    loud = np.where(np.abs(a) > 0.01)[0]
    if not len(loud):
        return
    seg = a[max(0, loud[0] - int(0.045 * sr)) : min(len(a), loud[-1] + int(0.10 * sr))]
    voiced = seg[np.abs(seg) > 0.01]
    gain = 10 ** ((TARGET_DB - 20 * np.log10(np.sqrt(np.mean(voiced**2)))) / 20)
    gain = min(gain, 0.89 / float(np.abs(seg).max()))
    pcm = (np.clip(seg * gain, -1, 1) * 32767).astype("<i2")
    enc = lameenc.Encoder()
    enc.set_bit_rate(48)
    enc.set_in_sample_rate(sr)
    enc.set_channels(1)
    enc.set_quality(2)
    path.write_bytes(bytes(enc.encode(pcm.tobytes()) + enc.flush()))


def envelope(path):
    """One digit (0-9) per 1/30 s of mouth opening, same scheme as the existing clips."""
    d = miniaudio.mp3_read_file_f32(str(path))
    a = np.array(d.samples).reshape(-1, d.nchannels).mean(axis=1)
    win = d.sample_rate // 30
    fr = np.array([np.sqrt(np.mean(a[i : i + win] ** 2)) for i in range(0, len(a), win)])
    ref = np.percentile(fr[fr > 0.005], 95) if (fr > 0.005).any() else 1.0
    digits = np.minimum(9, np.round(9 * np.minimum(1, fr / ref))).astype(int)
    return round(len(a) / d.sample_rate, 3), "".join(str(x) for x in digits), float(20 * np.log10(np.sqrt(np.mean(a**2)) + 1e-9))


async def synth(text, spk, out, ctx, proxy, sem):
    async with sem:
        for attempt in range(5):
            try:
                conn = aiohttp.TCPConnector(ssl=ctx)
                comm = edge_tts.Communicate(text, spk["voice"], rate=spk["rate"], pitch=spk["pitch"], connector=conn, proxy=proxy)
                await comm.save(str(out))
                if out.stat().st_size > 500:
                    return
            except Exception as e:  # network hiccup: retry
                await asyncio.sleep(1.5 * (attempt + 1))
                err = e
        raise RuntimeError(f"TTS failed for {text!r}: {err}")


async def main():
    lines, speakers = load_lines()
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if REPROCESS:
        mine = {ln["key"] for ln in lines}
        for key, e in manifest.items():
            if key in mine and "s" in e:
                postprocess(VOICE / e["f"])
                e["d"], e["e"], _ = envelope(VOICE / e["f"])
        MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        print("reprocessed", sum(1 for k in manifest if k in mine and "s" in manifest[k]), "clips")
        return
    cafile = os.environ.get("SSL_CERT_FILE") or os.environ.get("REQUESTS_CA_BUNDLE")
    ctx = ssl.create_default_context(cafile=cafile) if cafile else ssl.create_default_context()
    proxy = os.environ.get("HTTPS_PROXY")
    sem = asyncio.Semaphore(6)
    todo = []
    for ln in lines:
        cur = manifest.get(ln["key"])
        if cur and not FORCE and cur.get("t") == ln["text"] and (VOICE / cur["f"]).exists() and cur.get("s") == ln["say"]:
            continue
        todo.append(ln)
    print(f"{len(lines)} chess lines, {len(todo)} to generate")
    results = {}

    async def one(ln):
        spk = speakers[ln["who"]]
        say = ln["say"].replace("…", "...")
        h = hashlib.sha1(f"{spk['voice']}|{spk['pitch']}|{spk['rate']}|{say}".encode()).hexdigest()[:14]
        out = VOICE / f"{h}.mp3"
        if not out.exists() or FORCE:
            await synth(say, spk, out, ctx, proxy, sem)
            postprocess(out)
        dur, env, db = envelope(out)
        results[ln["key"]] = {"f": out.name, "d": dur, "e": env, "t": ln["text"], "s": ln["say"]}
        print(f"  {ln['key']:34s} {dur:5.2f}s {db:6.1f} dB")

    await asyncio.gather(*(one(ln) for ln in todo))
    manifest.update(results)
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"manifest updated (+{len(results)})")


asyncio.run(main())
