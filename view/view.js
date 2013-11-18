/* This file is included at the bottom of the HTML for the app window
   and it takes care of loading and javascripts needed by the view. */
    
(function(){
  var body = document.getElementsByTagName('body')[0]
  function load(script) {
    var newScript = document.createElement('script')
    newScript.src = script
    body.appendChild(newScript)
  }
  var scripts = ["/view/jquery-2.0.3.min.js", "/view/context_menus.js", "/view/view_cmd.js", "/view/view_controller.js"]
  scripts.map(load)  
})()