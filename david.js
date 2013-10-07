var itunes_domfs;
var itunes_xml_file;
var itunes_timestamp = $("#itunes_timestamp");

$("#refresh").click(appRefresh);
$(appRefresh);

function appRefresh() {
  loadMediaSettings()
}

$("#media_settings").click(function() {
  chrome.mediaGalleries.getMediaFileSystems({interactive: "yes"}, onNewMediaSettings);
});

function onNewMediaSettings(domfs_list) {
  itunes_domfs = findITunesDomfs(domfs_list);
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
  entry.file(function(file) {
    itunes_xml_file = file
    date = file.lastModifiedDate
    itunes_timestamp.attr("datetime", date.toISOString()).html(date.toLocaleString())
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
    itunes_timestamp.attr("datetime", date.toISOString()).html("-")
  }
}
