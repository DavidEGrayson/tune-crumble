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

  getMainFileName: function(callback) {
    getDisplayPathOrNull(this.mainFileEntry, callback)
  },

  getMainFileTimestamp: function(callback) {
    getTimestampOrNull(this.mainFileEntry, callback)
  },
  
  getMusicFolderNames: function(callback) {
    getDisplayPathList(this.musicFolders, callback)
  },
}
