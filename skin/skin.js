var updater = {
  itunesMainFile: function() {
    model.itunesLibraryInfo.getMainFileName().then(function(name) {
      $("#itunesMainFile").html(name || "-")
    }).done()
    model.itunesLibraryInfo.getMainFileTimestamp().then(function(stamp) {
      var str = stamp != null ? stamp.toLocaleString() : "-"
      $("#itunesTimestamp").html(str)
    }).done()
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
  $("#itunesCmdChange").click(viewCmd.itunesCmdChange);
  $("#itunesMusicFoldersAdd").click(viewCmd.itunesMusicFoldersAdd);
  
  contextMenusInit()
}

var contextMenuItems =
{
  removeFromList: {
    handleClick: function(node)
    {
      var index = $.makeArray($("ul li")).indexOf(node)
      viewCmd.itunesMusicFolderRemove(index)
    },
    
    add: function()
    {
      // Weird: specifying onclick here fails.
      chrome.contextMenus.create({
        title: "Remove from list",
        id: "removeFromList",
        contexts: ['all']
      })
    }
  }
}


// This is called when an element in the page is right-clicked on.
// Its job is to update the context menus.
function viewUpdateContextMenus(node)
{
  if($.makeArray($("ul li")).indexOf(node) >= 0)
  {
    contextMenuItems.removeFromList.add()
  }
  else
  {
    chrome.contextMenus.remove("removeFromList")
  }
}

