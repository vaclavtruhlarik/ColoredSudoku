const GRID_SIZE = 4;
const SYMBOLS = ["anchor", "fish", "ship", "tree"];
// Each color's tiles start in its own tray on one side of the board.
const TRAY_COLORS = {
    "tray-top": "yellow",
    "tray-bottom": "red",
    "tray-left": "blue",
    "tray-right": "green",
};
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

const board = document.getElementById("board");
const statusText = document.getElementById("status");
const cells = [...board.querySelectorAll(".grid-item")];
const homeSlots = new Map(); // tile element -> the tray slot it starts in

// Every row and every column of the board, as lists of cells.
const lines = [];
for (let i = 0; i < GRID_SIZE; i++) {
    lines.push(cells.slice(i * GRID_SIZE, (i + 1) * GRID_SIZE));
    lines.push(cells.filter((_, index) => index % GRID_SIZE === i));
}

function createTile(color, symbol) {
    const tile = document.createElement("div");
    tile.className = `tile tile-${color}`;
    tile.dataset.color = color;
    tile.dataset.symbol = symbol;
    tile.addEventListener("pointerdown", startDrag);
    tile.addEventListener("pointermove", moveDrag);
    tile.addEventListener("pointerup", endDrag);
    tile.addEventListener("pointercancel", cancelDrag);

    const icon = document.createElement("img");
    icon.src = `icons/${symbol}.svg`;
    icon.alt = `${color} ${symbol}`;
    icon.draggable = false;
    tile.append(icon);
    return tile;
}

function createTrays() {
    for (const [trayId, color] of Object.entries(TRAY_COLORS)) {
        const tray = document.getElementById(trayId);
        for (const symbol of SYMBOLS) {
            const slot = document.createElement("div");
            slot.className = "slot";
            const tile = createTile(color, symbol);
            slot.append(tile);
            tray.append(slot);
            homeSlots.set(tile, slot);
        }
    }
}

// Returns the tiles that share a color or symbol with another tile in the same row or column.
function findConflicts() {
    const conflicts = new Set();
    for (const line of lines) {
        const tiles = line.map((cell) => cell.firstElementChild).filter(Boolean);
        for (const a of tiles) {
            for (const b of tiles) {
                const clash = a.dataset.color === b.dataset.color || a.dataset.symbol === b.dataset.symbol;
                if (a !== b && clash) {
                    conflicts.add(a);
                    conflicts.add(b);
                }
            }
        }
    }
    return conflicts;
}

function updateGameState() {
    const placed = cells.filter((cell) => cell.firstElementChild).length;
    const conflicts = findConflicts();
    const solved = placed === TILE_COUNT && conflicts.size === 0;

    for (const tile of homeSlots.keys()) {
        tile.classList.toggle("conflict", conflicts.has(tile));
    }
    board.classList.toggle("solved", solved);
    statusText.classList.toggle("status-solved", solved);

    if (solved) {
        statusText.textContent = "Solved! Every row and column is correct.";
    } else if (conflicts.size > 0) {
        statusText.textContent = `${placed} of ${TILE_COUNT} tiles placed. ${conflicts.size} tiles break the rules.`;
    } else {
        statusText.textContent = `${placed} of ${TILE_COUNT} tiles placed.`;
    }
}

function resetGame() {
    for (const [tile, slot] of homeSlots) {
        slot.append(tile);
    }
    updateGameState();
}

// Moves a tile to a board cell, or back to its tray when dropped off the board.
// A tile dropped on an occupied cell swaps with it if it came from the board;
// if it came from a tray, the tile it replaces goes back to its own tray.
function placeTile(tile, targetCell) {
    const origin = tile.parentElement;
    if (!targetCell) {
        homeSlots.get(tile).append(tile);
        return;
    }
    if (targetCell === origin) {
        return;
    }
    const occupant = targetCell.firstElementChild;
    if (occupant) {
        (cells.includes(origin) ? origin : homeSlots.get(occupant)).append(occupant);
    }
    targetCell.append(tile);
}

let drag = null; // { tile, pointerId, startX, startY, targetCell } while a tile is being dragged

function cellAt(x, y) {
    return document.elementsFromPoint(x, y).find((el) => el.classList.contains("grid-item")) ?? null;
}

function setDropTarget(cell) {
    drag.targetCell?.classList.remove("drop-target");
    cell?.classList.add("drop-target");
    drag.targetCell = cell;
}

function startDrag(event) {
    if (drag || event.button !== 0) {
        return;
    }
    const tile = event.currentTarget;
    tile.setPointerCapture(event.pointerId);
    tile.classList.add("dragging");
    drag = { tile, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, targetCell: null };
    setDropTarget(cellAt(event.clientX, event.clientY));
}

function moveDrag(event) {
    if (!drag || event.pointerId !== drag.pointerId) {
        return;
    }
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    drag.tile.style.transform = `translate(${dx}px, ${dy}px)`;
    setDropTarget(cellAt(event.clientX, event.clientY));
}

// Clears the drag visuals and state, and returns the tile and the cell it was over.
function finishDrag() {
    const { tile, targetCell } = drag;
    setDropTarget(null);
    tile.classList.remove("dragging");
    tile.style.transform = "";
    drag = null;
    return { tile, targetCell };
}

function endDrag(event) {
    if (!drag || event.pointerId !== drag.pointerId) {
        return;
    }
    const { tile, targetCell } = finishDrag();
    placeTile(tile, targetCell);
    updateGameState();
}

// The browser interrupted the drag (e.g. a system gesture), so leave the tile where it was.
function cancelDrag(event) {
    if (drag && event.pointerId === drag.pointerId) {
        finishDrag();
    }
}

document.getElementById("reset-button").addEventListener("click", resetGame);

createTrays();
updateGameState();
