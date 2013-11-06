function ItunesLibraryInfo()
{
  this.mainFileEntry = null
  this.contentDirEntries = []
}

// Takes a FileEntry object.  That class is documented here:
// http://www.w3.org/TR/file-system-api/
ItunesLibraryInfo.prototype =
{
  setMainFile: function(entry) {
    console.log("setMainFile")
    console.log(this)
    this.mainFileEntry = entry
  },

  addContentDir: function(entry) {
    this.contentDirEntries.push(entry)
  },

  getMainFileName: function(callback) {
    if (this.mainFileEntry)
    {
      chrome.fileSystem.getDisplayPath(this.mainFileEntry, callback)
    }
    else
    {
      callback(null)
    }
  },

  getMainFileTimestamp: function(callback) {
    if (this.mainFileEntry)
    {
      console.log("tmphax trying to get metadata")
      this.mainFileEntry.getMetadata(function(metadata) {
        console.log("tmphax got metadata")
        console.log(metadata)
        callback(metadata.modificationTime);
      },
      function(err) {
        console.log("error getting metadata for mainFileEntry")
        console.log(err)
        callback(null)
      });
    }
    else
    {
      console.log("tmphax just calling callback with null")
      callback(null)
    }
  }
}
