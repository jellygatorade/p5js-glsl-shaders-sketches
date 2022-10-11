import { shaderRequested, obj } from "./buttons.js";

/********************************************************************************************
 * Using p5.js in "instance mode"
 * See p5.js overview:
 * https://github.com/processing/p5.js/wiki/p5.js-overview
 *******************************************************************************************/

const instantiate = (p) => {
  let shader, img, canvas, backbuffer, time;

  // p5.disableFriendlyErrors = true;

  p.preload = function () {
    // load the shaders
    shader = p.loadShader("basic.vert", "transition-on-uniform.frag");

    // load the image
    img = p.loadImage("../../images/stock-1-1024x1024-with-guidelines.jpg");
  };

  p.setup = function () {
    // shaders require WEBGL mode to work
    canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    /********************************************************************************************
     *
     *
     *
     *
     *
     *  Something about the alpha channel allowance makes backbuffer blank?
     *
     *
     *
     *
     */
    //p.setAttributes("alpha", true);
    p.noStroke();

    p.textureWrap(p.REPEAT);

    // create an off-screen canvas to be used as a back buffer
    backbuffer = p.createGraphics(p.width, p.height, p.WEBGL);
    backbuffer.clear();
  };

  p.draw = function () {
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

    // Images
    shader.setUniform("texture", img);

    // pass variable from buttons.js as uniform
    shader.setUniform("shaderRequested", shaderRequested);
    shader.setUniform("resetTransition", obj.resetTime);

    // frameCount as time passed
    shader.setUniform("time", p.frameCount);

    // frames counted since last transition requested
    // set this uniform only during frames the transition is needed
    if (countSince <= 101) {
      shader.setUniform("transitionTime", countSince);
    }

    // Canvas dimensions
    shader.setUniform("canvasResolution", [p.width, p.height]);

    // send the mouse values to the shader as a vec2
    // map them so that they go from -1 to 1
    // flip y coordinates so that bottom left is (0,0) as with glsl
    let mx = p.map(p.mouseX, 0, p.width, -1, 1);
    let my = p.map(p.mouseY, 0, p.height, 1, -1);
    shader.setUniform("mouse", [mx, my]);

    // rect gives us some geometry on the screen
    p.rect(0, 0, p.width, p.height);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
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

  //console.log(countSince);

  return countSince;
}

function resetCountSince() {
  countSince = 0;
}

const framerateDOM = document.getElementById("framerate");

let myp5 = new p5(instantiate);
