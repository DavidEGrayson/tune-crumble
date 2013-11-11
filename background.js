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

function viewUpdate(funcname) {
  for(var i = 0; i < viewUpdaters.length; i++) {
    viewUpdaters[i][funcname]();
  }
}

function registerViewUpdater(viewUpdater)
{
  if (!viewUpdaters)
  {
    console.log("oh noes viewUpdaters is not around")
  }
  viewUpdaters.push(viewUpdater)
}

// The cmd object receives all commands from the view.
var cmd = {
  itunesSelectMainFile: function(entry) {
    itunesLibraryInfo.setMainFile(entry)
    persistence.saveItunesLibraryInfo(model.itunesLibraryInfo)
    viewUpdate("itunesMainFile")
  },
  
  itunesAddMusicFolder: function(entry) {
    itunesLibraryInfo.addMusicFolder(entry)
    persistence.saveItunesLibraryInfo(model.itunesLibraryInfo)
    viewUpdate("itunesMusicFolders")
  },
  
  itunesMusicFolderRemove: function(index) {
    itunesLibraryInfo.musicFolderRemove(index)
    persistence.saveItunesLibraryInfo(model.itunesLibraryInfo)
    viewUpdate("itunesMusicFolders")
  }
}


var itunesLibraryInfo = new ItunesLibraryInfo();

var viewUpdaters = []
var model = {
  itunesLibraryInfo: itunesLibraryInfo
}

var persistence = new Persistence()
persistence.load(model)