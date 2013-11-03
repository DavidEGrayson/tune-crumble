var itunes_domfs;
var itunes_xml_file_entry;
var itunes_xml_file;
var itunes_xml;

var iTunesLibrary = {
  domfs: null,
  xml_file_entry: null,
  xml_file: null,
  xml: null,
  
  openMediaSettings: function()
  {
    chrome.mediaGalleries.getMediaFileSystems({interactive: "yes"}, this.onNewMediaSettings);
  },

  loadMediaSettings: function()
  {
  
    console.log("loadMediaSettings: this")
    console.log(this)
    
    chrome.mediaGalleries.getMediaFileSystems({interactive: "no"}, this.onNewMediaSettings);
  },
  
  onNewMediaSettings: function(domfs_list)
  {
    // TODO: see if we can get rid of this ugliness using prototypes or something
    if (this != iTunesLibrary) { iTunesLibrary.onNewMediaSettings(domfs_list); return; }
    console.log("onNewMediaSettings: this")
    console.log(this)
    itunes_domfs = this.findITunesDomfs(domfs_list);
    itunes_xml_file = null
    this.readStuff()
  },

  findITunesDomfs: function(domfs_list)
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
  },

  examineXmlFile: function(entry)
  {
    itunes_xml_file_entry = entry
    entry.file(function(file) {
      itunes_xml_file = file
      updateItunesInfoTable()    
    }, error("error getting XML File from FileEntry"))
  },

  readStuff: function()
  {
    if (itunes_domfs)
    {
      console.log("itunes domfs exists");
      
      itunes_domfs.root.createReader().readEntries(function(a) {
        console.log("iTunes root entries: ");
        console.log(a);
      }, error("getting itunes root entries"));
      
      itunes_domfs.root.getFile("iTunes Music Library.xml", {}, this.examineXmlFile, error("Error getting iTunes Music Library.xml"));
      //itunes_domfs.root.getFile("iTunes Library.xml", {}, examineXmlFile, error("Error getting iTunes Library.xml"));
    }
    else
    {
      updateItunesInfoTable();
    }
  },

  loadLibrary: function() {
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
};