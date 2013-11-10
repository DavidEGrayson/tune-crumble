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
  
  contextMenusInit()
}

var contextMenuItems =
{
  removeFromList: {
    handleClick: function(element)
    {
      console.log("handle removing something from list")
      console.log(element)
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

