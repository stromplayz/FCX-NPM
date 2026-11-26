# FocusCaseX CLI

`focuscasex` is the command-line registry client for FocusCaseX, the clinic EMR platform. It brings the marketplace side of the Android app to any terminal: browse the public catalog, inspect and install workbenches, and host your own registry mirror on the clinic LAN.

- Marketplace catalog — list everything published on the public marketplace
- Workbenches — show what a bundle contains, install one into a local workspace
- Hosting — `fcx serve` mirrors the registry over HTTP for the clinic LAN
- MCP setup — ready-to-paste agent configs (Claude, Cursor, VS Code and more)
- Doctor — environment checklist before a clinic rollout

## Install

Requires Node 18 or newer.

Primary path (GitHub):

    npm install -g github:stromplayz/FCX-NPM

Once the NPM_TOKEN secret is configured on this repo, the sync workflow publishes to npmjs and this path works too:

    npm install -g focuscasex

Both install the same bundle. npm publishing is added on top of the GitHub path; it does not replace it.

## Commands

| Command | What it does |
| --- | --- |
| `fcx --version` / `fcx version` | Prints `focuscasex <version>` (mirrors the app version) |
| `fcx doctor [--offline]` | Environment checklist: Node >= 18, workspace writability, cached catalog, marketplace reachability |
| `fcx sync` | Downloads the marketplace catalog into `~/.focuscasex/cache/catalog.json` |
| `fcx catalog [kind]` | Lists catalog items (code, kind, name); optional kind filter like `capsule`, `theme`, `template`, `workbench`; `--json` dumps JSON |
| `fcx workbench list` | Lists workbenches with name, id, install code and one-line description |
| `fcx workbench show <id-or-code>` | Fetches the bundle and prints the full description and grouped contents |
| `fcx workbench install <id-or-code> [--dir D]` | Writes the bundle into a local workspace mirror (default `~/.focuscasex/workspace/<workbench-id>/`) |
| `fcx serve [--port 4319]` | Local registry server over HTTP |
| `fcx open` | Opens https://focuscasex.vercel.app in the default browser |
| `fcx mcp` | Prints the MCP endpoint, pairing steps and agent setup snippets |

`<id-or-code>` accepts an exact item id (`workbench:solo-optometry`), an install code (`FCX-2VJD2S`) or a case-insensitive name substring (`solo optometry`). Install codes are the same deterministic `FCX-XXXXXX` handles the app and the marketplace site show.

## Same features as Android

The CLI covers the marketplace-facing feature set of the FocusCaseX Android app:

- Catalog — the full marketplace catalog, cached locally with `fcx sync`
- Workbenches — list, show and install, with the same per-item install confirmation the app prints
- Hosting — `fcx serve` exposes the registry over HTTP so a clinic can run its own mirror on the LAN; point the app at it with `FCX_MARKET_URL`
- MCP — the same server endpoint and pairing flow as the app's Settings -> MCP tab
- Workspace — https://focuscasex.vercel.app via `fcx open` is the full workspace, same features as the Android app

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

## MCP

    fcx mcp

Prints the server URL (https://focuscasex.vercel.app/api/mcp/server), the pairing flow (6-digit code + QR from the app's Settings -> MCP) and setup snippets for eight agents: Claude Code, Claude Desktop, Cursor, Windsurf, VS Code, Cline, Gemini CLI and Codex CLI.

## Files and environment

- `~/.focuscasex/cache/catalog.json` — synced catalog
- `~/.focuscasex/workspace/<workbench-id>/` — installed workbench mirrors
- `FCX_MARKET_URL` — override the marketplace base URL (default https://stromplayz.github.io/FocusCaseX)
- `FCX_HOME` — override the workspace root

Network fetches fail soft: when the marketplace is unreachable the CLI says so and points at the cached catalog.

## How this repo stays updated

The CLI source lives in the private app repo (stromplayz/FocusCaseX-App, `cli/`) and is never published in readable form. The `sync-from-source` workflow checks it out with the `ACTIONS_PAT` secret, rebuilds `dist/fcx.mjs` with esbuild, sets the package version from `fcx.config.json`, commits and tags `v<version>`. It runs on manual dispatch, on a `cli-release` repository dispatch (sent by the app repo's `scripts/release-cli.mjs`) and on a weekly schedule.

Publishing to npmjs activates once the NPM_TOKEN secret is added to this repo. Until then each `v*` tag packs the tarball and attaches it to the GitHub Release, and the GitHub install path above keeps working.

## License

MIT — see LICENSE.
