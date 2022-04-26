// p5.js sketch 
// OpenAq url * deconstruct them into components so they can get personal location 

var api_url ;
var airQ;

// typography 
var letters = [];
var density = 2.5;
var ribbonWidth = 92;
var shapeColor;
var fontSize = 800;
var pathSimplification = 0;
var pathSampleFactor = 0.1;



   

var textTyped = 'AiR';

var font;

var canvas; 

function preload() {
  font = loadFont('Faune-Display_Bold_Italic.ttf');
}


function setup (){
  

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position (0,0);
  canvas.style ('z-index', '-1')
  noFill();
  createLetters();
  

        let lat, lon;
  log
  // const button = document.getElementById('submit');
  // button.addEventListener('click', async event => {
  //  // const pledge = document.getElementById('pledge').value;
  //   const data = { lat, lon, pledge };
  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //    // },
  //     body: JSON.stringify(data)
  //   };
  //   //const response = await fetch('/api', options);
  //   const json = await response.json();
  //   console.log(json);
  // });

//geolocate
  if ('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(async position => {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      console.log (position.coords.latitude);
      console.log (position.coords.longitude)

      document.getElementById('latitude').textContent = lat.toFixed(2);
      document.getElementById('longitude').textContent = lon.toFixed(2);
      

//make it a string literal 
var api_url= `airQuality/${lat},${lon}`;
//const api_url= `airQuality`;
var response = await fetch (api_url);
const json = await response.json();
// print data coming in from api url 
console.log (json);
console.log (json.air_quality);

const air = json.air_quality.list[0].components
document.getElementById('co').textContent = air.co
// setInterval (airAQ,1000);
loadJSON (api_url,gotData);

    });
  } else {
    console.log('geolocation not available');
  }
 
}



function gotData (data){
  airQ = data; 
  console.log(airQ)
}

function draw() {
  background(255);
  


  if (airQ) {
      //text- printing data
  co = airQ.air_quality.list[0].components.co;
  document.getElementById('co').textContent = co
  
  no = airQ.air_quality.list[0].components.no;
  document.getElementById('no').textContent = no

  
  no2 = airQ.air_quality.list[0].components.no2;
  document.getElementById('no2').textContent = no2
  
  o3 = airQ.air_quality.list[0].components.o3;
  document.getElementById('o3').textContent = o3

  so2 = airQ.air_quality.list[0].components.so2;
  document.getElementById('so2').textContent = so2
  
  pm25 = airQ.air_quality.list[0].components.pm2_5;
  document.getElementById('pm25').textContent = pm25
  
  pm10 = airQ.air_quality.list[0].components.pm10;
  document.getElementById('pm10').textContent = pm10

  nh3 = airQ.air_quality.list[0].components.nh3;
  document.getElementById('nh3').textContent = nh3




    noFill ();
    translate(100, height*0.9);
   
    strokeWeight(pm10);
    shapeColor = color(so2,pm25,no2,30);

    pathSampleFactor = 0.1 * pow(0.02, co/ width);
    ribbonWidth = map(co, 0, height, 1, 200);

    for (var i = 0; i < letters.length; i++) {
      letters[i].draw();
    }

    
  

     }
  
   }


   



function createLetters() {
  letters = [];
  var chars = textTyped.split('');

  var x = 0;
  for (var i = 0; i < chars.length; i++) {
    if (i > 0) {
      var charsBefore = textTyped.substring(0, i);
      x = font.textBounds(charsBefore, 0, 0, fontSize).w;
    }
    var newLetter = new Letter(chars[i], x, 0);
    letters.push(newLetter);
  }
}

function Letter(char, x, y) {
  this.char = char;
  this.x = x;
  this.y = y;

  Letter.prototype.draw = function() {
    var path = font.textToPoints(this.char, this.x, this.y, fontSize, {sampleFactor: pathSampleFactor});
    stroke(shapeColor);

    for (var d = 0; d < ribbonWidth; d += density) {
      beginShape();

      for (var i = 0; i < path.length; i++) {
        var pos = path[i];
        var nextPos = path[i + 1];

        if (nextPos) {
          var p0 = createVector(pos.x, pos.y);
          var p1 = createVector(nextPos.x, nextPos.y);
          var v = p5.Vector.sub(p1, p0);
          v.normalize();
          v.rotate(HALF_PI);
          v.mult(d);
          var pneu = p5.Vector.add(p0, v);
          curveVertex(pneu.x, pneu.y);
        }
      }

      endShape(CLOSE);
    }
  };
}


function keyPressed() {
  if (keyCode == DELETE || keyCode == BACKSPACE) {
    if (textTyped.length > 0) {
      textTyped = textTyped.substring(0, textTyped.length - 1);
      createLetters();
    }
  }
}

function keyTyped() {
  if (keyCode >= 32) {
    textTyped += key;
    createLetters()

  }
}


// time 

function showTime(){
  var date = new Date();
  var h = date.getHours(); 
  var m = date.getMinutes(); 
  var s = date.getSeconds(); 
  var session = "AM";
  
  if(h == 0){
      h = 12;
  }
  
  if(h > 12){
      h = h - 12;
      session = "PM";
  }
  
  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  s = (s < 10) ? "0" + s : s;
  
  var time = h + ":" + m + ":" + s + " " + session;
  document.getElementById("DigitalCLOCK").innerText = time;
  document.getElementById("DigitalCLOCK").textContent = time;
  
  setTimeout(showTime, 1000);
  
}

showTime();

