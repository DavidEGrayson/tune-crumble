// The cmd object receives all commands from the view.
function newCmd(model, persistence, viewUpdaterRegistry)
{
  r = {}
  viewUpdate = function(x) { viewUpdaterRegistry.update(x) }
  
  r.itunesSelectMainFile = function(entry) {
    model.itunesLibraryInfo.setMainFile(entry)
    persistence.saveItunesLibraryInfo(model.itunesLibraryInfo)
    viewUpdate("itunesMainFile")
  }
  
  r.itunesAddMusicFolder = function(entry) {
    model.itunesLibraryInfo.addMusicFolder(entry)
    persistence.saveItunesLibraryInfo(model.itunesLibraryInfo)
    viewUpdate("itunesMusicFolders")
  }
  
  r.itunesMusicFolderRemove = function(index) {
    itunesLibraryInfo.musicFolderRemove(index)
    persistence.saveItunesLibraryInfo(model.itunesLibraryInfo)
    viewUpdate("itunesMusicFolders")
  }
  
  return r
}
