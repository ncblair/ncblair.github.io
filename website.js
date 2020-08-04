var sounds;
var num_loaded;
var grid;
var position;
var mini_pos;
var isPlaying;
var box_w;
var box_h;
var matrixTransform;
var PALLET;
var current_page;

let playMode = 'sustain';
let sample;
let SEQ_LEN = 8;
let NOTES = ["A3", "C2", "D4", "G3"];


function setup() {
  frameRate(20);
  
  current_page = "defaultCanvas0";
  sounds = [];
  num_loaded = 0;
  grid = [];
  position = 0;
  mini_pos = 0;
  isPlaying = false;
  //PALLET = [color(119, 133, 173), color(189, 109, 89), 
  //          color(110, 193, 188), color(206, 199, 90), 
  //          color(249, 211, 211), color(97, 174, 39)];
            
  PALLET = [color(249, 211, 211), color(249, 211, 211), 
          color(249, 211, 211), color(249, 211, 211), 
          color(249, 211, 211), color(97, 174, 39)];
            


  var rand1 = Math.floor(Math.random()*NOTES.length*SEQ_LEN);
  var rand2 = Math.floor(Math.random()*NOTES.length*SEQ_LEN);
  for (var i = 0; i < NOTES.length; i++) {
    note = NOTES[i];
    sounds.push(loadSound("sounds/blip" + note + ".mp3", loaded));
    //sounds[sounds.length - 1].setVolume(0.5);
    
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
      isPlaying = !isPlaying;
    }
  };

  var st = window.getComputedStyle(cnv.canvas, null);

  var tr = st.getPropertyValue("-webkit-transform") ||
         st.getPropertyValue("-moz-transform") ||
         st.getPropertyValue("-ms-transform") ||
         st.getPropertyValue("-o-transform") ||
         st.getPropertyValue("transform") ||
         "Either no transform set, or browser doesn't do getComputedStyle";

  tr = tr.match(/\(\s*(.*)\s*\)/)[1].split(/\s*,\s*/).map(function(string) {
    return parseFloat(string);
  });
  var rows = [[], [], [], []];
  for (var c = 0; c < tr.length; c++) {
    rows[c % 4][Math.floor(c / 4)] = tr[c];
  }
  // Make a math.js matrix of the transform
  matrixTransform = math.inv(math.matrix(rows));

}

function loaded() {
  num_loaded++;
}

function draw() {
  if ((mini_pos % 5) == 0) {
    background(0);
    strokeWeight(1);
    box_w = width / SEQ_LEN;
    box_h = height / NOTES.length;
    var off = box_w/6;
    
    for (var i = 0; i < NOTES.length; i++) {
      for (var j = 0; j < SEQ_LEN; j++) {
        
        x = j*box_w;
        y = i*box_h;
        
        if (position == j) {
          strokeWeight(off);
          strokeCap(PROJECT);
          stroke(249, 211, 211);
          line(x, height, x+box_w, height);
          stroke(0, 0, 0);
          strokeWeight(0);
        }
        
        
        fill(color(26, 26, 26));
        rect(x + off, y + off, box_w - 2*off, box_h - 2*off);
  
        if (grid[i][j] == 1) {
          fill(PALLET[i]);
          rect(x + off, y + off, box_w - 2*off, box_h - 2*off);
        }
        
        if (isPlaying && position == j && grid[i][j] == 1) {
          sounds[i].play();
          var r = (255 - red(PALLET[i]));
          var g = (255 - green(PALLET[i]));
          var b = (255 - blue(PALLET[i]));
          fill(color(255 - r + 10, 255-g+10, 255 - b + 10));
          rect(x + off, y + off, box_w - 2*off, box_h - 2*off);
        }
      }
    }
    
    if (isPlaying) {
      position = (position + 1) % SEQ_LEN;
    }
  }
  
  
  
  mini_pos += 1;
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



  
