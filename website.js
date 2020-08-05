var sounds;
var start_sound;
var grid;
var position;
var isPlaying;
var started;
var box_w;
var box_h;
var PALLET;
var current_page;

let playMode = 'sustain';
let sample;
let SEQ_LEN = 8;
let NOTES = ["A3", "E2", "D4", "G3"];


function setup() {
  frameRate(4);
  
  started=false;
  current_page = "defaultCanvas0";
  sounds = [];
  num_loaded = 0;
  grid = [];
  position = 0;
  isPlaying = false;
  //PALLET = [color(119, 133, 173), color(189, 109, 89), 
  //          color(110, 193, 188), color(206, 199, 90), 
  //          color(249, 211, 211), color(97, 174, 39)];
            
  PALLET = [color(249, 211, 211), color(249, 211, 211), 
          color(249, 211, 211), color(249, 211, 211), 
          color(249, 211, 211), color(97, 174, 39)];
            
  

  var rand1 = Math.floor(Math.random()*NOTES.length*SEQ_LEN);
  var rand2 = Math.floor(Math.random()*NOTES.length*SEQ_LEN);
  
  start_sound = loadSound("sounds/fireplace.mp3");
  start_sound.setVolume(0.2);
  
  for (var i = 0; i < NOTES.length; i++) {
    note = NOTES[i];
    
    sounds.push(loadSound("sounds/blip" + note + ".mp3"));
    sounds[i].setVolume(1.3);
    
    grid.push([]);
    for (var j = 0; j < SEQ_LEN; j++) {
      if (j*NOTES.length + i == rand1 || j*NOTES.length + i == rand2) {
        grid[i].push(1);
      }
      grid[i].push(0);
    }
  }
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("container");
  
  document.body.onkeyup = function(e){
    if (e.keyCode === 32 || e.key === ' ') {
      if (isPlaying) {
        start_sound.stop();
      }
      else {
        start_sound.loop();
      }
      isPlaying = !isPlaying; 
      started=true;
    }
  };
  textSize(width/30);
  textAlign(CENTER, CENTER);
  textFont('monospace');
  
  document.getElementById("about").onmouseover = function() {
    document.getElementById("about").style.color = "rgb(249, 211, 211)";
  };
  document.getElementById("about").onmouseout = function() {
    if (current_page == "defaultCanvas0"){
      document.getElementById("about").style.color = "rgb(50, 50, 50)";
    }
  };
}


function draw() {
  clear();
  background(0, 0, 0, 0);
  pixel_rect(0, 0, width, height, 20, 1, color(255, 255, 255), 0);
  if (started==false) {
    fill(249, 211, 211);
    text('sound on. press spacebar.', width/2, height/2);
  }
  
  else{
    strokeWeight(1);
    box_w = width / SEQ_LEN;
    box_h = height / NOTES.length;
    var off = Math.round(box_w/7);
    
    for (var i = 0; i < NOTES.length; i++) {
      for (var j = 0; j < SEQ_LEN; j++) {
        
        x = j*box_w;
        y = i*box_h;
        
        if (position == j) {
          //strokeWeight(off);
          //strokeCap(PROJECT);
          //stroke(249, 211, 211);
          //line(x, height, x+box_w, height);
          //stroke(0, 0, 0);
          //strokeWeight(1);
          
          pixel_rect(x, height -10, box_w, 10, 10, 5, PALLET[i], 60);
        }
        
        fill(0);
        erase();
        rect(x + off, y + off, box_w - 2*off, box_h - 2*off);
        noErase();
        
        if (isPlaying && position == j && grid[i][j] == 1) {
          sounds[i].play();
          var r = red(PALLET[i]);
          var g = green(PALLET[i]);
          var b = blue(PALLET[i]);
          //rect(x + off, y + off, box_w - 2*off, box_h - 2*off);
          pixel_rect(x + off, y + off, box_w - 2*off, box_h - 2*off, 10, 3, PALLET[i], 60);
        }
        else if (grid[i][j] == 1) {
          pixel_rect(x + off, y + off, box_w - 2*off, box_h - 2*off, 10, 3, PALLET[i], 0);
        }
      }
    }
    
    if (isPlaying) {
      position = (position + 1) % SEQ_LEN;
    }
  }
}

function mousePressed(event) {
  console.log(event.srcElement);
  if (event.srcElement === document.getElementById("defaultCanvas0")) {
    const tmx = event.offsetX * width / canvas.clientWidth;
    const tmy = event.offsetY * height / canvas.clientHeight;
    for (var i = 0; i < NOTES.length; i++) {
      for (var j = 0; j < SEQ_LEN; j++) {
        
        x = j*box_w;
        y = i*box_h;
        if (tmx > x && tmx < x + box_w && tmy > y && tmy < y + box_h) {
          // in the box
          grid[i][j] = 1 - grid[i][j];
        }
      }
    }
    console.log(grid);
  }
}

function windowResized() {
  background(0);
  resizeCanvas(windowWidth, windowHeight);
}

function page_sw(page) {
  console.log(current_page, page);
  if (current_page == "defaultCanvas0") {
    document.getElementById(current_page).style.display = "none";
  }
  else {
    document.getElementById(current_page + "_content").style.display = "none";
    document.getElementById(current_page).style.color = "rgb(50, 50,50)";
  }
  
  if (current_page != page) {
    current_page = page;
    document.getElementById(page).style.color = "rgb(249, 211, 211)";
    document.getElementById(page + "_content").style.display = "block";
  }
  else {
    current_page = "defaultCanvas0";
    document.getElementById(current_page).style.display = "block";
  }
  
}


function pixel_rect(x, y, w, h, d1, d2, c, bias) {
  noStroke();
  //how much x coordinate grows
  var r;
  for (i=x; i<=(x+w); i+=d1) { // noprotect
    for (j=y ;j<=(y+h) ; j+=d1){
        r = Math.random();
        fill(color(r*red(c) + bias, r*blue(c) + bias, r*green(c) + bias));
        rect(i+Math.floor(d2/2),j+Math.floor(d2/2),d2,d2);
    }
  }
}





  
