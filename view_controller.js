var viewController = {
  itunesCmdChange: function() {
    console.log("itunes cmd change");
    
    var opts = {
      type: "openFile",
      suggestedName: "iTunes Library.xml",
      accepts: [{description: "iTunes Library XML file (*.xml)", extensions: ["xml"]}]
    }
    chrome.fileSystem.chooseEntry(opts, function(entry, list)
    {
      cmd.itunesSelectMainFile(entry);
    })
  },
  
  itunesContentDirsAdd: function() {
    chrome.fileSystem.chooseEntry({type: "openDirectory"}, function(entry, list)
    {
      cmd.itunesAddContentDir(entry);
    })
  }
}

var backgroundPage;
var cmd;
chrome.runtime.getBackgroundPage(function(bg)
{
  backgroundPage = bg;
  cmd = backgroundPage.cmd;
  backgroundPage.registerViewUpdater(updater)
});
