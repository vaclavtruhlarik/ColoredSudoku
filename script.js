const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = window.innerWidth; // Set canvas width
ctx.canvas.height = window.innerHeight; // Set canvas height

var gridSize = 4; // Grid size
var cellSize = ctx.canvas.width / 10; // Size of each cell and square
var gridStartX = (ctx.canvas.width - cellSize * gridSize) / 2; // Starting X-coordinate for grid
var gridStartY = (ctx.canvas.height - cellSize * gridSize) / 2; // Starting Y-coordinate for grid

// Draw 4x4 grid in the middle of canvas
ctx.beginPath();
for (var i = 0; i <= gridSize; i++) {
    ctx.moveTo(gridStartX + i * cellSize, gridStartY);
    ctx.lineTo(gridStartX + i * cellSize, gridStartY + gridSize * cellSize);
    ctx.moveTo(gridStartX, gridStartY + i * cellSize);
    ctx.lineTo(gridStartX + gridSize * cellSize, gridStartY + i * cellSize);
}
ctx.stroke();

// Draw 16 squares around the perimeter of the grid
for (var i = 0; i < gridSize; i++) {
    // Top row
    ctx.strokeRect(gridStartX - cellSize, gridStartY + i * cellSize, cellSize, cellSize);
    // Bottom row
    ctx.strokeRect(gridStartX + gridSize * cellSize, gridStartY + i * cellSize, cellSize, cellSize);
    // Left column
    ctx.strokeRect(gridStartX + i * cellSize, gridStartY - cellSize, cellSize, cellSize);
    // Right column
    ctx.strokeRect(gridStartX + i * cellSize, gridStartY + gridSize * cellSize, cellSize, cellSize);
}
