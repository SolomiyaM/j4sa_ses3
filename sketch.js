let hh, clap, kick; // assign to audio files
let hPat, cPat, kPat; // array of numbers
let sPat; //sequence stepper

let hPhrase, cPhrase, kPhrase; // part. defines how the pattern is interpreted
let seq; // transport. 

let beatLength = 16;
let cellWidth;

let BPMctrl

let cnv, toggleStart;

function setup() {
  cnv = createCanvas(400, 80);
  cellWidth = width/beatLength;
  
  cnv.mousePressed(canvasClicked);
  toggleStart = createButton('start/stop').position(10,height + 10).mousePressed(() => {
    if (!seq.isPlaying) {
      seq.metro.metroTicks = 0;
      seq.loop();
    } else {
      seq.stop();
    }
  });
  
  hh = loadSound('assets/hh.wav');
  clap = loadSound('assets/clap.wav');
  kick = loadSound('assets/kick.wav');
  
  hPat = [];
    for (let i = 0; i < beatLength; i++) {
        hPat.push(Math.round(Math.random()));
    }

    cPat = [];
    for (let i = 0; i < beatLength; i++) {
        cPat.push(Math.round(Math.random()));
    }

    kPat = [];
    for (let i = 0; i < beatLength; i++) {
        kPat.push(Math.round(Math.random()));
    }


    sPat = [];
    for (let i = 1; i < beatLength + 1; i++) {
        sPat.push(i);
    }
  
  hPhrase = new p5.Phrase('hhName', function(time){hh.play(time);},hPat);
  cPhrase = new p5.Phrase('clapName', function(time){clap.play(time);},cPat);
  kPhrase = new p5.Phrase('kickName', function(time){kick.play(time);},kPat);
  
  
  
  
  //THIS IS FOR ANIMATING THE PLAY HEAD
  seq = new p5.Part();
  seq.addPhrase(hPhrase);
  seq.addPhrase(cPhrase);
  seq.addPhrase(kPhrase);
  
  // sequencer stepper
  seq.addPhrase('seq', sequence, sPat);
  //the second argument is a functioin whicht recieves two arguments: time, and a beatIndex. See: https://p5js.org/reference/#/p5.Phrase

  
  userStartAudio();
  
  BPMctrl = createSlider(40,300, 80,1);
  BPMctrl.position(10,120);
  seq.setBPM(80);
  
  BPMctrl.input(() => {
    seq.setBPM(BPMctrl.value());
    document.getElementById("bpm").innerHTML = "BPM: "+ BPMctrl.value();
   
    
    
  })

  drawMatrix();
}

function draw() {
  // background(88);

}

function canvasClicked() {
  let rowClicked = floor(mouseY/height*3);
  let indexClicked = floor(mouseX/width*beatLength);
  
  if (rowClicked === 0) {
    hPat[indexClicked] = toggle(hPat[indexClicked]);
    
  } else if (rowClicked === 1) {
    cPat[indexClicked] = toggle(cPat[indexClicked]);
    
  } else if (rowClicked === 2) {
    kPat[indexClicked] = toggle(kPat[indexClicked]);
  }
  
    drawMatrix();
  
}


function drawMatrix() {
   background(88);
  stroke('gray');
  strokeWeight(2);
  fill('white');
  
  // vertical grid
  for (let i = 0; i < beatLength+1; i++) {
    line(i*width/beatLength, 0, i*width/beatLength, height);
  }
  
  // horiz grid
    for (let i = 0; i < 4; i++) {
    line(0, i*height/3, width, i*height/3);
  }
  
  // ellipse
  for (let i = 0; i < beatLength; i++) {
    if (hPat[i] == 1) {
    ellipse(i * width/beatLength + 0.5*width/beatLength,1/6*height,10);  
    }
    if (cPat[i] == 1) {
    ellipse(i * width/beatLength + 0.5*width/beatLength,1/2*height,10);
    }
    if (kPat[i] == 1) {
     ellipse(i * width/beatLength + 0.5*width/beatLength,5/6*height,10); 
    }
}
}

function toggle(input) {
 return  input === 1 ? 0 : 1;
}

function sequence(time, beatIndex) {
  setTimeout(() => {
    drawMatrix();
  drawPlayhead(beatIndex);
  }, time*1000);
  
  
} 

function drawPlayhead(beatIndex) {
  
  stroke('red');
  fill(255,0,0,30);
  rect((beatIndex-1)*cellWidth, 0 , cellWidth, height);
}//animating a playhead




