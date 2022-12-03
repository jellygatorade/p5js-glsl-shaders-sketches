let canvas, myShader, img;

let tex1, tex2;

function preload() {
  // load shader
  myShader = loadShader("basic.vert", "texture-wrap-example.frag");

  // load image
  img = loadImage("../../images/stock-1-1024x1024-with-guidelines.jpg");
}

function setup() {
  // shaders require WEBGL mode to work
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Example of using the new p5.Texture() operator at https://github.com/processing/p5.js/issues/5556
  tex0 = new p5.Texture(canvas, img);
  //tex0.setWrapMode(CLAMP, CLAMP); // p5.Texture.prototype.setWrapMode() found in /src/webgl/p5.Texture.js

  tex1 = new p5.Texture(canvas, img);
  //tex1.setWrapMode(MIRROR, MIRROR);
  tex1 = new p5.Texture(canvas, img, {
    wrapS: MIRROR,
    wrapT: MIRROR,
  });

  //tex2 = new p5.Texture(canvas, img);
  // tex2.setWrapMode(REPEAT, REPEAT);
  tex2 = new p5.Texture(canvas, img, {
    wrapS: REPEAT,
    wrapT: REPEAT,
  });
}

function draw() {
  // set the active shader
  shader(myShader);

  // Canvas dimensions
  myShader.setUniform("canvasResolution", [width, height]);

  // frameCount as time passed
  myShader.setUniform("time", frameCount);

  // textures
  myShader.setUniform("tex0", tex0);
  myShader.setUniform("tex1", tex1);
  myShader.setUniform("tex2", tex2);

  // verifying that I set up texture cycling in frag shader correctly
  //
  // if (frameCount % 100 == 0.0) {
  //   console.log(frameCount);
  // }

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
