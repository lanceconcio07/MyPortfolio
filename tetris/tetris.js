const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;

let board = [];
let currentPiece = null;
let score = 0;
let gameInterval;

const TETROMINOS = {
    'I': [
        [1, 1, 1, 1]
    ],
    'O': [
        [1, 1],
        [1, 1]
    ],
    'T': [
        [0, 1, 0],
        [1, 1, 1]
    ],
    'L': [
        [1, 0],
        [1, 0],
        [1, 1]
    ]
};

const COLORS = {
    'I': '#00f0f0',
    'O': '#f0f000',
    'T': '#a000f0',
    'L': '#f0a000'
};

function initBoard() {
    board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
}

function createPiece() {
    const types = Object.keys(TETROMINOS);
    const type = types[Math.floor(Math.random() * types.length)];
    const piece = TETROMINOS[type];
    
    return {
        shape: piece,
        x: Math.floor(BOARD_WIDTH / 2) - Math.floor(piece[0].length / 2),
        y: 0,
        color: COLORS[type]
    };
}

function draw() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    // Draw board
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                createBlock(x, y, '#808080'); // Static blocks are gray
            }
        });
    });
    
    // Draw current piece
    if (currentPiece) {
        currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    createBlock(currentPiece.x + x, currentPiece.y + y, currentPiece.color);
                }
            });
        });
    }
}

function createBlock(x, y, color) {
    const block = document.createElement('div');
    block.className = 'block';
    block.style.backgroundColor = color;
    block.style.left = x * BLOCK_SIZE + 'px';
    block.style.top = y * BLOCK_SIZE + 'px';
    document.getElementById('game-board').appendChild(block);
}

function moveDown() {
    currentPiece.y++;
    if (checkCollision()) {
        currentPiece.y--;
        mergePiece();
        clearLines();
        currentPiece = createPiece();
        if (checkCollision()) {
            gameOver();
        }
    }
    draw();
}

function checkCollision() {
    return currentPiece.shape.some((row, y) => {
        return row.some((value, x) => {
            if (!value) return false;
            const newX = currentPiece.x + x;
            const newY = currentPiece.y + y;
            return newX < 0 || newX >= BOARD_WIDTH || 
                   newY >= BOARD_HEIGHT ||
                   board[newY][newX];
        });
    });
}

function mergePiece() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[currentPiece.y + y][currentPiece.x + x] = value;
            }
        });
    });
}

function clearLines() {
    let linesCleared = 0;
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (board[y].every(cell => cell)) {
            board.splice(y, 1);
            board.unshift(Array(BOARD_WIDTH).fill(0));
            linesCleared++;
            y++;
        }
    }
    
    if (linesCleared > 0) {
        score += linesCleared * 100;
        document.getElementById('score').textContent = score;
    }
}

function gameOver() {
    clearInterval(gameInterval);
    alert('Game Over! Score: ' + score);
}

function startGame() {
    initBoard();
    score = 0;
    document.getElementById('score').textContent = score;
    currentPiece = createPiece();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(moveDown, 1000);
    draw();
}

function rotatePiece() {
    const rotated = [];
    const N = currentPiece.shape[0].length;
    const M = currentPiece.shape.length;

    // Create rotated matrix
    for (let i = 0; i < N; i++) {
        rotated[i] = [];
        for (let j = 0; j < M; j++) {
            rotated[i][j] = currentPiece.shape[M - 1 - j][i];
        }
    }

    // Save original shape in case of collision
    const originalShape = currentPiece.shape;
    currentPiece.shape = rotated;

    // Check if rotation causes collision
    if (checkCollision()) {
        currentPiece.shape = originalShape; // Revert if there's a collision
    }
}

// Add this new function for hard drop
function hardDrop() {
    while (!checkCollision()) {
        currentPiece.y++;
    }
    currentPiece.y--;
    mergePiece();
    clearLines();
    currentPiece = createPiece();
    if (checkCollision()) {
        gameOver();
    }
    draw();
}

// Update keyboard controls to include space bar
document.addEventListener('keydown', event => {
    if (!currentPiece) return;
    
    // Prevent default behavior for arrow keys and space
    if (event.key.startsWith('Arrow') || event.key === ' ') {
        event.preventDefault();
    }
    
    switch (event.key) {
        case 'ArrowLeft':
            currentPiece.x--;
            if (checkCollision()) currentPiece.x++;
            break;
        case 'ArrowRight':
            currentPiece.x++;
            if (checkCollision()) currentPiece.x--;
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
        case ' ':           // Add space bar control
            hardDrop();
            break;
    }
    draw();
}); 