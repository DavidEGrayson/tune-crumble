chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('skin/window.html', {
    id: "window",
    singleton: true,
    minWidth: 640,
    minHeight: 300,
    bounds: {
      width: 640,
      height: 500
    },
    resizable: true
  });
});

// Create all the global variables used by the background page.
// For ease of testing, no other background javascript except background.js
// should be accessing these global variables.

var viewUpdaterRegistry = new ViewUpdaterRegistry()

var itunesLibraryInfo = new ItunesLibraryInfo()

var model =
{
  itunesLibraryInfo: itunesLibraryInfo
}

var storage = new Storage(chrome.storage.local)
var persistence = new Persistence(storage)
var modelDoneLoading = persistence.load(model)

modelDoneLoading.done()  // Report any errors loading the moadel.  TODO: do this bettter

var cmd = newCmd(model, persistence, viewUpdaterRegistry)

// Create any extra things needed for our interface to the outside world.
function registerViewUpdater(updater)
{
  viewUpdaterRegistry.register(updater)
}

