import { shaderRequested, obj } from "./buttons.js";

/********************************************************************************************
 * Using p5.js in "instance mode"
 * See p5.js overview:
 * https://github.com/processing/p5.js/wiki/p5.js-overview
 *******************************************************************************************/

const instantiate = (p) => {
  let shader, rdImg, vmImg1, vmImg2, canvas, backbuffer, time;

  let rdTex;

  p.preload = function () {
    // load shaders
    shader = p.loadShader(
      "glsl-aspect-fit-fill.vert",
      "glsl-transition-on-uniform.frag"
    );

    // load images
    rdImg = p.loadImage("../../images/stock-1-1024x1024-with-guidelines.jpg");
    vmImg1 = p.loadImage("../../images/seaweed-green.jpg");
    vmImg2 = p.loadImage("../../images/sun-fence.jpg");
  };

  p.setup = function () {
    // shaders require WEBGL mode to work
    canvas = p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL); // using window. instead of p.windowWidth because of Edge bug
    p.noStroke();

    // create an off-screen canvas to be used as a back buffer
    backbuffer = p.createGraphics(p.width, p.height, p.WEBGL);
    backbuffer.clear();

    // set texture wrap modes from images
    // only if REPEAT or MIRROR is required, by default images will be set to CLAMP
    // this is alternative to setting the texture wrap mode globally with p.textureWrap(p.REPEAT)
    rdTex = new p5.Texture(canvas, rdImg);
    rdTex.setWrapMode(p.REPEAT, p.REPEAT);
  };

  p.draw = function () {
    // rect gives us some geometry on the screen
    // 0 width and height so that it doesn't show for any frames
    p.rect(0, 0, 0, 0);
    //p.color("black");

    // set the active shader
    p.shader(shader);

    time = p.frameCount;
    transitionFrameCounter(p);

    // display framerate
    let rate = p.frameRate();
    rate = (Math.round(rate * 100) / 100).toFixed(2); // round to two decimal places
    framerateDOM.innerText = rate;

    if (obj.resetTime) {
      // shader transition has been requested (buttons.js)
      obj.resetTime = false;
      resetCountSince();

      // move the image drawn on the main canvas from the previous frame to the back buffer
      backbuffer.clear();
      backbuffer.image(
        canvas,
        p.width * -0.5,
        p.height * -0.5,
        p.width,
        p.height
      );

      // send the back buffer, where the previous frame was drawn, into the shader program
      // using get() method to pass a p5.Image object is much preferable to passing the entire p5.Renderer object
      shader.setUniform("backbuffer", backbuffer.get());
    }

    // frames counted since last transition requested
    // set this uniform only during frames the transition is needed
    if (countSince <= 101) {
      shader.setUniform("transitionTime", countSince);
    }

    // images / textures
    shader.setUniform("radDistortTex", rdTex);
    shader.setUniform("voronoiMaskTex1", vmImg1);
    shader.setUniform("voronoiMaskTex2", vmImg2);

    // pass variable from buttons.js as uniform
    shader.setUniform("shaderRequested", shaderRequested);
    shader.setUniform("resetTransition", obj.resetTime);

    // p.frameCount as time passed
    shader.setUniform("time", p.frameCount);

    // canvas dimensions
    shader.setUniform("canvasResolution", [p.width, p.height]);

    // texture dimensions for glsl-aspect-fit-fill.vert
    shader.setUniform("textureResolution", [vmImg1.width, vmImg1.height]);

    // send the mouse values to the shader as a vec2
    // map them so that they go from -1 to 1
    // flip y coordinates so that bottom left is (0,0) as with glsl
    let mx = p.map(p.mouseX, 0, p.width, -1, 1);
    let my = p.map(p.mouseY, 0, p.height, 1, -1);
    shader.setUniform("mouse", [mx, my]);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    backbuffer.resizeCanvas(p.width, p.height); // or, backbuffer.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

let countSince = 0;

function transitionFrameCounter(p) {
  // Ensure 101 is hit and then something above, so transition completes and uniform stops being set
  switch (true) {
    case countSince < 100:
      countSince += 1 * p.deltaTime * 0.1;
      break;
    case countSince === 101:
      countSince = 102;
      break;
    case countSince === 102:
      countSince = 102;
      break;
    default: // countSince is 100 or above but not exactly 101 or 102
      countSince = 101;
  }

  return countSince;
}

function resetCountSince() {
  countSince = 0;
}

const framerateDOM = document.getElementById("framerate");

let myp5 = new p5(instantiate);
