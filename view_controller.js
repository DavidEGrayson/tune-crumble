var viewCmd = {
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
  
  itunesMusicFoldersAdd: function() {
    chrome.fileSystem.chooseEntry({type: "openDirectory"}, function(entry, list)
    {
      cmd.itunesAddMusicFolder(entry)
    })
  }
}

updater.all = function() {
  updater.itunesMainFile()
  updater.itunesMusicFolders()
}

var bg;    // The background page.
var model; // The model: can tell us the state of the app.
var cmd;   // The command processor: can handle commands that change the state of the app.

chrome.runtime.getBackgroundPage(function(bgp)
{
  bg = bgp;
  cmd = bg.cmd;
  model = bg.model;
  
  viewCmd.__proto__ = cmd

  setTimeout(viewRun, 0)
  // if we just call viewRun that would work too, but then Chrome
  // refuses to show a nice backtrace for errors in viewRun.
});

function viewRun() {
  // Here is basically where the program starts running.
  viewInit()
  bg.registerViewUpdater(updater)
  updater.all()
}