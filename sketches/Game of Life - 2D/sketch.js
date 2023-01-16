// Following Daniel Shiffman's example
// https://editor.p5js.org/codingtrain/sketches/UtSMCB1zv

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

function countNeighbors(grid, x, y, cols, rows) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}

const instantiate0 = (p) => {
  let canvasParent;
  let grid;
  let cols;
  let rows;
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

    cols = p.width / resolution; // must result in integer
    rows = p.height / resolution; // must result in integer

    grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = p.floor(p.random(2));
      }
    }
  };

  p.draw = function () {
    p.background(0); // black background

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * resolution;
        let y = j * resolution;
        if (grid[i][j] == 1) {
          p.fill(255);
          p.stroke(0);
          p.rect(x, y, resolution - 1, resolution - 1);
        }
      }
    }

    let next = make2DArray(cols, rows);

    // Compute next based on grid
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];
        // Count live neighbors!
        let neighbors = countNeighbors(grid, i, j, cols, rows);

        if (state == 0 && neighbors == 3) {
          next[i][j] = 1;
        } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
          next[i][j] = 0;
        } else {
          next[i][j] = state;
        }
      }
    }

    grid = next;
  };

  p.windowResized = function () {
    p.resizeCanvas(canvasParent.clientWidth, canvasParent.clientHeight);
  };
};

let p5inst0 = new p5(instantiate0);
