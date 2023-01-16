// Following Daniel Shiffman's example
// https://editor.p5js.org/codingtrain/sketches/UtSMCB1zv

// function make1DArray(cols) {
//   let arr = new Array(cols);
//   return arr;
// }

// function countNeighbors(grid, x, cols) {
//   let sum = 0;
//   for (let i = -1; i < 2; i++) {
//     let col = (x + i + cols) % cols;
//     sum += grid[col];
//   }
//   sum -= grid[x];
//   return sum;
// }

// https://dev.to/turneremma21/circular-access-of-array-in-javascript-j52
const circularArrayAccess = (currentIndex, arr, direction) => {
  let i;
  if (direction === "left") {
    i = currentIndex - 1;
  } else if (direction === "right") {
    i = currentIndex + 1;
  }
  const n = arr.length;
  return arr[((i % n) + n) % n];
};

function XOR(a, b) {
  return (a || b) && !(a && b);
}

const instantiate0 = (p) => {
  let canvasParent;
  let grid;
  let cols;
  let row = 0;
  let resolution = 10;

  canvasParent = document.getElementById("p5-canvas-0");

  p.setup = function () {
    canvas = p.createCanvas(
      canvasParent.clientWidth,
      canvasParent.clientHeight
    );

    canvas.parent(canvasParent);

    p.noStroke();

    p.pixelDensity(1);

    p.frameRate(5);

    cols = p.width / resolution; // must result in integer

    grid = new Array(cols);
    for (let i = 0; i < cols; i++) {
      grid[i] = p.floor(p.random(2)); // initialize cells with random on/off value
    }

    console.log(grid);
  };

  p.draw = function () {
    //p.background(0); // black background

    for (let i = 0; i < cols; i++) {
      let x = i * resolution;
      if (grid[i] == 1) {
        p.fill(255);
        p.stroke(0);
        p.rect(x, row, resolution - 1, resolution - 1);
      }
    }

    row += 10;
    if (row > p.height) {
      row = 0;
      p.background(0);
    }

    let next = new Array(cols);

    // Compute next based on grid
    for (let i = 0; i < cols; i++) {
      let left = circularArrayAccess(i, grid, "left");
      let self = grid[i];
      let right = circularArrayAccess(i, grid, "right");

      // Rule 30 - https://en.wikipedia.org/wiki/Rule_30
      // left_cell XOR (central_cell OR right_cell)
      next[i] = XOR(left === 1, self === 1 || right === 1) ? 1 : 0;
    }

    grid = next;
  };

  p.windowResized = function () {
    p.resizeCanvas(canvasParent.clientWidth, canvasParent.clientHeight);
  };
};

let p5inst0 = new p5(instantiate0);
