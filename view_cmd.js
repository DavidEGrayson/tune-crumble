// viewCmd: Command processor for all the commands that come from the view.
function newViewCmd(cmd)
{
  var r = { __proto__: cmd }
  
  r.itunesCmdChange = function()
  {
    var opts = {
      type: "openFile",
      suggestedName: "iTunes Library.xml",
      accepts: [{description: "iTunes Library XML file (*.xml)", extensions: ["xml"]}]
    }
    chrome.fileSystem.chooseEntry(opts, function(entry, list)
    {
      if (entry)
      {
        cmd.itunesSelectMainFile(entry)
      }
      else
      {
        console.log("User failed to select iTunes main file.")
      }
    })
  }

  r.itunesMusicFoldersAdd = function()
  {
    chrome.fileSystem.chooseEntry({type: "openDirectory"}, function(entry, list)
    {
      if (entry)
      {
        cmd.itunesAddMusicFolder(entry)
      }
      else
      {
        console.log("User failed to select new iTunes music folder.")
      }
    })
  }
  
  return r
}
