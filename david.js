var device_direntry;

$(document).ready(appRefresh);

function appRefresh()
{
  iTunesLibrary.loadMediaSettings()
}

function error(context)
{
  return function(err){
    console.log(context + ":");
    console.log(err);
  }
}

function openFileSystemSettings() {
  chrome.fileSystem.chooseEntry({type: "openDirectory"}, onNewDeviceDirectory);
}

function onNewDeviceDirectory(direntry, list)
{
  device_direntry = direntry
  console.log("new device directory")
  console.log(direntry)
  console.log(list)
  updateDeviceInfo()
}

