
"use strict";

var debugElement = document.getElementById('debug');
var originalConsoleLog = console.log;
console.log = function (message) {
  if (debugElement)
  {
    debugElement.innerHTML = debug.innerHTML + message + "</br>";
  }
  originalConsoleLog(message);
}
console.error = console.log;

let scanner = new Instascan.Scanner({ video: document.getElementById('preview'), mirror: false });
scanner.addListener('scan', function (content) {
  console.log(content);
  if (gameLogic)
  {
    gameLogic.HandleScan(content);
  }
});

window.addEventListener('load', function() {
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      var sorted = cameras.sort(function(a, b){
        // Prefer any camera that mentions "back"
        return a.name.toLowerCase().includes("back") ? -1 : 1;
      });

      try {
        scanner.start(sorted[0]).then(function(){
          console.log( "Launched: "+sorted[0].name);
        }).catch(function( err ){
          console.log( "Error trying to launch: "+sorted[0].name + ": "+err);
          if (sorted.length > 1)
          {
            // Trying second choice
            scanner.start(sorted[1]).
            then(function(){console.log("Second chance success")}).
            catch(function(err){console.log("second chance failed: "+err)});
          }
        });
      }
      catch(e)
      {
          console.log( "got error: "+e + " skipping start.")
      }
    } else {
      console.error('No cameras found.');
    }
  }).catch(function (e) {
    console.error("error: "+e);
  });
});
