let canvas, myShader, img1, img2, tex1, tex2;

function preload() {
  // load the myShader
  myShader = loadShader(
    "basic.vert",
    "checkerboard-tex-conformal-transform.frag"
  );

  // load the images
  img1 = loadImage("../../images/stock-1-1024x1024-with-guidelines.jpg");
  img2 = loadImage(
    "../../images/stock-1-1024x1024-with-guidelines-inverted.jpg"
  );
}

function setup() {
  // myShaders require WEBGL mode to work
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  //tex1 = new p5.Texture(canvas, img1);
  tex1 = new p5.Texture(canvas, img1, {
    wrapS: REPEAT,
    wrapT: REPEAT,
  });

  tex2 = new p5.Texture(canvas, img2, {
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

  // Images
  myShader.setUniform("p5tex1", tex1);
  myShader.setUniform("p5tex2", tex2);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
