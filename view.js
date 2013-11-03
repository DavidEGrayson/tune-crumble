var updater = {
  itunesMainFile: function() {
    console.log("updating itunes main file")
    model.itunesLibraryInfo.getMainFileName(function(name) {
      $("#itunesMainFile").html(name)
    })
  },
  
  itunesContentDires: function() {
  
  }
}

$("#itunesCmdChange").click(viewController.itunesCmdChange)

$("#itunesContentDirsAdd").click(viewController.itunesContentDirsAdd)
