#!/usr/bin/env python3
"""Озвучка kx-реплик: Edge-TTS (те же голоса, что в игре) → mp3 + липсинк → site/voice/manifest.json.

  node tools/build-lines.mjs --json=/tmp/kx-lines.json     # собрать список реплик
  python3 tools/voice/build_voice.py /tmp/kx-lines.json    # озвучить недостающие

Формат записи манифеста как у оригинальных реплик: {f: файл, d: длительность, e: липсинк, t: субтитр}.
Скрипт идемпотентен: реплика с тем же голосом/текстом не озвучивается повторно.
Постобработка подобрана по оригинальным записям: обрезка тишины по краям, нормализация пика ≈ −2 dBFS,
лёгкий «тёплый» EQ для narrator/tyuk/cow, эхо для hapchik, mp3 24 кГц моно 48 кбит/с.
"""
import asyncio, hashlib, io, json, math, os, sys
from pathlib import Path

import av
import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from edge import synth  # noqa: E402

SITE = Path(__file__).resolve().parents[2] / "site"
VOICE_DIR = SITE / "voice"
MANIFEST = VOICE_DIR / "manifest.json"
SR = 24000

# профили голосов — копия таблицы ut из voice-*.js игры
PROFILES = {
    "narrator": ("ru-RU-SvetlanaNeural", "-4Hz", "-8%", "warm"),
    "pyx": ("ru-RU-SvetlanaNeural", "+30Hz", "+6%", ""),
    "busya": ("ru-RU-SvetlanaNeural", "+45Hz", "+4%", ""),
    "chukh": ("ru-RU-DmitryNeural", "+22Hz", "+6%", ""),
    "shchyok": ("ru-RU-DmitryNeural", "+45Hz", "-4%", ""),
    "kapa": ("ru-RU-SvetlanaNeural", "-10Hz", "-8%", ""),
    "tyuk": ("ru-RU-DmitryNeural", "-8Hz", "-6%", "warm"),
    "tarabar": ("ru-RU-DmitryNeural", "+35Hz", "+12%", ""),
    "hapchik": ("ru-RU-DmitryNeural", "+30Hz", "+10%", "echo"),
    "cow": ("ru-RU-SvetlanaNeural", "-30Hz", "-12%", "warm"),
    "hen": ("ru-RU-SvetlanaNeural", "+40Hz", "+12%", ""),
    "pig": ("ru-RU-DmitryNeural", "+15Hz", "-2%", ""),
    "sheep": ("ru-RU-SvetlanaNeural", "+20Hz", "-6%", ""),
}


def decode(path):
    c = av.open(str(path))
    rs = av.AudioResampler(format="s16", layout="mono", rate=SR)
    out = []
    for f in c.decode(audio=0):
        for g in rs.resample(f):
            out.append(g.to_ndarray().reshape(-1))
    for g in rs.resample(None):
        out.append(g.to_ndarray().reshape(-1))
    c.close()
    return np.concatenate(out).astype(np.float64) / 32768


def warm(x):
    """чуть приглушить верха (≈ −2 дБ выше 4 кГц), как у оригинальных «тёплых» голосов"""
    n = len(x)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    t = np.clip((f - 3000) / 2500, 0, 1)
    X *= 10 ** (-2.0 * t * t * (3 - 2 * t) / 20)
    return np.fft.irfft(X, n)


def echo(x):
    """короткое «облачное» эхо для Хапчика"""
    tail = int(SR * 0.45)
    y = np.concatenate([x, np.zeros(tail)])
    for d, g in ((0.09, 0.32), (0.18, 0.16), (0.27, 0.08)):
        k = int(SR * d)
        y[k:k + len(x)] += x * g
    return y


def process(raw, fx):
    x = decode(raw)
    if fx == "warm":
        x = warm(x)
    elif fx == "echo":
        x = echo(x)
    # обрезка тишины по краям
    win = int(SR * 0.01)
    n = len(x) // win
    rms = np.array([np.sqrt(np.mean(x[i * win:(i + 1) * win] ** 2)) for i in range(n)])
    idx = np.where(rms > 0.008)[0]
    if len(idx):
        a = max(0, idx[0] * win - int(SR * 0.03))
        b = min(len(x), (idx[-1] + 1) * win + int(SR * (0.35 if fx == "echo" else 0.15)))
        x = x[a:b]
    # нормализация пика ≈ −2 dBFS
    pk = float(np.max(np.abs(x))) or 1.0
    x = x * min(0.79 / pk, 2.8)
    # микро-фейды
    fade = int(SR * 0.006)
    if len(x) > 4 * fade:
        x[:fade] *= np.linspace(0, 1, fade)
        x[-fade:] *= np.linspace(1, 0, fade)
    return np.clip(x, -1, 1)


def lipsync(x):
    """digit = round(9·min(1, rms/0.25)^1.4) на кадр 1/30 с (окно 800 сэмплов при 24 кГц) — подобрано по оригиналам"""
    d = len(x) / SR
    nfr = math.ceil(d * 30)
    out = []
    for i in range(nfr):
        seg = x[i * 800:(i + 1) * 800]
        r = float(np.sqrt(np.mean(seg ** 2))) if len(seg) else 0.0
        out.append(str(int(min(9, max(0, round(9 * min(1.0, r / 0.25) ** 1.4))))))
    return "".join(out), round(d, 3)


def encode(x, path):
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    out = av.open(str(path), "w", format="mp3")
    st = out.add_stream("libmp3lame", rate=SR)
    st.bit_rate = 48000
    st.layout = "mono"
    frame_size = 1152
    for i in range(0, len(pcm), frame_size):
        chunk = pcm[i:i + frame_size]
        fr = av.AudioFrame.from_ndarray(chunk.reshape(1, -1), format="s16", layout="mono")
        fr.sample_rate = SR
        for p in st.encode(fr):
            out.mux(p)
    for p in st.encode(None):
        out.mux(p)
    out.close()


def fname(voice, pitch, rate, fx, text):
    h = hashlib.sha1(f"{voice}|{pitch}|{rate}|{fx}|{text}|v2".encode()).hexdigest()
    return h[:14] + ".mp3"


async def main():
    src = sys.argv[1] if len(sys.argv) > 1 else "/tmp/kx-lines.json"
    only = set(a.split("=", 1)[1].split(",") for a in sys.argv[2:] if a.startswith("--only="))
    lines = json.load(open(src, encoding="utf-8"))
    man = json.load(open(MANIFEST, encoding="utf-8"))
    todo = []
    for ln in lines:
        voice, pitch, rate, fx = PROFILES[ln["who"]]
        tts = ln["say"] or ln["text"]
        f = fname(voice, pitch, rate, fx, tts)
        cur = man.get(ln["key"])
        if cur and cur.get("f") == f and (VOICE_DIR / f).exists() and cur.get("t") == ln["text"]:
            continue
        if (VOICE_DIR / f).exists():  # файл уже озвучен (прошлый прогон оборвался) — берём его, без сети
            x = decode(VOICE_DIR / f)
            e, d = lipsync(x)
            man[ln["key"]] = {"f": f, "d": d, "e": e, "t": ln["text"]}
            continue
        todo.append((ln, voice, pitch, rate, fx, tts, f))
    print(f"реплик: {len(lines)}, к озвучке: {len(todo)}", flush=True)
    sem = asyncio.Semaphore(6)

    def save():
        json.dump(man, open(MANIFEST, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

    done = 0
    failed = []

    async def one(item):
        nonlocal done
        ln, voice, pitch, rate, fx, tts, f = item
        async with sem:
            tmp = Path("/tmp") / f"kxraw_{f}"
            try:
                await synth(tts, voice, rate, pitch, str(tmp))
                x = await asyncio.to_thread(process, tmp, fx)
                e, d = lipsync(x)
                await asyncio.to_thread(encode, x, VOICE_DIR / f)
                man[ln["key"]] = {"f": f, "d": d, "e": e, "t": ln["text"]}
            except Exception as ex:  # noqa: BLE001
                failed.append((ln["key"], repr(ex)[:120]))
            finally:
                tmp.unlink(missing_ok=True)
            done += 1
            if done % 25 == 0:
                print(f"  {done}/{len(todo)}", flush=True)
                save()

    await asyncio.gather(*(one(i) for i in todo))
    # снять устаревшие записи kx (реплик больше нет) и сохранить
    keys = {l["key"] for l in lines}
    for k in list(man):
        if (k.startswith("e.kx-") or k.startswith("s.land.kx-")) and k not in keys:
            del man[k]
    json.dump(man, open(MANIFEST, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(f"готово: озвучено {len(todo) - len(failed)}, ошибок {len(failed)}")
    for k, e in failed:
        print("  FAIL", k, e)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
