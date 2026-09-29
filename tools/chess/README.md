# Chess station tools

See the main README ("Chess station") for what these are for.

* `apply-patches.mjs` — registers the chess station in the minified build; refreshes `precache.json` and the service worker.
* `test-engine.mjs`, `test-tasks.mjs`, `test-voice.mjs` — plain Node scripts (no dependencies).
* `dump-voice.mjs` + `gen-voice.py` — voice clips. `pip install edge-tts miniaudio lameenc numpy`. Behind a proxy that
  re-signs TLS, set `SSL_CERT_FILE` to its CA bundle. Clips are trimmed and levelled to match the game's other voices;
  the mouth-animation envelope is computed the same way as for the existing clips.
