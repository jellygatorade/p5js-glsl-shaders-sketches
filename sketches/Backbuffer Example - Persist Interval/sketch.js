let sh_render, backbuffer, canvas;

function preload() {
  sh_render = loadShader("render.vert", "render.frag");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);

  // create an off-screen canvas to be used as a back buffer
  backbuffer = createGraphics(width, height, WEBGL);
  backbuffer.clear();
}

let currentFrame; // defined outside of function scope because need to access within if block

function draw() {
  let persist = frameCount % 100 === 0 || frameCount === 1; // true if frameCount is 1 or a multiple of 100
  let discard = false;

  if (persist) {
    // Every 100 frames
    //console.log(currentFrame);
    discard = true;
    currentFrame = frameCount;
  }

  if (frameCount === currentFrame + 1) {
    // Then on the next frame, clear and write canvas to the backbuffer.
    //console.log(currentFrame, frameCount);
    backbuffer.clear();
    backbuffer.image(canvas, width * -0.5, height * -0.5, width, height);
  }

  shader(sh_render);

  // send the back buffer, where the previous frame was drawn, into the shader program
  sh_render.setUniform("buffer", backbuffer);

  sh_render.setUniform("discardBackBuffer", discard);

  // enter a value to calculate according to the current screen size
  sh_render.setUniform("res", [width, height]);

  // time as current frame count
  sh_render.setUniform("time", [frameCount]);

  // since the mouse coordinates and the position of pixels in the shader are converted into values between 0 and 1, the mouse coordinates are also changed accordingly
  let mx = mouseX / width;
  let my = 1 + (-1 * mouseY) / height;
  sh_render.setUniform("mouse", [mx, my]);

  rect(0, 0, width, height);
}

function windowResized() {
  //backbuffer.size(windowWidth, windowHeight);
  resizeCanvas(windowWidth, windowHeight);
  // backbuffer.width = windowWidth;
  // backbuffer.height = windowHeight;
  // backbuffer.size(windowWidth, windowHeight);
  // backbuffer.size(width, height);
}
