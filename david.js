var itunes_domfs;
var itunes_xml_file_entry;
var itunes_xml_file;
var itunes_timestamp = $("#itunes_timestamp");
var itunes_xml;

var device_direntry;

$(appRefresh);
$("#refresh").click(appRefresh);
$("#load_library").click(loadLibrary);
$("#file_system_settings").click(function() {
  chrome.fileSystem.chooseEntry({type: "openDirectory"}, onNewDeviceDirectory);
  //chrome.fileSystem.chooseEntry({type: "openFile"}, onNewDeviceDirectory);
});

function onNewDeviceDirectory(direntry, list)
{
  device_direntry = direntry
  console.log("new device directory")
  console.log(direntry)
  console.log(list)
  updateDeviceInfo()
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

function appRefresh()
{
  loadMediaSettings()
}

$("#media_settings").click(function() {
  chrome.mediaGalleries.getMediaFileSystems({interactive: "yes"}, onNewMediaSettings);
});

function onNewMediaSettings(domfs_list) {
  itunes_domfs = findITunesDomfs(domfs_list);
  itunes_xml_file = null
  readStuff()
}

function loadMediaSettings(callback) {
  chrome.mediaGalleries.getMediaFileSystems({interactive: "no"}, function(domfs_list) {
    onNewMediaSettings(domfs_list);
    if (callback) { callback(); }
  });
}

function findITunesDomfs(domfs_list)
{
  for (var i = 0; i < domfs_list.length; i++)
  {
    var domfs = domfs_list[i];
    var metadata = chrome.mediaGalleries.getMediaFileSystemMetadata(domfs);
    if (metadata.name == "iTunes")
    {
      return domfs;
    }
  }
  return null;
}

function error(context)
{
  return function(err){
    console.log(context + ":");
    console.log(err);
  }
}

function examineXmlFile(entry) {
  itunes_xml_file_entry = entry
  entry.file(function(file) {
    itunes_xml_file = file
    updateItunesInfoTable()    
  }, error("error getting XML File from FileEntry"))
}

function readStuff()
{
  if (itunes_domfs)
  {
    console.log("itunes domfs exists");
    
    itunes_domfs.root.createReader().readEntries(function(a) {
      console.log("iTunes root entries: ");
      console.log(a);
    }, error("getting itunes root entries"));
    
    itunes_domfs.root.getFile("iTunes Music Library.xml", {}, examineXmlFile, error("Error getting iTunes Music Library.xml"));
    //itunes_domfs.root.getFile("iTunes Library.xml", {}, examineXmlFile, error("Error getting iTunes Library.xml"));
  }
  else
  {
    updateItunesInfoTable();
  }
}

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

function loadLibrary() {
  if (!itunes_xml_file) {
    console.log("loadLibrary failed: itunes XML file is not present");
    return;
  }
  
  console.log("Reading XML file...");
  
  reader = new FileReader()
  reader.onerror = error("reading XML file")
  reader.onloadend = function() {
    console.log("XML file read completed.")
    parser = new DOMParser()
    xml_doc = parser.parseFromString(reader.result, "text/xml")
    itunes_xml = new ItunesXml(xml_doc)
    console.log("XML file parsing completed.")
  }
  reader.readAsText(itunes_xml_file)
}