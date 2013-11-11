// view_controller.js basically has any part of the view that shouldn't change
// if someone made a new skin for the app, whereas view.js and the HTML files
// *only* store things that would change when the skin changes.
// This separation was inspired by Coding Horror.

updater.all = function()
{
  updater.itunesMainFile()
  updater.itunesMusicFolders()
}

var bg      // The background page.
var model   // The model: can tell us the state of the app.
var viewCmd // Processes all commands from the view.

chrome.runtime.getBackgroundPage(function(bgp)
{
  bg = bgp
  model = bg.model
  viewCmd = newViewCmd(bg.cmd)

  setTimeout(viewRun, 0)
  // if we just call viewRun that would work too, but then Chrome
  // refuses to show a nice backtrace for errors in viewRun.
});

function viewRun()
{
  // Here is basically where the program starts running.
  viewInit()
  bg.registerViewUpdater(updater)
  updater.all()
}