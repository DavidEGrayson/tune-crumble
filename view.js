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
  
  viewContextMenuInit()
}

function viewContextMenuInit()
{
  chrome.contextMenus.removeAll(function() {
    
  });
  
  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (!document.hasFocus()) {
      return;
    }

    console.log("context menu was clicked")
    console.log(info)
    console.log(tab)
  });
  
  // TODO: do this the jquery way?
  $(document).mousedown(function(event){
    if (event.button !== 2) {
      return false;
    }
    
    if($.makeArray($("ul li")).indexOf(event.target) >= 0)
    {
      console.log("adding the remove from list item")
      addMenuRemoveFromList()
    }
    else
    {
      chrome.contextMenus.remove("removeFromList")
    }

  })
}

function addMenuRemoveFromList()
{
  chrome.contextMenus.create({
    title: "Remove from list",
    id: "removeFromList",
    contexts: ['all']
    }
  )
}