function ItunesLibraryInfo()
{
  this.mainFileEntry = null
  this.contentDirEntries = []
}

// Takes a FileEntry object.  That class is documented here:
// http://www.w3.org/TR/file-system-api/
ItunesLibraryInfo.prototype.setMainFile = function(entry) {
  this.mainFileEntry = entry
}

ItunesLibraryInfo.prototype.addContentDir = function(entry) {
  this.contentDirEntries.push(entry)
}