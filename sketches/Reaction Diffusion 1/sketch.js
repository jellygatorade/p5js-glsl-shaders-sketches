// Following Daniel Schiffman's example of Karl Sims
// https://www.youtube.com/watch?v=BV9ny785UNc&t=17s

let canvas, grid, next;

let dA = 1;
let dB = 0.5;
let feed = 0.055;
let kill = 0.062;

function preload() {}

function setup() {
  canvas = createCanvas(500, 500);
  pixelDensity(1);

  grid = [];

  for (var x = 0; x < width; x++) {
    grid[x] = [];
    for (var y = 0; y < height; y++) {
      grid[x][y] = { a: 1, b: 0 };
    }
  }

  //next = [...grid]; // deep copy grid to next

  for (var i = width / 2; i < width / 2 + 200; i++) {
    for (var j = height / 2; j < height / 2 + 100; j++) {
      grid[i][j].b = 1;
    }
  }

  next = [...grid]; // deep copy grid to next

  //console.log(grid, next);
}

function draw() {
  for (var x = 1; x < width - 1; x++) {
    for (var y = 1; y < height - 1; y++) {
      let a = grid[x][y].a;
      let b = grid[x][y].b;

      // next[x][y].a =
      //   a +
      //   // deltaTime *
      //   //   0.005 *
      //   (dA * laplaceA(x, y) * a - a * b * b + feed * (1 - a));

      // next[x][y].b =
      //   b +
      //   // deltaTime *
      //   //   0.005 *
      //   (dB * laplaceB(x, y) * b + a * b * b - (kill + feed) * b);

      next[x][y].a = a + dA * laplaceA(x, y) - a * b * b + feed * (1 - a);
      next[x][y].b = b + dB * laplaceB(x, y) + a * b * b - (kill + feed) * b;

      next[x][y].a = constrain(next[x][y].a, 0, 1);
      next[x][y].b = constrain(next[x][y].b, 0, 1);
    }
  }

  loadPixels();
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var pix = (x + y * width) * 4;

      var a = next[x][y].a;
      var b = next[x][y].b;
      var c = floor((a - b) * 255);
      c = constrain(c, 0, 255);

      pixels[pix + 0] = c; // r
      pixels[pix + 1] = c; // g
      pixels[pix + 2] = c; // b
      pixels[pix + 3] = 255; // a
    }
  }
  updatePixels();

  swap();
}

function laplaceA(x, y) {
  let sumA = 0;
  sumA += grid[x][y].a * -1;
  sumA += grid[x - 1][y].a * 0.2;
  sumA += grid[x + 1][y].a * 0.2;
  sumA += grid[x][y - 1].a * 0.2;
  sumA += grid[x][y + 1].a * 0.2;
  sumA += grid[x - 1][y - 1].a * 0.05;
  sumA += grid[x - 1][y + 1].a * 0.05;
  sumA += grid[x + 1][y - 1].a * 0.05;
  sumA += grid[x + 1][y + 1].a * 0.05;
  return sumA;
}

function laplaceB(x, y) {
  let sumB = 0;
  sumB += grid[x][y].b * -1;
  sumB += grid[x - 1][y].b * 0.2;
  sumB += grid[x + 1][y].b * 0.2;
  sumB += grid[x][y - 1].b * 0.2;
  sumB += grid[x][y + 1].b * 0.2;
  sumB += grid[x - 1][y - 1].b * 0.05;
  sumB += grid[x - 1][y + 1].b * 0.05;
  sumB += grid[x + 1][y - 1].b * 0.05;
  sumB += grid[x + 1][y + 1].b * 0.05;
  return sumB;
}

function swap() {
  var temp = grid;
  grid = next;
  next = temp;
}
