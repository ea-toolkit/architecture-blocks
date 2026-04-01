/**
 * draw.io Plugin: Architecture Blocks
 *
 * Auto-loads the ArchiMate shape library and notifies when shapes
 * may be outdated. Works with draw.io desktop and online.
 *
 * Installation:
 *   Desktop: Extras → Plugins → Add → select this file
 *   Online:  Extras → Plugins → Add → paste URL to this file
 */
Draw.loadPlugin(function (ui) {
  // Configuration
  var LIBRARY_NAME = "Architecture Blocks";
  var CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  // Auto-load library if not already loaded
  var sidebar = ui.sidebar;
  if (sidebar) {
    try {
      // Check if library is already loaded
      var libs = ui.sidebar.palettes || {};
      if (!libs["architecture-blocks"]) {
        // Try to load from node_modules path
        var paths = [
          "node_modules/@ea-toolkit/architecture-blocks/libraries/architecture-blocks.xml",
          "../libraries/architecture-blocks.xml",
        ];

        for (var i = 0; i < paths.length; i++) {
          try {
            ui.loadLibrary(new UrlLibrary(mxResources.get(LIBRARY_NAME), paths[i]));
            console.log("[Architecture Blocks] Library loaded from " + paths[i]);
            break;
          } catch (e) {
            // Try next path
          }
        }
      }
    } catch (e) {
      console.log("[Architecture Blocks] Could not auto-load library: " + e.message);
    }
  }

  // Add menu item to check for updates
  var menu = ui.menus;
  if (menu) {
    ui.actions.addAction("checkArchitectureBlocks", function () {
      var graph = ui.editor.graph;
      var model = graph.getModel();
      var cells = model.cells || {};
      var staleCount = 0;

      for (var id in cells) {
        var cell = cells[id];
        if (cell && cell.style) {
          var style = cell.style;
          if (style.indexOf("data-block-id=") >= 0 && style.indexOf("data-library-version=") >= 0) {
            // Shape is managed by architecture-blocks
            staleCount++;
          }
        }
      }

      if (staleCount > 0) {
        mxUtils.alert(
          LIBRARY_NAME + ": Found " + staleCount + " managed shapes.\n" +
          "Run 'npx architecture-blocks check' to verify they are up to date."
        );
      } else {
        mxUtils.alert(LIBRARY_NAME + ": No managed shapes found in this diagram.");
      }
    });
  }

  console.log("[Architecture Blocks] Plugin loaded");
});
