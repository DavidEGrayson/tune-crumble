// This is a helper used by the view if the view wants to have context menus.
// The context menus are totally handled by the view and no other parts of the
// code (i.e. the view controller) should know about them.

function contextMenusInit()
{
  var clickedElement;

  chrome.contextMenus.removeAll();

  $(document).mousedown(function(event){
    if (event.button !== 2) {
      return false;
    }
    clickedElement = event.target
    viewUpdateContextMenus(clickedElement)
  })
  
  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (!document.hasFocus()) {
      return;
    }

    contextMenuItems[info.menuItemId].handleClick(clickedElement)
  });
  
}