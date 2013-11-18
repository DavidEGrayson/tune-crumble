// Small wrapper around the chrome.storage API that makes it use Q promises.
// This constructor takes a Google Chrome Storage API
// (either chrome.storage.local or chrome.storage.sync).

function Storage(storage)
{
  this.storage = storage
}

Storage.prototype = {
  set: function(data)
  {
    var deferred = Q.defer()
    this.storage.set(data, function() {
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
    this.storage.get(keys, function(items) {
      deferred.rejectWithChromeError() || deferred.resolve(items)
    })
    return deferred.promise
  }
}
