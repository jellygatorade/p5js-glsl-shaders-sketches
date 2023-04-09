// Following Daniel Schiffman's example
// https://editor.p5js.org/codingtrain/sketches/QmTx-Y_UP
// https://youtu.be/E1B4UoSQMFw

// See also
// https://www.classes.cs.uchicago.edu/archive/2021/spring/11111-1/lindenmayer-systems/index.html
//
// These L-systems are
// deterministic: the resulting strings are the same every time;
// context-free: the before clause of each rewrite rule considers a single symbol in isolation (without context of any surrounding symbols); and
// non-parametric: value parameters are defined once per graphical interpretation (such as the line color) or once per system (such as stepSize and turnSize), and cannot be changed or inspected by rewrite rules.

// See also
// https://jsantell.com/l-systems/
// https://jobtalle.com/lindenmayer_systems.html

// variables: A B
// axiom: A
// rules: (A → AB), (B → A)
var angle;
var turnDegrees = 25;
var canvasWidth = 600;
var canvasHeight = 600;
var axiom = "F";
var sentence = axiom;
var weight = 5;
var len = 150;

var rules = [];
rules[0] = {
  a: "F",
  b: "FF+[+F-F-F]-[-F+F+F]",
  //b: "F[+F]F[-F]F",
};

function generate() {
  len *= 0.5;
  var nextSentence = "";
  for (var i = 0; i < sentence.length; i++) {
    var current = sentence.charAt(i);
    var found = false;
    for (var j = 0; j < rules.length; j++) {
      if (current == rules[j].a) {
        found = true;
        nextSentence += rules[j].b;
        break;
      }
    }
    if (!found) {
      nextSentence += current;
    }
  }
  sentence = nextSentence;
  createP(sentence);
  turtle();
}

function turtle() {
  background(51);
  resetMatrix();
  translate(width / 2, height);
  strokeWeight(weight);
  //stroke(255, 100);
  stroke("#ffffff");
  for (var i = 0; i < sentence.length; i++) {
    var current = sentence.charAt(i);

    switch (current) {
      case "F":
        line(0, 0, 0, -len);
        translate(0, -len);
        break;

      case "+":
        rotate(angle);
        break;

      case "-":
        rotate(-angle);
        break;

      case "[":
        push();
        break;

      case "]":
        pop();
        break;

      default:
        createP(`Error with current sentence '${sentence}'.`);
    }
  }
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);

  angle = radians(turnDegrees);
  background(51);
  createP(axiom);
  turtle();

  var button = createButton("generate");
  button.mousePressed(generate);

  //noLoop();
}

// function draw() {
//   line(10, 10, 90, 90);
// }
