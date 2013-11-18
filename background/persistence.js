// The Persistence class handles commands to transfer data between the model and the
// chrome.storage API.
// Transferring to the model is called loading and transferring to storage is called saving.
// Persistence does not know about how the model is created or every aspect of it.  It just knows
// about the parts that get persisted.
// TODO: handle any failures that happen in storage.set

function Persistence(model){
  var storageRaw = chrome.storage.local
  this.storage = {
    set: function(data)
    {
      var deferred = Q.defer()
      storageRaw.set(data, function() {
        if(chrome.runtime.lastError)
        {
          deferred.reject(chrome.runtime.lastError)
        }
        else
        {
          deferred.resolve(null)
        }
      })
      return deferred.promise
    },
    
    get: function(keys)
    {
      var deferred = Q.defer()
      storageRaw.get(keys, function(items) {
        if(chrome.runtime.lastError)
        {
          deferred.reject(chrome.runtime.lastError)
        }
        else
        {
          deferred.resolve(items)
        }
      })
      return deferred.promise
    }
  }
  
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
    return this.storage.set({"itunesMainFileId": stringId})
  }
  
  this.getItunesMainFileEntry = function(callback) {
    return this.storage.get("itunesMainFileId").then(function(m)
    {
      restoreEntryOrNull(m["itunesMainFileId"], callback)
    })
  }
  
  this.saveItunesLibraryMusicFolders = function(entries) {
    var ids = entries.map(function(entry)
    {
      // We need a function here because chrome.fileSystme.retainEntry is picky about its arguments.
      return chrome.fileSystem.retainEntry(entry)
    })
    return this.storage.set({"itunesMusicFolders": ids})
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
    return this.storage.get("itunesMusicFolders").then(function(m)
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
