function getDisplayPathOrNull(entry)
{
  if (entry == null)
  {
    return Q.when(null)
  }
    
  var deferred = Q.defer()
  chrome.fileSystem.getDisplayPath(entry, function(path)
  {
    deferred.resolve(path)
  })
  return deferred.promise
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

function getTimestampOrNull(entry)
{
  if (entry == null)
  {
    return Q.when(null)
  }
  
  var deferred = Q.defer()
  entry.getMetadata(function(metadata)
  {
    deferred.resolve(metadata.modificationTime)
  },
  function(err)
  {
    console.log("error getting metadata for entry")
    console.log(entry)
    console.log(err)
    deferred.reject(err)
  })
  return deferred.promise
}

function getDisplayPathList(entries, callback)
{
  // TODO: Q.all(entries.map(restoreEntryOrNull))
  entries.mapWithCallback(chrome.fileSystem.getDisplayPath, callback)
}

Array.prototype.delete = function(value) {
  for (var i = 0; i < this.length; i++)
  {
    if (this[i] == value)
    {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
}

// TODO: get rid of this because we should be doing this with Q
Array.prototype.mapWithCallback = function(mapper, callback)
{
  var result = []
  var resultCount = 0
  
  if(this.length == 0)
  {
    callback([])
    return;
  }
  
  for(var i = 0; i < this.length; i++)
  {
    (function(i){
      mapper(this[i], function(mapped)
      {
        result[i] = mapped
        if (++resultCount == this.length)
        {
          callback(result)
        }
      }.bind(this))
    }).call(this, i)
  }
}

Q.defer.prototype.rejectWithChromeError = function()
{
  if (chrome.runtime.lastError)
  {
    this.reject(chrome.runtime.lastError)
    return true;
  }
  else
  {
    return false;
  }
}