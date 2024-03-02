const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth; // Set canvas width
canvas.height = window.innerHeight; // Set canvas height

function roundTo(x, scale = 1) {
    return Math.floor(x / scale) * scale;
}

var gridSize = 4; // Grid size
var cellSize = roundTo(ctx.canvas.height / (gridSize + 4), 10); // Size of each cell and square
var gridStartX = (ctx.canvas.width - cellSize * gridSize) / 2; // Starting X-coordinate for grid
var gridStartY = (ctx.canvas.height - cellSize * gridSize) / 2; // Starting Y-coordinate for grid
console.log(gridSize, cellSize, gridStartX, gridStartY);

class Plate {
    constructor(x, y, w, h, color, icon) {
        this.start_x = this.x = x;
        this.start_y = this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.icon = new Image();
        this.icon.src = icon;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        const margin = roundTo(this.w / 10, 10);
        ctx.drawImage(this.icon, this.x + margin, this.y + margin, this.w - 2 * margin, this.h - 2 * margin);
    }
}

class Grid {
    constructor(x, y, offset, rows, cols, color, cell_w, cell_h, icons) {
        this.x = x;
        this.y = y;
        this.offset = offset;
        this.rows = rows;
        this.cols = cols;
        this.color = color;
        this.cell_w = cell_w;
        this.cell_h = cell_h;
        this.grid = setGrid(x, y, offset, rows, cols, color, cell_w, cell_h, icons);
    }

    draw() {
        for (var r = 0; r < this.rows; r++) {
            for (var c = 0; c < this.cols; c++) {
                this.grid[r][c].draw();
            }
        }
    }
}

function setStartPlates(start_x, start_y, dx, dy, offset, num_plates, color, width, height, icons) {
    let plates = [];
    let x = start_x;
    let y = start_y;
    for (var i = 0; i < num_plates; i++) {
        const np = new Plate(x, y, width, height, color, icons[i]);
        plates.push(np);
        x += dx * (width + offset);
        y += dy * (height + offset);
    }
    return plates;
}

function setGrid(start_x, start_y, offset, rows, cols, color, cell_w, cell_h, icons) {
    let grid = [];
    let x = start_x;
    let y = start_y;
    for (var i = 0; i < rows; i++) {
        let g = setStartPlates(x, y, 1, 0, offset, cols, color, cell_w, cell_h, icons);
        grid.push(g);
        y += cell_h + offset;
    }
    return grid;
}

let grid = new Grid(gridStartX, gridStartY, 0, gridSize, gridSize, "gray", cellSize, cellSize, [
    "icons/anchor.svg",
    "icons/fish.svg",
    "icons/ship.svg",
    "icons/tree.svg",
]);
console.log(grid);

let offset = 20;
let yellows = setStartPlates(
    gridStartX - 1.5 * offset,
    gridStartY - cellSize - 1.5 * offset,
    1,
    0,
    offset,
    gridSize,
    "yellow",
    cellSize,
    cellSize,
    ["icons/anchor.svg", "icons/fish.svg", "icons/ship.svg", "icons/tree.svg"]
);
let reds = setStartPlates(
    gridStartX - 1.5 * offset,
    gridStartY + cellSize * gridSize + 1.5 * offset,
    1,
    0,
    offset,
    gridSize,
    "red",
    cellSize,
    cellSize,
    ["icons/anchor.svg", "icons/fish.svg", "icons/ship.svg", "icons/tree.svg"]
);
let blues = setStartPlates(
    gridStartX - cellSize - 1.5 * offset,
    gridStartY - 1.5 * offset,
    0,
    1,
    offset,
    gridSize,
    "blue",
    cellSize,
    cellSize,
    ["icons/anchor.svg", "icons/fish.svg", "icons/ship.svg", "icons/tree.svg"]
);
let greens = setStartPlates(
    gridStartX + cellSize * gridSize + 1.5 * offset,
    gridStartY - 1.5 * offset,
    0,
    1,
    offset,
    gridSize,
    "green",
    cellSize,
    cellSize,
    ["icons/anchor.svg", "icons/fish.svg", "icons/ship.svg", "icons/tree.svg"]
);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.draw();
    for (var i = 0; i < gridSize; i++) {
        yellows[i].draw();
        reds[i].draw();
        blues[i].draw();
        greens[i].draw();
    }
    requestAnimationFrame(animate);
}

animate();
