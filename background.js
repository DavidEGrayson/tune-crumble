chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
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

var viewUpdaterRegistry = new ViewUpdaterRegistry()

function registerViewUpdater(updater)
{
  viewUpdaterRegistry.register(updater)
}

var itunesLibraryInfo = new ItunesLibraryInfo()

var model =
{
  itunesLibraryInfo: itunesLibraryInfo
}

var persistence = new Persistence()
persistence.load(model)

var cmd = newCmd(model, persistence, viewUpdaterRegistry)