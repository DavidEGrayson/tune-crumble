$(document).ready(function() {
  $("#refresh").click(appRefresh)
  $("#media_settings").click(iTunesLibrary.openMediaSettings)
  $("#load_library").click(iTunesLibrary.loadLibrary)
  $("#file_system_settings").click(openFileSystemSettings)
  console.log("added event handlers to buttons")
});


function updateItunesInfoTable() {
  if (itunes_xml_file) {
    var metadata = chrome.mediaGalleries.getMediaFileSystemMetadata(itunes_domfs);
    $("#itunes_location").html(metadata.name) // e.g. "iTunes"

    //chrome.fileSystem.getDisplayPath(itunes_xml_file_entry, function(path) { $("#itunes_location").html(path + "!") });
    
    $("#itunes_xml_filename").html(itunes_xml_file.name);

    date = itunes_xml_file.lastModifiedDate
    $("#itunes_timestamp").attr("datetime", date.toISOString()).html(date.toLocaleString())
    
  }
  else
  {
    $("#itunes_location").html("-");
    $("#itunes_xml_filename").html("-");
    $("#itunes_timestamp").html("-");
  }
}

function updateDeviceInfo()
{
  if (device_direntry)
  {
    chrome.fileSystem.getDisplayPath(device_direntry, function(path)
    {
      $("#device_path").html(path)
    });
  }
  else
  {
    $("#device_path").html("-")
  }
}