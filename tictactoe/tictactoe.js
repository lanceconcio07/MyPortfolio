let difficulty = 'easy'; // Default difficulty
let isComputerThinking = false;

document.addEventListener('DOMContentLoaded', () => {
    // Hide loader after 2 seconds
    setTimeout(() => {
        const loader = document.getElementById('loader-wrapper');
        const content = document.querySelector('.container');
        const board = document.getElementById('board');
        const gameModes = document.querySelector('.game-modes');
        const difficultyModes = document.querySelector('.difficulty-modes');
        const status = document.getElementById('status');
        const restartBtn = document.getElementById('restart');
        
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            loader.style.display = 'none';
            content.classList.remove('content-hidden');
            // Hide everything except game mode selection
            board.style.display = 'none';
            status.style.display = 'none';
            restartBtn.style.display = 'none';
            difficultyModes.style.display = 'none';
            gameModes.style.marginTop = '50px';
        }, 500);
    }, 2000);
});

const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const status = document.getElementById('status');
const restartButton = document.getElementById('restart');
let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let isComputerMode = false;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

const multiplayerBtn = document.getElementById('multiplayer-btn');
const computerBtn = document.getElementById('computer-btn');

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(cell, index));
});

restartButton.addEventListener('click', restartGame);

multiplayerBtn.addEventListener('click', () => {
    isComputerMode = false;
    multiplayerBtn.classList.add('active');
    computerBtn.classList.remove('active');
    document.querySelector('.difficulty-modes').style.display = 'none';
    document.getElementById('board').style.display = 'grid';
    document.getElementById('status').style.display = 'block';
    document.getElementById('restart').style.display = 'block';
    document.querySelector('.game-modes').style.marginTop = '20px';
    restartGame();
});

computerBtn.addEventListener('click', () => {
    isComputerMode = true;
    computerBtn.classList.add('active');
    multiplayerBtn.classList.remove('active');
    // Show difficulty selection instead of board
    document.querySelector('.difficulty-modes').style.display = 'block';
    document.getElementById('board').style.display = 'none';
    document.getElementById('status').style.display = 'none';
    document.getElementById('restart').style.display = 'none';
});

// Add difficulty button handlers
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        difficultyBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        difficulty = btn.id.replace('-btn', '');
        
        // Show the game board
        document.getElementById('board').style.display = 'grid';
        document.getElementById('status').style.display = 'block';
        document.getElementById('restart').style.display = 'block';
        restartGame();
    });
});

function handleCellClick(cell, index) {
    if (gameState[index] !== '' || !gameActive || isComputerThinking) return;

    makeMove(index);
    
    if (isComputerMode && gameActive) {
        isComputerThinking = true;
        setTimeout(() => {
            makeComputerMove();
            isComputerThinking = false;
        }, 500);
    }
}

function makeMove(index) {
    gameState[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].style.color = currentPlayer === 'X' ? '#1a2980' : '#e74c3c';
    
    if (checkWin()) {
        status.textContent = `${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        status.textContent = "Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `${currentPlayer}'s turn`;
}

function makeComputerMove() {
    if (!gameActive) return;
    
    let computerMove;
    
    switch(difficulty) {
        case 'easy':
            computerMove = getRandomMove();
            break;
        case 'medium':
            // 50% chance of making the best move
            computerMove = Math.random() < 0.5 ? getBestMove() : getRandomMove();
            break;
        case 'hard':
            computerMove = getBestMove();
            break;
        default:
            computerMove = getRandomMove();
    }
    
    makeMove(computerMove);
}

function getRandomMove() {
    const availableMoves = gameState.reduce((moves, cell, index) => {
        if (cell === '') moves.push(index);
        return moves;
    }, []);
    
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function getBestMove() {
    // This is a simple implementation. For a truly unbeatable AI,
    // you would want to implement the minimax algorithm
    const availableMoves = gameState.reduce((moves, cell, index) => {
        if (cell === '') moves.push(index);
        return moves;
    }, []);
    
    // First check if computer can win
    for (let move of availableMoves) {
        gameState[move] = 'O';
        if (checkWin()) {
            gameState[move] = '';
            return move;
        }
        gameState[move] = '';
    }
    
    // Then check if player can win and block
    for (let move of availableMoves) {
        gameState[move] = 'X';
        if (checkWin()) {
            gameState[move] = '';
            return move;
        }
        gameState[move] = '';
    }
    
    // Otherwise make a random move
    return getRandomMove();
}

function checkWin() {
    for (const combination of winningCombinations) {
        if (combination.every(index => gameState[index] === currentPlayer)) {
            drawWinningLine(combination);
            return true;
        }
    }
    return false;
}

function checkDraw() {
    return gameState.every(cell => cell !== '');
}

function drawWinningLine(combination) {
    const lineDiv = document.createElement('div');
    lineDiv.classList.add('winning-line');
    
    // Check if it's a row win
    if (Math.floor(combination[0] / 3) === Math.floor(combination[1] / 3)) {
        lineDiv.classList.add('horizontal');
        const row = Math.floor(combination[0] / 3);
        const cellHeight = cells[0].offsetHeight;
        const gap = 4; // Adjust this value based on your grid gap
        lineDiv.style.top = `${(row * cellHeight) + (cellHeight / 2) + (row * gap)}px`;
    } 
    // Check if it's a column win
    else if (combination[0] % 3 === combination[1] % 3) {
        lineDiv.classList.add('vertical');
        const col = combination[0] % 3;
        const cellWidth = cells[0].offsetWidth;
        const gap = 4; // Adjust this value based on your grid gap
        lineDiv.style.left = `${(col * cellWidth) + (cellWidth / 2) + (col * gap)}px`;
    } 
    // Diagonal wins
    else if (combination.toString() === [0,4,8].toString()) {
        lineDiv.classList.add('diagonal-1');
    } 
    else if (combination.toString() === [2,4,6].toString()) {
        lineDiv.classList.add('diagonal-2');
    }
    
    board.appendChild(lineDiv);
}

function restartGame() {
    // Show loader first
    const loader = document.getElementById('loader-wrapper');
    const content = document.querySelector('.container');
    
    // Show loader
    loader.style.display = 'flex';
    loader.style.opacity = '1';
    content.classList.add('content-hidden');
    
    // Wait for 1 second then reset the game
    setTimeout(() => {
        // Reset game state
        currentPlayer = 'X';
        gameActive = true;
        gameState = ['', '', '', '', '', '', '', '', ''];
        status.textContent = `${currentPlayer}'s turn`;
        cells.forEach(cell => {
            cell.textContent = '';
        });
        
        // Remove winning line if exists
        const existingLine = document.querySelector('.winning-line');
        if (existingLine) {
            existingLine.remove();
        }
        
        // Hide loader with fade effect
        loader.style.opacity = '0';
        
        setTimeout(() => {
            loader.style.display = 'none';
            content.classList.remove('content-hidden');
        }, 500);
        
    }, 1000);
} 