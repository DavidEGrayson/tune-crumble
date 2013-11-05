var viewController = {
  itunesCmdChange: function() {
    var opts = {
      type: "openFile",
      suggestedName: "iTunes Library.xml",
      accepts: [{description: "iTunes Library XML file (*.xml)", extensions: ["xml"]}]
    }
    chrome.fileSystem.chooseEntry(opts, function(entry, list)
    {
      cmd.itunesSelectMainFile(entry)
    })
  },
  
  itunesContentDirsAdd: function() {
    chrome.fileSystem.chooseEntry({type: "openDirectory"}, function(entry, list)
    {
      cmd.itunesAddContentDir(entry)
    })
  }
}

updater.all = function() {
  updater.itunesMainFile()
  updater.itunesContentDirs()
}

var backgroundPage;
var model;
var cmd;

chrome.runtime.getBackgroundPage(function(bg)
{
  backgroundPage = bg;
  cmd = backgroundPage.cmd;
  model = backgroundPage.model;  

  // Here is basically where the program starts running.
  viewStart()
  backgroundPage.registerViewUpdater(updater)
  updater.all()
});
