# Jam Desk — Infinite Canvas for VS Code

An infinite, zoomable **spatial canvas** inside VS Code. Pan, zoom, and place
notes and file cards anywhere on a boundless surface; group them into regions;
and never lose track of where you left things.

Jam Desk is inspired by the [Cate IDE](https://github.com/0-AI-UG/cate)'s
central infinite canvas — the zoom/pan/inertia model, snapping, regions,
minimap, auto-layout, and keyboard navigation all follow the same mechanics.
Electron-coupled node content (terminals, editors, browsers, AI agents) is
replaced with two VS Code-friendly node kinds:

- **Note** — a free-text card you can type into directly on the canvas.
- **File card** — a card that points at a workspace file and opens it in the
  editor (button or double-click).

## Features

- **Infinite pan & zoom** — cursor-anchored smooth zoom (mouse wheel or
  ⌘/Ctrl + scroll), trackpad two-finger pan, right/middle-drag pan with
  momentum **inertia**.
- **Two tools** — Select (`V`) and Hand (`H`); hold **Space** to pan
  temporarily from anywhere.
- **Marquee selection** — drag on empty canvas to box-select nodes & regions
  (Shift to add).
- **Grid + edge snapping** — nodes snap to a grid and to neighbor edges/centers
  with live **alignment guides**. Hold **Alt** to bypass.
- **Resize with shared borders** — drag any edge/corner; nodes sharing a border
  resize together.
- **Regions** — group nodes into labeled, colored containers that move and
  resize as a unit; drag nodes in and out.
- **Minimap** — a corner bird's-eye overview with a live viewport rect;
  click/drag to navigate, click a node to focus it. Resizable and repositionable.
- **Auto-layout** — tidy everything into a region-aware masonry grid.
- **Undo / redo** — 100-step history (`⌘/Ctrl+Z`, `⌘/Ctrl+Shift+Z`).
- **Keyboard navigation** — arrow keys move focus by direction; `Tab` cycles;
  focused node centers in view.
- **Persistence** — the canvas is saved per-workspace automatically, and can be
  exported / imported as JSON.

## Usage

Open the canvas with the command palette: **“Jam Desk: Open Canvas”**.

| Action | Shortcut / control |
| --- | --- |
| Select tool | `V` |
| Hand (pan) tool | `H`, or hold `Space` |
| Zoom | mouse wheel, ⌘/Ctrl + scroll, or toolbar `+` / `−` |
| Pan | trackpad two-finger, right/middle-drag, or Hand tool |
| Fit to screen | toolbar ⤢, or `Shift+1` |
| Reset zoom to 100% | toolbar `100%`, or `⌘/Ctrl+0` |
| Add note | toolbar 📝, or right-click → 메모 추가 |
| Add file card | toolbar 📄 (pick), `＋` (active editor), or right-click |
| Select all | `⌘/Ctrl+A` |
| Delete selection | `Delete` / `Backspace` |
| Group selection into a region | toolbar ▢ |
| Auto-layout | toolbar ▦ |
| Undo / redo | `⌘/Ctrl+Z` / `⌘/Ctrl+Shift+Z` |
| Bypass snapping | hold `Alt` while dragging/resizing |

Right-click empty canvas for a context menu (add here, select all, layout, fit,
reset, clear).

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `jamDesk.gridStyle` | `dots` | Background grid: `dots`, `lines`, or `none`. |
| `jamDesk.snapToGrid` | `true` | Snap to grid & neighbor edges (Alt bypasses). |
| `jamDesk.zoomSpeed` | `1` | Wheel/trackpad zoom multiplier. |
| `jamDesk.showMinimap` | `true` | Show the corner minimap. |

## Development

```bash
npm install
npm run build        # bundle extension + webview into dist/
npm run watch        # rebuild on change
npm run typecheck    # tsc --noEmit
```

Then press `F5` in VS Code to launch an Extension Development Host, and run
**“Jam Desk: Open Canvas”**.

### Architecture

- `src/extension.ts` — extension host: the `WebviewPanel`, message protocol,
  `workspaceState` persistence, file open/pick, export/import, and the command
  surface.
- `webview/` — a zero-dependency vanilla-TS canvas implementation:
  - `store.ts` — a Zustand-like reactive store (shallow-merge, slice diffing).
  - `types.ts`, `coordinates.ts`, `layout.ts` — geometry, transforms, and the
    pure snapping / auto-layout engine.
  - `interaction.ts` — pan / zoom / inertia / marquee / context-menu.
  - `gestures.ts` — node/region drag & shared-border resize.
  - `nodeView.ts` — the DOM reconciler for nodes & regions.
  - `grid.ts`, `snapGuides.ts`, `minimap.ts`, `toolbar.ts` — supporting views.
  - `persistence.ts` — the webview ⇄ host bridge.
  - `main.ts` — bootstrap & keyboard shortcuts.
- `media/canvas.css` — theme mapping (VS Code variables → canvas tokens) and
  all view styles.

## Credits

Canvas mechanics inspired by the
[Cate IDE](https://github.com/0-AI-UG/cate). Licensed under MIT.
