"""Обёртка над edge-tts для окружения с прокси (TLS-CA из /root/.ccr/ca-bundle.crt)."""
import asyncio, os, ssl

import certifi

CA = os.environ.get("SSL_CERT_FILE") or "/root/.ccr/ca-bundle.crt"
if os.path.exists(CA):
    certifi.where = lambda: CA  # edge-tts берёт CA из certifi

import edge_tts  # noqa: E402

PROXY = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")


async def synth(text, voice, rate="+0%", pitch="+0Hz", path="out.mp3", retries=4):
    last = None
    for i in range(retries):
        try:
            com = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, proxy=PROXY)
            await com.save(path)
            if os.path.getsize(path) > 500:
                return path
            last = RuntimeError("empty audio")
        except Exception as e:  # noqa: BLE001
            last = e
        await asyncio.sleep(1.5 * (i + 1))
    raise last
