
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
    for (var i=1; i < cameras.length; i++)
    {
      // Prefer any camera that mentions "back"
      if (cameras[i].name.toLowerCase().contains("back"))
      {
        c = cameras[i];
        break;
      }  
    }
    scanner.start(c);
  } else {
    console.error('No cameras found.');
  }
}).catch(function (e) {
  console.error(e);
});
