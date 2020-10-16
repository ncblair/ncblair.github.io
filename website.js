var polySynth;
var bassSynth;
var delay;
var start_sound;
var grid;
var position;
var isPlaying;
var started;
var box_w;
var box_h;
var light_color;
var current_page;

var recording = false;
var recorder;
var soundFile;

var SEQ_LEN = 8;
var NOTES = [69, 66, 62, 55];
var HARMS = [78,  74, 71, 62];
var bass_osc_markov = {
    36:[38, 33, 40], 
    38:[40, 36],
    40:[33, 36],
    33:[38, 40, 36],
    31:[40, 33 , 38]
};
var resolve_bass = 0;
var curr_bassnote = 31 ;
var sequencer_view = false;
var font;
var resizeCanv;
var harmonize = false;
var queue_harm = false;

var mesh;
var fullScreen;

function preload() {
    font = loadFont("type/galactic-gothic.ttf");
}

function setup() {
    frameRate(4);

    started=false;
    current_page = "home";
    grid = [];
    position = 0;
    isPlaying = false;
    light_color = color("white");

    var rand1 = Math.floor(Math.random()*NOTES.length*SEQ_LEN);
    var rand2 = Math.floor(Math.random()*NOTES.length*SEQ_LEN);

    start_sound = loadSound("sounds/fireplace.mp3");
    start_sound.setVolume(0.2);
    
    recorder = new p5.SoundRecorder();
    soundFile = new p5.SoundFile();

    for (var i = 0; i < NOTES.length; i++) {
        note = NOTES[i];


        grid.push([]);
        for (var j = 0; j < SEQ_LEN; j++) {
            if (j*NOTES.length + i == rand1 || j*NOTES.length + i == rand2) {
                grid[i].push(1);
            }
            grid[i].push(0);
        }
    }

    var cnv = createCanvas(document.getElementById("container").offsetWidth, Math.min(document.getElementById("container").offsetWidth, document.getElementById("container").offsetHeight), WEBGL);
    cnv.parent("container");

    document.body.onkeyup = function(e){toggle_sound(e)};
    
    textSize(height/5);
    textAlign(CENTER, CENTER);
    textFont(font);
    
    polySynth = new p5.PolySynth();
    bassSynth = new p5.PolySynth();
    delay = new p5.Delay();
    delay.setType(1);
    delay.process(polySynth, .25, .5, 2500);
    delay.amp(0);
    document.getElementById("slider3").value = random(100);
    mesh = new Mesh(8);
}


function draw() {
    //--sound stuff--
    var signal_delay = (document.getElementById("slider3").value - 1)/99;
    var pitch_shift = 1 + .05946309436*(document.getElementById("slider2").value - 1)/99;
    var harm_vel = document.getElementById("slider1").value/500;
    delay.amp(signal_delay);
    //--visual and loop--
    if (sequencer_view || !isPlaying) {
        clear();
    }
    else if (!recording) {
        //clear();
        noStroke();
        specularMaterial(255, 254 - signal_delay*150);
        plane(width, height);
    }
    
    //flash sidebar if recording
    if (recording) {
        if (position % 4 < 2) {
            document.getElementById("sidebar").style.borderColor = "red";
        }
        else {
            document.getElementById("sidebar").style.borderColor = "rgba(220, 220, 220, .95)";
        }
        
    }

    if (resizeCanv) {
        if (sequencer_view) {
            resizeCanvas(document.getElementById("container").offsetWidth, Math.min(document.getElementById("container").offsetWidth, document.getElementById("container").offsetHeight));
            resizeCanv = false;
        }
        else {
            resizeCanvas(document.getElementById("container").offsetWidth, Math.min(document.getElementById("container").offsetWidth, document.getElementById("container").offsetHeight));
            resizeCanv = false;
        }
    }

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
                    polySynth.play(midiToFreq(NOTES[i])*pitch_shift, .2, 0, .2);
                    polySynth.play(midiToFreq(HARMS[i])*pitch_shift, harm_vel, 0, .2);
                    
                    
                    
                    if (sequencer_view) {
                        var r = red(light_color);
                        var g = green(light_color);
                        var b = blue(light_color);

                        pixel_rect(x + off2 - width/2, y + off2 -height/2, box_w - 2*off2, box_h - 2*off2, 10, 3, light_color, 60);         
                    }
                    else {
                        if (i == 0) {
                            directionalLight(100, 100, 100, -1, 0, 0);
                        }
                        if (i == 1) {
                            directionalLight(100, 100, 100, 1, 0, 0);
                        }
                        if (i == 2) {
                            directionalLight(100, 100, 100, 0, -1, 0);
                        }
                        if (i == 3) {
                            directionalLight(100, 100, 100, 0, 1, 0);
                        }
                    }

                }
                else if (sequencer_view && (grid[i][j] == 1)) {
                    pixel_rect(x + off2 - width/2, y + off2 - height / 2, box_w - 2*off2, box_h - 2*off2, 10, 3, light_color, 0);
                }
            }
        }
        //--bass markov section
        if (position == 0 && queue_harm) {
            harmonize = true;
            queue_harm = false;
        }
        if (isPlaying && position < 4 && harmonize) {
            if (position == 0) {
                curr_bassnote = random(bass_osc_markov[curr_bassnote]);
                if ((resolve_bass % 4 == 0) && (random() > .7)) {
                    curr_bassnote = 36;
                }
                bassSynth.play(midiToFreq(curr_bassnote), .3, 0, 1);
                resolve_bass += 1;           
            }
            
            if (!sequencer_view) {
                ambientLight(random(255), random(255), random(255));
            }

        }
        
        if (isPlaying) {
            position = (position + 1) % SEQ_LEN;
        }
    }
    
    if (!sequencer_view) {
        if (!isPlaying) {
            var speed = .1;
        }
        else {
            var speed = .1;
        }
        if (fullScreen) {
            camera(0, 0, -1, 0, 0, -2, 0, 1, 0);
            background(0);
        }
        mesh.update(speed);
        mesh.draw(isPlaying);
    }
}

function mousePressed(event) {
    if (event.srcElement === document.getElementById("defaultCanvas0")) {
        if (sequencer_view) {
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
        }
        else {
//            fullScreen = !fullScreen;
//            if (fullScreen) {
//                document.getElementById("container").style.paddingLeft = "300px";
//                document.getElementById("container").style.width = "calc(90% - 300px)";
//                document.getElementById("container").style.zIndex = "3";
//            }
//            else {
//                document.getElementById("container").style.paddingLeft = "700px";
//                document.getElementById("container").style.width = "calc(95% - 700px)";
//                document.getElementById("container").style.zIndex = "0";
//            }

            resizeCanv = true;
        }
    }
}


function windowResized() {
    resizeCanv = true;
    textSize(height/5);
    
}

function page_sw(page) {
    console.log(current_page, page);
    var pages = ["home", "sequencer", "music", "papers", "store"];
    if (current_page == "home") {
        document.getElementById("container").style.display = "none";
        document.getElementById("about-container").style.display = "none";
        document.getElementById("home").style.fontWeight = "normal";
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
        document.getElementById("container").style.display = "initial";
        document.getElementById("container").style.paddingLeft = "700px";
        document.getElementById("container").style.width = "calc(95% - 700px)";     
        document.getElementById("about-container").style.display = "initial";
        document.getElementById("home").style.fontWeight = "bold";
        document.getElementById("sequencer").style.cursor = "pointer";
        windowResized();
        sequencer_view = false;
        fullScreen = false;
    }
    else if (page == "sequencer") {
        document.getElementById("container").style.display = "initial";
        document.getElementById("container").style.paddingLeft = "300px";
        document.getElementById("container").style.width = "calc(90% - 300px)";
        document.getElementById("sequencer").style.fontWeight = "bold";
        document.getElementById("sequencer").style.cursor = "auto";
        windowResized();
        sequencer_view = true;
    }
    else if (page == "music") {
        document.getElementById("music-masonry").style.display = "initial";
        document.getElementById("music").style.fontWeight = "bold";
        mason($('.grid'));
    }
    else if (page == "papers") {
        document.getElementById("papers-masonry").style.display = "initial";
        document.getElementById("papers").style.fontWeight = "bold";
        mason($('.grid'));
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
$( document ).ready(function() {
    mason($('.grid'));
});

function mason(selector) {
    selector.masonry({
        // options
        itemSelector: '.grid-item',
        columnWidth: 200, 
        isAnimated: true,
        animationOptions: {
            duration: 600,
            easing: 'linear',
            queue: false
        }
    });
}

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

function toggle_sound(e){
    if (e == 32 || e.keyCode === 32 || e.key === ' ') {
        if (isPlaying) {
            document.getElementById("playpause").innerHTML="run sequencer"
            start_sound.stop();
        }
        else {
            document.getElementById("playpause").innerHTML="stop sequencer"
            start_sound.loop();
        }
        isPlaying = !isPlaying; 
        started=true;
    }
}

function toggle_harmonizer() {
    resolve_bass = 0;
    curr_bassnote = 31;
    if (!harmonize) {
        queue_harm = true;
        document.getElementById("harmonizer").innerHTML = "stop bass";
    }
    else {
        harmonize=false;
        queue_harm=false;
        document.getElementById("harmonizer").innerHTML = "bass";
    }
}

function toggle_record() {
    recording = !recording;
    if (recording) {
        document.getElementById("record").innerHTML = "cancel";
        document.getElementById("download").innerHTML = "download";
        document.getElementById("download").style.backgroundColor = "green";
        recorder.record(soundFile);
    }
    else {
        document.getElementById("record").innerHTML = "record audio";
        document.getElementById("download").innerHTML = "";
        document.getElementById("download").style.backgroundColor = "gray";
        recorder.stop();
        document.getElementById("sidebar").style.borderColor = "rgba(220, 220, 220, .95)";
    }
}

function download() {
    if (recording) {
        recorder.stop();
        try {
          saveSound(soundFile, 'myAudio.wav');
        }
        catch(err) {
          alert("Error saving file. Usually this will be resolved if you try again");
        }
        

        recording = false;
        document.getElementById("record").innerHTML = "record audio";
        document.getElementById("download").innerHTML = "";
        document.getElementById("download").style.backgroundColor = "gray";
        document.getElementById("sidebar").style.borderColor = "rgba(220, 220, 220, .95)";
    }
}