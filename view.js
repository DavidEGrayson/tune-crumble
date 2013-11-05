var updater = {
  itunesMainFile: function() {
    console.log("itunesMainFile")

    model.itunesLibraryInfo.getMainFileName(function(name) {
      $("#itunesMainFile").html(name || "-")
    })
    model.itunesLibraryInfo.getMainFileTimestamp(function(stamp) {
      var str = stamp != null ? stamp.toLocaleString() : "-"
      $("#itunesTimestamp").html(str)
    })
  },
  
  itunesContentDirs: function() {
  
  },
}

function viewStart()
{
  $("#itunesCmdChange").click(viewController.itunesCmdChange);
  $("#itunesContentDirsAdd").click(viewController.itunesContentDirsAdd);
}