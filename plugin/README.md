# draw.io Plugin: Architecture Blocks

Optional draw.io plugin for auto-loading the ArchiMate shape library.

## Installation

### draw.io Desktop
1. Open draw.io
2. Extras → Plugins → Add
3. Select `architecture-blocks-plugin.js` from this directory
4. Restart draw.io

### draw.io Online (app.diagrams.net)
1. Host the plugin file on a web server or CDN
2. Extras → Plugins → Add
3. Paste the URL to the hosted plugin file
4. Refresh the page

## What it does

- Auto-loads the Architecture Blocks shape library on startup
- Adds "Check Architecture Blocks" action to verify managed shapes
- Logs status to browser console

## Limitations

- Auto-import works best when the library file is accessible via relative path
- For full upgrade/check functionality, use the CLI: `npx architecture-blocks check`
- Online version requires the plugin to be hosted on a CORS-enabled server
