import { value } from "./otherscript.js";

// Using p5.js in "instance mode"
// See p5.js overview:
// https://github.com/processing/p5.js/wiki/p5.js-overview

const instantiate = (p) => {
  let redShader, blueShader, img;

  p.preload = function () {
    // load the shaders
    redShader = p.loadShader("basic.vert", "basic-red.frag");
    blueShader = p.loadShader("basic.vert", "basic-blue.frag");
  };

  p.setup = function () {
    // shaders require WEBGL mode to work
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.setAttributes("alpha", true);
    p.noStroke();
  };

  p.draw = function () {
    // set the active shader depending on the truthiness of imported variable
    if (value) {
      p.shader(redShader);
    } else {
      p.shader(blueShader);
    }

    // rect gives us some geometry on the screen
    p.rect(0, 0, p.width, p.height);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

let myp5 = new p5(instantiate);
