import { shaderRequested, obj } from "./buttons.js";

/********************************************************************************************
 * Using p5.js in "instance mode"
 * See p5.js overview:
 * https://github.com/processing/p5.js/wiki/p5.js-overview
 *******************************************************************************************/

const instantiate = (p) => {
  let shader, canvas, backbuffer, time;

  p.preload = function () {
    // load the shaders
    shader = p.loadShader("basic.vert", "transition-on-uniform.frag");
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

    // create an off-screen canvas to be used as a back buffer
    backbuffer = p.createGraphics(p.width, p.height, p.WEBGL);
    backbuffer.clear();
  };

  p.draw = function () {
    // set the active shader
    p.shader(shader);

    time = p.frameCount;
    frameCounter();

    if (obj.resetTime) {
      console.log("called");
      obj.resetTime = false;
      // time = time % 120;
      // console.log(time);
      resetCountSince();
    }

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
    shader.setUniform("buffer", backbuffer);

    // pass variable from buttons.js as uniform
    shader.setUniform("shaderRequested", shaderRequested);
    shader.setUniform("resetTransition", obj.resetTime);

    // frameCount as time passed
    shader.setUniform("time", p.frameCount);
    shader.setUniform("transitionTime", countSince);
    //console.log(countSince);

    // Canvas dimensions
    shader.setUniform("canvasResolution", [p.width, p.height]);

    // since the mouse coordinates and the position of pixels in the shader are converted into values between 0 and 1, the mouse coordinates are also changed accordingly
    let mx = p.mouseX / p.width;
    let my = 1 + (-1 * p.mouseY) / p.height;
    shader.setUniform("mouse", [mx, my]);

    // rect gives us some geometry on the screen
    p.rect(0, 0, p.width, p.height);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

let countSince;

function frameCounter() {
  countSince++;
  return countSince;
}

function resetCountSince() {
  countSince = 0;
}

let myp5 = new p5(instantiate);

/********************************************************************************************
 * Using p5.js in "global mode"
 * See p5.js overview:
 * https://github.com/processing/p5.js/wiki/p5.js-overview
 *******************************************************************************************/

// let theShader, canvas, backbuffer, time;

// function preload() {
//   // load the shaders
//   theShader = loadShader("basic.vert", "transition-on-uniform.frag");
// }

// function setup() {
//   // shaders require WEBGL mode to work
//   canvas = createCanvas(windowWidth, windowHeight, WEBGL);
//   /********************************************************************************************
//    *
//    *
//    *
//    *
//    *
//    *  Something about the alpha channel allowance makes backbuffer blank?
//    *
//    *
//    *
//    *
//    */
//   //setAttributes("alpha", true);
//   noStroke();

//   // create an off-screen canvas to be used as a back buffer
//   backbuffer = createGraphics(width, height, WEBGL);
//   //backbuffer.setAttributes("alpha", true);
//   backbuffer.clear();
// }

// function draw() {
//   time = frameCount;
//   frameCounter();

//   if (obj.resetTime) {
//     obj.resetTime = false;
//     // time = time % 120;
//     // console.log(time);
//     resetCountSince();

//     // move the image drawn on the main canvas from the previous frame to the back buffer
//     backbuffer.clear();
//     backbuffer.image(canvas, width * -0.5, height * -0.5, width, height);
//   }

//   // set the active shader
//   shader(theShader);

//   // send the back buffer, where the previous frame was drawn, into the shader program
//   theShader.setUniform("buffer", backbuffer);

//   // pass variable from buttons.js as uniform
//   theShader.setUniform("shaderRequested", shaderRequested);
//   theShader.setUniform("resetTransition", obj.resetTime);

//   // frameCount as time passed
//   theShader.setUniform("time", frameCount);
//   theShader.setUniform("transitionTime", countSince);
//   //console.log(countSince);

//   // Canvas dimensions
//   theShader.setUniform("canvasResolution", [width, height]);

//   // since the mouse coordinates and the position of pixels in the shader are converted into values between 0 and 1, the mouse coordinates are also changed accordingly
//   let mx = mouseX / width;
//   let my = 1 + (-1 * mouseY) / height;
//   theShader.setUniform("mouse", [mx, my]);

//   // rect gives us some geometry on the screen
//   rect(0, 0, width, height);
// }

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }

// /*********************************/

// let countSince;

// function frameCounter() {
//   countSince++;
//   return countSince;
// }

// function resetCountSince() {
//   countSince = 0;
// }

// /*********************************/

// let shaderRequested = "1";
// let obj = { resetTime: false };

// window.onload = (event) => {
//   const btn1 = document.getElementById("btn-1");
//   const btn2 = document.getElementById("btn-2");

//   btn1.addEventListener("click", action1);
//   btn2.addEventListener("click", action2);

//   function action1() {
//     shaderRequested = 1;
//     obj.resetTime = true;
//   }

//   function action2() {
//     shaderRequested = 2;
//     obj.resetTime = true;
//   }
// };
