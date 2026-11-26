# FocusCaseX CLI

`focuscasex` is the command-line registry client for FocusCaseX, the clinic EMR platform. The Console brings the whole workspace side of the product to any terminal: a guided setup wizard, a licence sign-in with device approval, an interactive Extensions storefront, workbench installs, and your own registry mirror on the clinic LAN.

- Console — run `fcx` with no arguments for the full menu system (arrow keys, nested menus)
- Setup — `fcx setup` picks the workspace folder, syncs the catalog and signs in
- Licence — `fcx login` pairs this machine with the clinic licence; trusted devices never re-enter a code
- Marketplace — `fcx marketplace` is the Extensions storefront: categories, search, detail views, install in place
- Keepalive — `fcx alive` keeps the device's last-seen time current on the owner's admin page

## Install

Requires Node 18 or newer.

Primary path (the registry installer):

    curl -fsSL https://stromplayz.github.io/FocusCaseX/install.sh | bash

Installs the single-file bundle to `~/.focuscasex/bin/fcx` and wires the PATH. Rerun the same line to update; `--uninstall` removes it.

GitHub package path (same bundle):

    npm install -g github:stromplayz/FCX-NPM

## Commands

| Command | What it does |
| --- | --- |
| `fcx` / `fcx menu` | The interactive console — every command from nested menus |
| `fcx setup` | Guided setup: workspace folder, catalog sync, sign-in, first workbench |
| `fcx login` (alias: `fcx activate`) | Device sign-in: licence email + password + the owner-issued `FCX-XXXXXX` code; the licence is stored at `~/.focuscasex/activation.json` (mode 0600) |
| `fcx logout` | Removes the device licence from this machine |
| `fcx status` | Device licence card, re-checked with the registry |
| `fcx device` | The full device identity card — what the owner's admin Devices page sees |
| `fcx whoami` | One-line identity |
| `fcx vitals` (alias: `fcx doctor`) | Environment health check (8 checks) |
| `fcx marketplace` (alias: `fcx market`) | The Extensions storefront in the terminal |
| `fcx install [id-or-code]` | Install any catalog item; no argument opens the storefront; `fcx install list` shows installed items |
| `fcx uninstall <id-or-code>` | Removes an installed item's local mirror |
| `fcx catalog [kind]` | Quick catalog listing with install codes |
| `fcx workbench list\|show\|install` | Workbench bundles — inspect and install |
| `fcx sync` | Refreshes the cached catalog |
| `fcx stats` | Local usage dashboard |
| `fcx alive start\|stop\|status\|run` | Keepalive daemon — pings the registry on a schedule |
| `fcx config list\|get\|set\|reset` | CLI settings |
| `fcx update` | Prints the installer line when a newer CLI is published |
| `fcx serve [--port 4319]` | LAN registry mirror over HTTP |
| `fcx open` | Opens https://focuscasex.vercel.app in the browser |
| `fcx mcp` | MCP endpoint, pairing steps and agent setup snippets |

`<id-or-code>` accepts an exact item id (`plugin:optomize`), an install code (`FCX-2VJD2S`) or a case-insensitive name substring. Install codes are the same deterministic `FCX-XXXXXX` handles the app and the marketplace site show.

## The licence flow

The clinic owner issues `FCX-XXXXXX` activation codes on the admin page (one per device). A new machine signs in with the licence email, password and a code; the device's details (OS, hardware, network) go to the registry so the owner can see and approve exactly what is running. The licence token then lives at `~/.focuscasex/activation.json` (mode 0600, never synced). A trusted device verifies itself on every sign-in — no code again unless the owner revokes it. `fcx alive` keeps the last-seen time fresh; `fcx device` shows the same card the owner sees.

## Interactive console

    fcx

```
▐ FocusCaseX Console · v3.0.0
FocusCaseX

  ▸ Setup wizard — first run guided setup
    Account — signed in as ...
    Extensions — marketplace, install, catalog
    Workbenches — list, show, install
    Diagnostics — vitals, stats, updates, MCP
    Keepalive — status, start, stop
    Clinic workspace — open, LAN mirror
    Help & about
    Exit

↑↓ move · enter select · esc back · q quit
```

Piped input falls back to plain output — every command still works in scripts (`FCX_NON_INTERACTIVE` forces the same).

## Same features as the app

- Catalog — the full marketplace catalog, cached locally with `fcx sync`
- Extensions and workbenches — install by id or code, the same install codes the app shows
- Hosting — `fcx serve` exposes the registry over HTTP so a clinic can run its own mirror on the LAN; point the app at it with `FCX_MARKET_URL`
- MCP — the same server endpoint and pairing flow as the app's Settings -> MCP tab
- Workspace — https://focuscasex.vercel.app via `fcx open` is the full workspace

## Host it (clinic LAN mirror)

    fcx serve --port 4319

| Endpoint | Response |
| --- | --- |
| `GET /health` | `{"ok":true,...}` — version, counts, uptime |
| `GET /api/catalog` | The full cached marketplace catalog |
| `GET /api/workbenches` | The workbenches array |
| `GET /api/workbenches/<id>` | One workbench bundle JSON (by id, install code or name) |
| `GET /` | Small HTML index of the hosted registry |

The server prints its local and LAN URLs. Ctrl+C stops it. It reads the synced cache, so a clinic can sync once and keep hosting afterward.

## Files and environment

- `~/.focuscasex/activation.json` — device licence token (mode 0600, internal)
- `~/.focuscasex/device.uuid` — stable machine uuid
- `~/.focuscasex/config.json` — CLI settings (`fcx config`)
- `~/.focuscasex/installed.json` — installed items registry
- `~/.focuscasex/stats.jsonl` — usage event log (`fcx stats`)
- `~/.focuscasex/alive.pid`, `alive.log` — keepalive daemon state
- `~/.focuscasex/cache/catalog.json` — synced catalog
- `~/.focuscasex/workspace/` — installed workbench and item mirrors
- `FCX_MARKET_URL` — override the marketplace base URL (default https://stromplayz.github.io/FocusCaseX)
- `FCX_ORIGIN` — override the activation registry origin (default https://focuscasex.vercel.app)
- `FCX_HOME` — override the workspace root
- `FCX_NON_INTERACTIVE` — force plain, script-safe output
- `NO_COLOR` — disable terminal colors

Network fetches fail soft: when the marketplace is unreachable the CLI says so and points at the cached catalog.

## How this repo stays updated

The CLI source lives in the private app repo (stromplayz/FocusCaseX-App, `cli/`) and is never published in readable form. The `sync-from-source` workflow checks it out with the `ACTIONS_PAT` secret, rebuilds `dist/fcx.mjs` with esbuild, sets the package version from `cli/package.json`, commits and tags `v<version>`. It runs on manual dispatch, on a `cli-release` repository dispatch (sent by the app repo's `scripts/release-cli.mjs`) and on a weekly schedule.

Each `v*` tag packs the tarball and attaches it to the GitHub Release, and the installer line above keeps working between syncs.

## License

MIT — see LICENSE.
