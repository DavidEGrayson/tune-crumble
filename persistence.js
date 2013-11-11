// The Persistence class handles commands to transfer data between the model and the
// chrome.storage API.
// Transferring to the model is called loading and transferring to storage is called saving.
// Persistence does not know about how the model is created or every aspect of it.  It just knows
// about the parts that get persisted.
// TODO: handle any failures that happen in storage.set

function Persistence(model){
  this.storage = chrome.storage.local
  
  this.save = function(model) {
    this.saveItunesLibraryInfo(model.itunesLibraryInfo)
  }
  
  this.load = function(model) {
    info = model.itunesLibraryInfo
    this.getItunesMainFileEntry(function(entry)
    {
      info.mainFileEntry = entry
    })
    this.getItunesLibraryMusicFolders(function(entries)
    {
      info.musicFolders = entries
    })
  }
  
  this.saveItunesLibraryInfo = function(info) {
    this.saveItunesLibraryMainFile(info.mainFileEntry)
    this.saveItunesLibraryMusicFolders(info.musicFolders)
  }
  
  this.saveItunesLibraryMainFile = function(entry)
  {
    var stringId;
    if (entry)
    {
      stringId = chrome.fileSystem.retainEntry(entry)
    }
    else
    {
      stringId = null;
    }
    this.storage.set({"itunesMainFileId": stringId}, function() {})
  }
  
  this.getItunesMainFileEntry = function(callback) {
    this.storage.get("itunesMainFileId", function(m)
    {
      restoreEntryOrNull(m["itunesMainFileId"], callback)
    })
  }
  
  this.saveItunesLibraryMusicFolders = function(entries) {
    var ids = entries.map(function(entry)
    {
      return chrome.fileSystem.retainEntry(entry)
    }) // TODO: see if we don't need to define a function here and can just use retainEntry
    this.storage.set({"itunesMusicFolders": ids}, function() {})
  }
  
  function restoreEntryOrNull(id, callback)
  {
    if (id == null)
    {
      callback(null)
      return
    }
    
    chrome.fileSystem.isRestorable(id, function(restorable)
    {
      if (!restorable)
      {
        console.log("weird: file is not restorable: " + id)
        callback(null)
        return;
      }
      
      chrome.fileSystem.restoreEntry(id, function(entry)
      {
        callback(entry);
      })
    })
  }
  
  this.getItunesLibraryMusicFolders = function(callback) {
    this.storage.get("itunesMusicFolders", function(m)
    {
      var ids = m["itunesMusicFolders"]
      
      if (!ids)
      {
        callback([])
        return
      }
      
      ids.mapWithCallback(restoreEntryOrNull, function(entries)
      {
        // If any of the folders were not restorable, there will be nulls in the
        // array that we should strip out.
        entries.delete(null)
        callback(entries)
      })      
    })
  }
}
