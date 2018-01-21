"use strict";

var gameLogic = {};

gameLogic.data = [
  {unlocked: false, image: "musk.jpg", name: "Elon Musk", clue: " where you microwave a hotdog", description: "Likes to play with rockets and electric cars.", container: {main: null}},
  {unlocked: false, image: "gates.jpg", name: "Bill Gates", clue: " where you tickle the ivory", description: "Is saving many people in Africa.</br>He use to write some software.", container: {main: null}},
  {unlocked: false, image: "hermine.jpg", name: "Ms. Granger", clue: " where you go when you gotta go", description: "She really is the brightest wizard of her age.", container: {main: null}},
]

gameLogic.Start = function()
{
  this.headerDiv = document.getElementById("headerDiv");
  this.statusElement = document.getElementById("status");
  this.CreateCards( document.getElementById("cardContainer") );

  var launchId = parseInt(window.location.search.split("id=")[1]);
  if (launchId >= 0 && launchId < this.data.length )
  {
    this.OnFoundId(launchId);
  }
}

gameLogic.CreateCards = function( parentElement )
{
  for (var i=0; i < this.data.length; i++)
  {
    var s = document.createElement("span");
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
//    container.image.innerHTML = ;
//    container.name.innerHTML = this.data[id].name;
//    container.age.innerHTML = this.data[id].age;
    container.description.innerHTML = 
    "<img class='photo' src='images/"+this.data[id].image+"'>"+
    "<img class='paperclip' src='images/paperclip.png'></img>" +
    "<h1>"+this.data[id].name +"</h1>"+    
    "<h2>"+this.data[id].description +"</h2>";
  }
  else
  {
//    container.image.innerHTML = "<img src='images/unknown.png' width=100 height=100>";
//    container.name.innerHTML = "----";
//    container.age.innerHTML = "----";
    container.description.innerHTML =     
    "<img class='photoStraight' src='images/unknown.png'>"+
    "<h1 class='unknownTitle'>Identity Unknown<h1>"+
    "<h2>Find the <img src='images/id0.jpg' width=60 height=60></img> " +
    this.data[id].clue+"</h2>";
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
gameLogic.OnFoundId = function( id )
{
  console.log("Handling id: "+id);

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
    } ,1500);
  }
  this.UpdateCards();
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

gameLogic.Start();
