
"use strict";

let scanner = new Instascan.Scanner({ video: document.getElementById('preview'), mirror: false });
scanner.addListener('scan', function (content) {
  console.log(content);
  if (gameLogic)
  {
    gameLogic.HandleScan(content);
  }
});
Instascan.Camera.getCameras().then(function (cameras) {
  if (cameras.length > 0) {
    var c = cameras[0]; // Default to first
    for (var i=0; i < cameras.length; i++)
    {
      // Prefer any camera that mentions "back"
      try {
        var debug = document.getElementById('debug');
        if (debug){
          debug.innerHTML = debug.innerHTML + cameras[i].name + "</br>";
        }
        if (cameras[i].name.toLowerCase().includes("back"))
        {
          c = cameras[i];
          break;
        }
      }
      catch(e)
      {        
      }
    }
    scanner.start(c);
  } else {
    console.error('No cameras found.');
  }
}).catch(function (e) {
  console.error(e);
});
