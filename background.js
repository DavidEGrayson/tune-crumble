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
    itunesLibraryInfo.setMainFile(entry);
    persistence.save()
    viewUpdate("itunesMainFile")
  },
  
  itunesAddMusicFolder: function(entry) {
    itunesLibraryInfo.addMusicFolder(entry)
    persistence.save()
    viewUpdate("itunesMusicFolders")
  },
  
  itunesMusicFolderRemove: function(index) {
    itunesLibraryInfo.musicFolderRemove(index)
    persistence.save()
    viewUpdate("itunesMusicFolders")
  }
}

var model = {
  itunesLibraryInfo: itunesLibraryInfo
}

persistence.load()