const instantiate1 = (p) => {
  let canvasParent, wrShader, img;

  canvasParent = document.getElementById("p5-canvas-0");

  p.preload = function () {
    // load the shader
    wrShader = p.loadShader("water-reflection.vert", "water-reflection.frag");

    // load the image
    //img = loadImage("word-1024x1024.png");
    //img = loadImage("ed-ruscha-mint-512x512.jpg");
    img = p.loadImage("../../images/seaweed-green-1024x1024.jpg");
  };

  p.setup = function () {
    // shaders require WEBGL mode to work
    canvas = p.createCanvas(
      canvasParent.clientWidth,
      canvasParent.clientHeight,
      p.WEBGL
    );

    canvas.parent(canvasParent);

    p.noStroke();

    p.pixelDensity(1);

    // REPEAT and MIRROR are only available if the texture is a power of two size (128, 256, 512, 1024, etc.).
    //textureWrap(MIRROR);
    p.textureWrap(p.REPEAT);
  };

  p.draw = function () {
    // set the active shader
    p.shader(wrShader);

    ////
    // setUniform can send various data to the shader

    // frameCount as time passed
    wrShader.setUniform("time", p.frameCount);

    // Image
    wrShader.setUniform("texture1", img);

    // Canvas dimensions
    wrShader.setUniform("canvasResolution", [p.width, p.height]);

    // Texture dimensions
    wrShader.setUniform("textureResolution", [img.width, img.height]);

    // lets send the mouse values to the shader as a vec2
    // first we will map them so that they go from 0 - 1
    let mx = p.map(p.mouseX, 0, p.width, 0, 1);
    let my = p.map(p.mouseY, 0, p.height, 0, 1);
    wrShader.setUniform("mouse", [mx, my]);
    ////

    // rect gives us some geometry on the screen
    p.rect(0, 0, p.width, p.height);
  };

  p.windowResized = function () {
    p.resizeCanvas(canvasParent.clientWidth, canvasParent.clientHeight);

    //   // for a better solution another time
    //   forceResize();
    //   setTimeout(forceResize, 250);
    //   setTimeout(forceResize, 500);
    //   setTimeout(forceResize, 750);
    //   setTimeout(forceResize, 1000);
    // };

    // function forceResize() {
    //   if (canvasParent.clientWidth !== canvas.width) {
    //     while (canvasParent.clientWidth !== canvas.width) {
    //       p.resizeCanvas(canvasParent.clientWidth, canvasParent.clientHeight);
    //     }
    //   }
  };
};

let p5inst1 = new p5(instantiate1);
