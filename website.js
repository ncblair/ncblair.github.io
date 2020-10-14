var sounds;
var start_sound;
var grid;
var position;
var isPlaying;
var started;
var box_w;
var box_h;
var light_color;
var current_page;

var playMode = 'sustain';
var sample;
var SEQ_LEN = 8;
var NOTES = ["A3", "E2", "D4", "G3"];
var sequencer_view = true;
var font;

function preload() {
    font = loadFont("type/galactic-gothic.ttf");
}

function setup() {
  frameRate(4);

  started=false;
  current_page = "sequencer";
  sounds = [];
  num_loaded = 0;
  grid = [];
  position = 0;
  isPlaying = false;
  light_color = color("white");

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

    var cnv = createCanvas(document.getElementById("container").offsetWidth, Math.min(document.getElementById("container").offsetWidth, document.getElementById("container").offsetHeight), WEBGL);
    console.log(width);
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
  textSize(height/5);
  textAlign(CENTER, CENTER);
  textFont(font);
}


function draw() {
    clear();
//    setGradient(color(0, 0, 0, 0), color(255, 255, 255, 255));

    if (sequencer_view && !started) {
        pixel_rect(-width/2, -height/2, width, height, 20, 1, color(255, 255, 255), 20);
        if (!started) {
            fill(255, 255, 255);
            text('sound on.\n press spacebar.', 0, 0);
        }
    }


    if (started) {
        if (sequencer_view) {
            strokeWeight(1);
        }
        box_w = width / SEQ_LEN;
        box_h = height / NOTES.length;
        var off = 10;
        var off2 = 15;

        for (var i = 0; i < NOTES.length; i++) {
            for (var j = 0; j < SEQ_LEN; j++) {
                x = j*box_w;
                y = i*box_h;

                if (sequencer_view) {
                    if (position == j) {
                        pixel_rect(x - width/2, height/2 -10, box_w, 10, 10, 5, light_color, 60);
                    }
                    fill(0);
                    stroke(255);
                    //erase();
                    rect(x + off - width/2, y + off - height/2, box_w - 2*off, box_h - 2*off);
                    
                    noErase();
                }



                if (isPlaying && position == j && grid[i][j] == 1) {
                    sounds[i].play();
                    if (sequencer_view) {
                        var r = red(light_color);
                        var g = green(light_color);
                        var b = blue(light_color);
                        
                        pixel_rect(x + off2 - width/2, y + off2 -height/2, box_w - 2*off2, box_h - 2*off2, 10, 3, light_color, 60);         
                    }

                }
                else if (sequencer_view && (grid[i][j] == 1)) {
                    pixel_rect(x + off2 - width/2, y + off2 - height / 2, box_w - 2*off2, box_h - 2*off2, 10, 3, light_color, 0);
                }
          }
    }
    if (isPlaying) {
        position = (position + 1) % SEQ_LEN;
    }
  }
}

function mousePressed(event) {
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
    resizeCanvas(document.getElementById("container").offsetWidth, Math.min(document.getElementById("container").offsetWidth, document.getElementById("container").offsetHeight));
    textSize(height/5);
}

function page_sw(page) {
    console.log(current_page, page);
    var pages = ["home", "sequencer", "music", "papers", "store"];
    if (current_page == "home") {
        console.log("leaving home");
    }
    else if (current_page == "sequencer") {
        document.getElementById("container").style.display = "none";
        document.getElementById("sequencer").style.fontWeight = "normal";
    }
    else if (current_page == "music") {
        document.getElementById("music-masonry").style.display = "none";
        document.getElementById("music").style.fontWeight = "normal";
    }
    else if (current_page == "papers") {
        document.getElementById("papers-masonry").style.display = "none";
        document.getElementById("papers").style.fontWeight = "normal";
    }
    else if (current_page == "store") {
        document.getElementById("store-content").style.display = "none";
        document.getElementById("store").style.fontWeight = "normal";
    }
    current_page = page;
    if (page == "home") {
        console.log("home");
    }
    else if (page == "sequencer") {
        document.getElementById("container").style.display = "initial";
        document.getElementById("sequencer").style.fontWeight = "bold";
        windowResized();
    }
    else if (page == "music") {
        document.getElementById("music-masonry").style.display = "initial";
        document.getElementById("music").style.fontWeight = "bold";
    }
    else if (page == "papers") {
        document.getElementById("papers-masonry").style.display = "initial";
        document.getElementById("papers").style.fontWeight = "bold";
    }
    else if (page == "store") {
        document.getElementById("store-content").style.display = "initial";
        document.getElementById("store").style.fontWeight = "bold";
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

function vh(v) {
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return (v * h) / 100;
}

//masonry
var grid = document.querySelector('.grid');
var msnry = new Masonry( grid, {
  // options...
    itemSelector: '.grid-item',
    columnWidth: 200,
    isAnimated: true,
    animationOptions: {
        duration: 1000,
        easing: 'linear',
        queue: false
    }
});

function setGradient(c1, c2) {
  // noprotect
  noFill();
  for (var y = -height/2; y < height/2; y++) {
    var inter = map(y, -height/2, height/2, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(-width/2, y, width, y);
  }
}
