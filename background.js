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

var itunesLibraryInfo = new ItunesLibraryInfo();

var viewUpdaters = []

function registerViewUpdater(viewUpdater)
{
  viewUpdaters.push(viewUpdater)
}

// The cmd object receives all commands from the view.
var cmd = {
  itunesSelectMainFile: function(entry) {
    itunesLibraryInfo.setMainFile(entry);
  },
  
  itunesAddContentDir: function(entry) {
    itunesLibraryInfo.addContentDir(entry);
  }
}