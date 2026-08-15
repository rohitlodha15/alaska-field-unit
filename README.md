# Alaska Field Unit

Offline-first aurora-expedition companion. Sept 2–8, 2026.

## Deploy the app (GitHub Pages)
1. This repo → Settings → Pages → Source: **main** / root → Save
2. Open the Pages URL in Safari on each iPhone → Share → **Add to Home Screen**
3. On wifi, open the app → **Prepare offline pack** (once per phone)

## Enable the AI Guide (optional, 3 min)
1. railway.app → New Project → **Deploy from GitHub repo** → pick this repo
2. Settings → Root Directory: `/proxy` → deploy
3. Variables → add `ANTHROPIC_API_KEY` = your key (console.anthropic.com)
4. Copy the Railway public URL → in the app: ⚙︎ Settings → paste into **AI Guide endpoint**

## Notes
- Node --check clean · Safari date-parse patched · solar math verified vs ephemeris
- Sky sources: NOAA SWPC (Kp live + forecast) + Open-Meteo (cloud). Cached hourly for offline.
