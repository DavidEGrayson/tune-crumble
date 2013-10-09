var itunes_domfs;
var itunes_xml_file_entry;
var itunes_xml_file;
var itunes_xml;

function openMediaSettings() {
  chrome.mediaGalleries.getMediaFileSystems({interactive: "yes"}, onNewMediaSettings);
}

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