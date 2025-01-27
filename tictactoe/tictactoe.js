document.addEventListener('DOMContentLoaded', () => {
    // Hide loader after 2 seconds (you can adjust this time)
    setTimeout(() => {
        const loader = document.getElementById('loader-wrapper');
        const content = document.querySelector('.container');
        
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            loader.style.display = 'none';
            content.classList.remove('content-hidden');
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

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(cell, index));
});

restartButton.addEventListener('click', restartGame);

function handleCellClick(cell, index) {
    if (gameState[index] !== '' || !gameActive) return;

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    
    cell.style.color = currentPlayer === 'X' ? '#1a2980' : '#e74c3c';
    
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
    
    if (Math.floor(combination[0] / 3) === Math.floor(combination[1] / 3)) {
        lineDiv.classList.add('horizontal');
        const row = Math.floor(combination[0] / 3);
        lineDiv.style.top = `${row * 100 + 65}px`;
    } 
    else if (combination[0] % 3 === combination[1] % 3) {
        lineDiv.classList.add('vertical');
        const col = combination[0] % 3;
        lineDiv.style.left = `${col * 100 + 65}px`;
    } 
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