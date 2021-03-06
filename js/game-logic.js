"use strict";

var gameLogic = {};

// Allows for clicking the QR code in the hint to do the same thing as scanning the code
gameLogic.testMode = true;
gameLogic.storageTimeout = 60*60*24; // 24 hours
gameLogic.Start = function()
{
  this.gameHeading = scavengerHuntData.heading;
  this.data = scavengerHuntData.data;

  for(var i=0;i<gameLogic.data.length; i++)
  {
    // Add some housekeeping to our data
    gameLogic.data[i].container = {main: null};
    gameLogic.data[i].unlocked = false;
  }

  this.headerDiv = document.getElementById("headerDiv");
  this.statusElement = document.getElementById("status");
  this.CreateCards( document.getElementById("cardContainer") );

  this.successPopup = document.getElementById("successDiv");

  this.successPopup.style.display = "none";

  this.successMessageElement = document.getElementById("successMessage");

  document.getElementById("mainHeading").innerHTML = this.gameHeading;   

  try {
    var launchId = parseInt(window.location.search.split("id=")[1]);
    if (launchId >= 0 && launchId < this.data.length )
    {
      setTimeout(function()
      {
        gameLogic.OnFoundId(launchId);
      }, 0)
      
    }
  }
  catch(e)
  {
    // Ignoring any trouble parsing the url
  }

  this.ReadStorage();
}
gameLogic.ScrollToCard = function(id)
{
  doScrolling("#card-"+id, 750);
  //this.data[id].container.main.scrollIntoView(false);


  //$('html, body').animate({
  //  scrollTop: this.data[id].container.main.offsetTop
//}, 1000);

}
gameLogic.CreateCards = function( parentElement )
{
  for (var i=0; i < this.data.length; i++)
  {
    var s = document.createElement("span");
    s.id = "card-"+i;
    s.classList.add("cardContainer");
    this.data[i].container.main = s;
    this.CreateCard(s, i);
    parentElement.appendChild(s);
  }
  this.UpdateCards();
}
gameLogic.UpdateCard = function(id)
{
  var container = this.data[id].container;

  if (this.data[id].unlocked)
  {
    var t = this.data[id].target;

    container.description.innerHTML =
    "<img class='photo' src='images/"+t.image+"'>"+
    "<img class='paperclip' src='images/paperclip.png'></img>" +
    "<h1>"+t.name +"</h1>"+
    "<h2>"+t.description +"</h2>";

  }
  else
  {
    var t = this.data[id].clue;


    var testingCallback="";
    if (this.testMode) // For testing
    {
      testingCallback = "onclick=gameLogic.OnFoundId("+id+")";
    }
    container.description.innerHTML =
    "<img class='photoStraight' src='images/"+t.image+"'>"+
    "<h1 class='unknownTitle'>"+t.name+"<h1>"+
    "<h2>Find the <img src='images/id0.jpg' width=60 height=60 "+testingCallback+"></img> " +
    t.description+"</h2>";
  }
}
gameLogic.UpdateCards = function()
{
  var unlockedCount = 0;
  for (var i=0; i < this.data.length; i++)
  {
    this.UpdateCard(i);
    if (this.data[i].unlocked)
    {
      unlockedCount++;
    }
  }
  this.statusElement.innerHTML = "<h2>Found "+unlockedCount+" of "+this.data.length+"</h2>";
}
gameLogic.CheckForSuccess = function()
{
  for (var i=0; i < this.data.length; i++)
  {
    if (!this.data[i].unlocked)
    {
      return;
    }
  }  
  // Must of had success!
  this.successMessageElement.innerHTML = scavengerHuntData.successMessage;

  this.successPopup.style.display = "table";

}
gameLogic.OnFoundId = function( id )
{
  //console.log("Handling id: "+id);

  var wasUnlocked = this.data[id].unlocked;
  this.data[id].unlocked = true;


  //if (!wasUnlocked)
  {
    headerDiv.classList.add("goGreenToBeige");
    this.data[id].container.row.classList.add("goGreenToInitial");

    var localId = id;
    setTimeout(function(){
      headerDiv.classList.remove("goGreenToBeige");
      gameLogic.data[localId].container.row.classList.remove("goGreenToInitial");
    } ,2200);
  }
  this.UpdateCards();

  this.SaveStorage();
  gameLogic.ScrollToCard(id);

  setTimeout(function(){gameLogic.CheckForSuccess()}, 2000);

  
}
gameLogic.HandleScan = function( value )
{
  // Turn the scanned value into a zero based index referring to the data items
  try {
    var s = value.split("=")
    var i = parseInt( s[s.length - 1] );

    if (i >= 0 && i < this.data.length)
    {
      this.OnFoundId( i );
    }
  }
  catch( err ) {
    console.log("Got error parsing scan: "+err);
  }
}
gameLogic.CreateCard = function( parentElement, id )
{
  // creates a <table> element and a <tbody> element
  var tbl = document.createElement("table");
  tbl.style = "transform:rotate("+(Math.random()-0.5)*7+"deg);";
  var tblBody = document.createElement("tbody");

  var row = document.createElement("tr");
  row.classList.add("cardRow");
  this.data[id].container.row = row;

  var cell = document.createElement("td");
  row.appendChild(cell);
  tblBody.appendChild(row);
  this.data[id].container.description = cell;

    // add the row to the end of the table body
  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  parentElement.appendChild(tbl);
  // sets the border attribute of tbl to 2;
  tbl.setAttribute("border", "2");
}
gameLogic.SuccessClicked = function()
{
  this.successPopup.style.display = "none";
  //this.successPopup.hidden = true;//setAttribute("hidden", true);
}
gameLogic.SaveStorage = function()
{
  var unlockedArray = [];
  for (var i=0; i < this.data.length; i++)
  {
    unlockedArray[i] = this.data[i].unlocked;
  }
  var d = { unlocked: unlockedArray, timeSaved: new Date() / 1000 };
  window.localStorage[this.gameHeading] = JSON.stringify(d);
}
gameLogic.ReadStorage = function()
{
  try 
  {
    var d = JSON.parse( window.localStorage[this.gameHeading] ); 

    var now = new Date() / 1000;
    if (d.timeSaved + this.storageTimeout < now )
    {
      // Don't read it.  Its too old.
    }
    else
    {
      for (var i=0; i < this.data.length; i++)
      {
        if (d.unlocked[i])
        {
          this.data[i].unlocked = true;
        }
      }
    }
  }
  catch(e)
  {    
    // Ignoring any read errors
  }  

  this.UpdateCards();
}
gameLogic.OnRestartGame = function()
{
  window.localStorage[this.gameHeading] = "";

  for (var i=0; i < this.data.length; i++)
  {
    this.data[i].unlocked = false;
  }
  this.UpdateCards();  
}
gameLogic.Start();
