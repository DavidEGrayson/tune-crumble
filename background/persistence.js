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
        deferred.rejectWithChromeError() || deferred.resolve(null)
      })
      return deferred.promise
    },

    get: function(key)
    {
      return this.getMultiple(key).get(key)
    },
    
    getMultiple: function(keys)
    {
      var deferred = Q.defer()
      storageRaw.get(keys, function(items) {
        deferred.rejectWithChromeError() || deferred.resolve(items)
      })
      return deferred.promise
    }
  }
  
  this.save = function(model) {
    var promises = [
      this.saveItunesLibraryInfo(model.itunesLibraryInfo),
    ]
    return Q.all(promises)
  }
  
  this.load = function(model) {
    var info = model.itunesLibraryInfo
    
    var promises = [
      this.getItunesMainFileEntry().then(function(entry)
      {
        info.mainFileEntry = entry
      }),

      this.getItunesLibraryMusicFolders().then(function(entries)
      {
        info.musicFolders = entries
      }),
    ]
    
    return Q.all(promises)
  }
  
  this.saveItunesLibraryInfo = function(info) {
    var promises = [
      this.saveItunesLibraryMainFile(info.mainFileEntry),
      this.saveItunesLibraryMusicFolders(info.musicFolders),
    ]
    return Q.all(promises)
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
  
  this.getItunesMainFileEntry = function() {
    return this.storage.get("itunesMainFileId").then(restoreEntryOrNull)
  }
  
  this.saveItunesLibraryMusicFolders = function(entries) {
    var ids = entries.map(function(entry)
    {
      // We need a function here because chrome.fileSystme.retainEntry is picky about its arguments.
      return chrome.fileSystem.retainEntry(entry)
    })
    return this.storage.set({"itunesMusicFolders": ids})
  }

  function restoreEntryOrNull(id)
  {
    if (id == null)
    {
      return Q.when(null)
    }
    
    var deferred = Q.defer()
    chrome.fileSystem.isRestorable(id, function(restorable)
    {
      if (!restorable)
      {
        deferred.reject("weird: file is not restorable: " + id)
      }
      
      chrome.fileSystem.restoreEntry(id, function(entry)
      {
        deferred.resolve(entry)
      })
    })
    return deferred.promise
  }
    
  this.getItunesLibraryMusicFolders = function() {
    return this.storage.get("itunesMusicFolders").then(function(ids)
    {
      if (!ids)
      {
        // It is normal that the ids array would be null the very first time the
        // user launches the app.
        ids = []
      }
      return Q.all(ids.map(restoreEntryOrNull))
    })
  }
}
