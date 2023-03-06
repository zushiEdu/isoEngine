const canvas = document.getElementById("canvas");
const slider = document.getElementById("zoom");
const painter = canvas.getContext("2d", { alpha: false });

document.addEventListener(
  "keydown",
  (event) => {
    var name = event.key;
    input(name);
  },
  false
);

slider.oninput = function () {
  zoom = this.value;
}

const tileWidth = 64;
const tileHeight = 32;
const tileAmount = 19;
const gridSize = 10;

let tileImages = [];

var zoom = slider.value;
const fps = 30;
let xZero;
let yZero;

// each step in elevation is 8px steps

let grid = [
  [0, 5, 0, 0, 0, 0, 5, 0, 0, 0],
  [8, 15, 8, 8, 8, 8, 4, 0, 0, 0],
  [0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
  [8, 15, 0, 0, 0, 0, 0, 0, 0, 12],
  [0, 0, 0, 0, 0, 0, 0, 0, 12, 15],
  [0, 0, 0, 0, 0, 0, 0, 12, 15, 4],
  [0, 0, 0, 0, 0, 0, 12, 15, 4, 0],
  [0, 0, 0, 0, 0, 12, 15, 4, 0, 0],
  [0, 0, 0, 0, 12, 15, 4, 0, 0, 0],
  [0, 0, 0, 12, 15, 4, 0, 0, 0, 0],
];

let depthMap = [
  [4, 3, 3, 3, 3, 3, 2, 2, 2, 2],
  [3, 3, 2, 2, 2, 2, 2, 2, 2, 2],
  [3, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [2, 2, 2, 2, 2, 2, 2, 2, 1, 1],
  [2, 2, 2, 2, 2, 2, 2, 1, 1, 0],
  [2, 2, 2, 2, 2, 2, 1, 1, 0, 0],
  [2, 2, 2, 2, 2, 1, 1, 0, 0, 0],
  [2, 2, 2, 2, 1, 1, 0, 0, 0, 0],
  [2, 2, 2, 1, 1, 0, 0, 0, 0, 0],]

setup();
setInterval(update, 1000 / fps);

function setup() {
  setResolution(1280, 720);

  xZero = canvas.width / 2;
  yZero = 0;

  for (var i = 1; i < tileAmount; i++) {
    tileImages.push(loadImage(`./tiles/grass-${i}.png`));
  }

  painter.imageSmoothingEnabled = false;
}

function update() {
  background(0, 0, 0);
  drawGrid(grid);
}

function input(key) {
  switch (key) {
    case "w":
      yZero -= 5;
      break;
    case "s":
      yZero += 5;
      break;
    case "a":
      xZero -= 5;
      break;
    case "d":
      xZero += 5;
      break;
  }
}

function averageArray(array) {
  var sum;
  for (var i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum / array.length;
}


/*
The draw grid function takes in a two dimensional array and draws it from back left to front right 
automatically putting the tiles in the correct order, thus painting things in correct order shouldnt 
be an issue
*/

function drawGrid(grid) {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      drawTile(grid[y][x], x, y);
    }
  }
}

function drawTile(tile, x, y) {
  let xScreen = xZero + ((x - y) * tileWidth) / 2;
  let yScreen = yZero + ((x + y) * tileHeight) / 2 - (8 * depthMap[y][x]);
  drawImage(tileImages[tile], xScreen, yScreen);
}

function drawImage(image, x, y) {
  painter.scale(zoom, zoom);
  painter.drawImage(image, x - tileWidth / 2, y);
  painter.scale(1 / zoom, 1 / zoom);
}

function setResolution(desiredWidth, desiredHeight) {
  canvas.width = desiredWidth;
  canvas.height = desiredHeight;
}

function loadImage(source) {
  var newImage = new Image();
  newImage.src = source;
  return newImage;
}

function background(r, g, b) {
  painter.fillStyle = `rgb(${r},${g},${b})`;
  painter.fillRect(0, 0, canvas.width, canvas.height);
}
