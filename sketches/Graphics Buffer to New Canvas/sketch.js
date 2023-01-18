let canvas, myShader, time;

let bufferedFrame;
let bufferedFrames = [];
const keepFrames = 10;

let canvasCtxArray = [];

const config = {
  width: 400,
  height: 100,
};

function createNewCanvas() {
  const HTMLcanvas = document.createElement("canvas");
  HTMLcanvas.style.width = `${config.width}px`;
  HTMLcanvas.style.height = `${config.height}px`;
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

  //////////////////////////////////////////////////////
  bufferedFrame = canvas.get();

  let imageData = bufferedFrame.canvas
    .getContext("2d")
    .getImageData(0, 0, config.width, config.height);

  bufferedFrames.unshift(imageData);
  if (bufferedFrames.length > keepFrames) {
    bufferedFrames.pop();
  }

  //console.log(bufferedFrames.length);
  // console.log(framebuffer);
  // console.log(
  //   bufferedFrame.canvas
  //     .getContext("2d")
  //     .getImageData(0, 0, canvas.width, canvas.height)
  // );
  //console.log(imageData);

  for (let i = 0; i < bufferedFrames.length; i++) {
    canvasCtxArray[i].putImageData(bufferedFrames[i], 0, 0);
  }
}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }
