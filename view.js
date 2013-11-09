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
  
  itunesMusicFolders: function() {
    model.itunesLibraryInfo.getMusicFolderNames(function(names) {
      var ul = $("ul#itunesMusicFolders")
      ul.empty()
      
      for(var i = 0; i < names.length; i++)
      {
        var name = names[i];
        var li = document.createElement("li")
        li.appendChild(document.createTextNode(name))
        ul.append(li)
      }
    })
  },
}

function viewInit()
{
  $("#itunesCmdChange").click(viewController.itunesCmdChange);
  $("#itunesMusicFoldersAdd").click(viewController.itunesMusicFoldersAdd);
}