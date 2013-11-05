var updater = {
  itunesMainFile: function() {
    console.log("updating itunes main file")
    model.itunesLibraryInfo.getMainFileName(function(name) {
      $("#itunesMainFile").html(name)
    })
  },
  
  itunesContentDirs: function() {
  
  },
  
  all: function() {
    updater.itunesMainFile()
    updater.itunesContentDirs()
  }
}

$("#itunesCmdChange").click(viewController.itunesCmdChange)

$("#itunesContentDirsAdd").click(viewController.itunesContentDirsAdd)

updater.all();