// This model class keeps track of the iTunes XML file specified by the user
// and a list of directories specified by the user that should contain all the
// files.

function ItunesLibraryInfo()
{
  this.mainFileEntry = null
  this.musicFolders = []
}

// Takes a FileEntry object.  That class is documented here:
// http://www.w3.org/TR/file-system-api/
ItunesLibraryInfo.prototype =
{
  setMainFile: function(entry) {
    this.mainFileEntry = entry
  },

  addMusicFolder: function(entry) {
    this.musicFolders.push(entry)
  },

  musicFolderRemove: function(index) {
    this.musicFolders.splice(index, 1)
  },

  getMainFileName: function() {
    return getDisplayPathOrNull(this.mainFileEntry)
  },

  getMainFileTimestamp: function() {
    return getTimestampOrNull(this.mainFileEntry)
  },
  
  getMusicFolderNames: function() {
    return getDisplayPathList(this.musicFolders)
  },
  
}
