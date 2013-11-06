var persistence = new function(){
  var storage = chrome.storage.local

  this.save = function() {
    console.log("saving all settings")
    this.saveItunesLibraryInfo()
  }
  
  this.load = function() {
    this.getItunesMainFileEntry(function(e)
    {
      itunesLibraryInfo.setMainFile(e)
    })
  }
  
  this.saveItunesLibraryInfo = function() {
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
    console.log("Trying storing itunesMainFileId " + stringId)
    storage.set({"itunesMainFileId": stringId}, function() {
      console.log("Success storing itunesMainFileId " + stringId)
    })
    
  }
  
  this.getItunesMainFileEntry = function(callback) {
    storage.get('itunesMainFileId', function(m)
    {
      var stringId = m['itunesMainFileId'];
      console.log("retrieved itunes main file id from storage: " + stringId)
      chrome.fileSystem.isRestorable(stringId, function(restorable)
      {
        if (!restorable)
        {
          console.log("Weird: itunes main file id (" + stringId + ") is not restorable")
          callback(null)
          return;
        }
        
        chrome.fileSystem.restoreEntry(stringId, function(entry)
        {
          callback(entry);
        });
      })
    })
  }
}()
