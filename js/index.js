
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
      var c = cameras[0]; // Default to first
      try {
        for (var i=0; i < cameras.length; i++)
        {
          // Prefer any camera that mentions "back"
          console.log(cameras[i].name);
          if (cameras[i].name.toLowerCase().includes("back"))
          {
            c = cameras[i];
            break;
          }
        }
        console.log( "selected: "+c.name);

        scanner.start(c);
      }
      catch(e)
      {
          console.log( "got error: "+e + " skipping start.")
      }
    } else {
      console.error('No cameras found.');
    }
  }).catch(function (e) {
    console.error(e);
    debug.innerHTML = debug.innerHTML + "error:" + e
  });
});
