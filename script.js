const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth; // Set canvas width
canvas.height = window.innerHeight; // Set canvas height

function roundTo(x, scale = 1) {
    return Math.floor(x / scale) * scale;
}

var gridSize = 4; // Grid size
var cellSize = roundTo(ctx.canvas.height / gridSize + 4, 10); // Size of each cell and square
var gridStartX = (ctx.canvas.width - cellSize * gridSize) / 2; // Starting X-coordinate for grid
var gridStartY = (ctx.canvas.height - cellSize * gridSize) / 2; // Starting Y-coordinate for grid

class Plate {
    constructor(x, y, w, h, color, icon = null) {
        this.start_x = this.x = x;
        this.start_y = this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.icon = icon;
    }

    draw() {
        ctx.fillStyle = "black";
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function setStartPlates(start_x, start_y, dx, dy, offset, num_plates, color, width, height, icons = null) {
    let plates = [];
    x = start_x;
    y = start_y;
    for (var i = 0; i < num_plates; i++) {
        np = new Plate(x, y, width, height, color);
        plates.push(np);
        x += dx * (width + offset);
        y += dy * (height + offset);
    }
    return plates;
}

let plates = setStartPlates(10, 10, 1, 0, 20, 4, "red", 50, 50);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (i = 0; i < plates.length; i++) {
        // console.log(plates[i]);
        plates[i].draw();
    }
    requestAnimationFrame(animate);
}

animate();
