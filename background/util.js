function getDisplayPathOrNull(entry, callback)
{
  if (entry)
  {
    chrome.fileSystem.getDisplayPath(entry, callback)
  }
  else
  {
    callback(null)
  }
}

function getTimestampOrNull(entry, callback)
{
  if (entry)
  {
    entry.getMetadata(function(metadata)
    {
      callback(metadata.modificationTime);
    },
    function(err)
    {
      console.log("error getting metadata for entry")
      console.log(entry)
      console.log(err)
      callback(null)
    });
  }
  else
  {
    callback(null)
  }
}

function getDisplayPathList(entries, callback)
{
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
