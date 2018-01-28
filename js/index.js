
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
      scanner.start(cameras[0]).then(function(){
          console.log( "Launched: "+cameras[0].name);
        }).catch(function( err ){
          console.log( "Error trying to launch: "+cameras[0].name + ": "+err);
        });      
    } else {
      console.error('No cameras found.');
    }
  }).catch(function (e) {
    console.error("error: "+e);
  });
});
