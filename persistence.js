var persistence = new function(){
  var storage = chrome.storage.local

  this.save = function() {
    this.saveItunesLibraryInfo()
  }
  
  this.load = function() {
    this.getItunesMainFileEntry(function(e)
    {
      itunesLibraryInfo.setMainFile(e)
    })
    this.getItunesLibraryMusicFolders(function(entries)
    {
      console.log("final callback for music folders retrieval got")
      console.log(entries)
      itunesLibraryInfo.musicFolders = entries
    })
  }
  
  this.saveItunesLibraryInfo = function() {
    this.saveItunesLibraryMainFile()
    this.saveItunesLibraryMusicFolders()
  }
  
  this.saveItunesLibraryMainFile = function()
  {
    var info = model.itunesLibraryInfo;
    var stringId;
    if (info.mainFileEntry)
    {
      stringId = chrome.fileSystem.retainEntry(info.mainFileEntry)
    }
    else
    {
      stringId = null;
    }
    storage.set({"itunesMainFileId": stringId}, function() {})
  }
  
  this.getItunesMainFileEntry = function(callback) {
    storage.get("itunesMainFileId", function(m)
    {
      restoreEntryOrNull(m["itunesMainFileId"], callback)
    })
  }
  
  this.saveItunesLibraryMusicFolders = function() {
    var ids = model.itunesLibraryInfo.musicFolders.map(function(entry)
    {
      return chrome.fileSystem.retainEntry(entry)
    })
    console.log("setting itunes music folders")
    console.log(ids)
    storage.set({"itunesMusicFolders": ids}, function() {})
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
      });
    })
  }
  
  this.getItunesLibraryMusicFolders = function(callback) {
    storage.get("itunesMusicFolders", function(m)
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
}()
