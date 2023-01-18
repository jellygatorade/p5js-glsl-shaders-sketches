let canvas, myShader, time;

let bufferedFrame;
let bufferedFrames = [];
const keepFrames = 10;

let canvasCtxArray = [];

const config = {
  width: 400,
  height: 100,
};

// Adds new canvas to dom and returns the 2d canvas context
function createNewCanvas() {
  const HTMLcanvas = document.createElement("canvas");
  HTMLcanvas.width = config.width;
  HTMLcanvas.height = config.height;
  document.getElementById("canvas-parent").appendChild(HTMLcanvas);

  const HTMLcontext = HTMLcanvas.getContext("2d");
  return HTMLcontext;
}

function preload() {
  // load the myShader
  myShader = loadShader("basic.vert", "shadertoy-default.frag");
}

function setup() {
  // myShaders require WEBGL mode to work
  canvas = createCanvas(config.width, config.height, WEBGL);

  noStroke();

  frameRate(60);

  canvas.parent(document.getElementById("canvas-parent"));

  for (let i = 0; i < keepFrames; i++) {
    canvasCtxArray.push(createNewCanvas());
  }
}

function draw() {
  // set the active shader
  shader(myShader);

  // Canvas dimensions
  myShader.setUniform("canvasResolution", [width, height]);

  // frameCount as time passed
  myShader.setUniform("time", frameCount);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);

  /******************************************************
   * After you complete whatever normal p5 sketching
   * Grab the current frame (the one before the one currently being drawn)
   * and write to the new canvas contexts
   ******************************************************/

  // Store the last frame
  bufferedFrame = canvas.get();

  // get the HTML canvas ImageData object from the Canvas API
  let imageData = bufferedFrame.canvas
    .getContext("2d")
    .getImageData(0, 0, config.width, config.height);

  // Keep an array of the last keepFrames amount of ImageData
  bufferedFrames.unshift(imageData);
  if (bufferedFrames.length > keepFrames) {
    bufferedFrames.pop();
  }

  // Write each ImageData in bufferedFrames to DOM
  for (let i = 0; i < bufferedFrames.length; i++) {
    canvasCtxArray[i].putImageData(bufferedFrames[i], 0, 0);
  }
}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }
