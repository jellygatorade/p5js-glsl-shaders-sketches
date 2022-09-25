let sh_render, backbuffer, canvas;

function preload() {
  sh_render = loadShader("render.vert", "render.frag");
}

function setup() {
  pixelDensity(1);

  canvas = createCanvas(windowWidth, windowHeight, WEBGL);

  // create an off-screen canvas to be used as a back buffer
  backbuffer = createGraphics(width, height, WEBGL);
  backbuffer.clear();
}

function draw() {
  // move the image drawn on the main canvas from the previous frame to the back buffer
  backbuffer.clear();
  backbuffer.image(canvas, width * -0.5, height * -0.5, width, height);
  //backbuffer.image(canvas, -200, -20, width, height);

  clear();

  shader(sh_render);
  // send the back buffer, where the previous frame was drawn, into the shader program
  sh_render.setUniform("buffer", backbuffer);

  // enter a value to calculate according to the current screen size
  sh_render.setUniform("res", [width, height]);

  // a value to accurately calculate the screen size
  sh_render.setUniform("pixel_density", [pixelDensity()]);

  // time as current frame count
  sh_render.setUniform("time", [frameCount]);

  // since the mouse coordinates and the position of pixels in the shader are converted into values between 0 and 1, the mouse coordinates are also changed accordingly
  let mx = mouseX / width;
  let my = 1 + (-1 * mouseY) / height;
  sh_render.setUniform("mouse", [mx, my]);

  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
