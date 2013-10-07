chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    minWidth: 640,
    minHeight: 300,
    bounds: {
      width: 640,
      height: 500
    },
    resizable: true
  });
});