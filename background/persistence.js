// The Persistence class handles commands to transfer data between the model and the
// promise-based storage API provided by storage.js.
// Transferring to the model is called loading and transferring to storage is called saving.
// Persistence does not know about how the model is created or every aspect of it.  It just knows
// about the parts that get persisted.
// TODO: make sure errors from this level are getting handled correctly and perhaps shown to the user

function Persistence(storage)
{
  this.storage = storage

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
