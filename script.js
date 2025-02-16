// Background Particles
const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let particle of particles) {
        particle.update();
        particle.draw();
    }
    requestAnimationFrame(animateParticles);
}

// Game Logic
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let vsComputer = true;

function createBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.innerHTML = cell ? `<span class="${cell === 'X' ? 'x-mark' : 'o-mark'}">${cell}</span>` : '';
        cellElement.addEventListener('click', handleCellClick);
        board.appendChild(cellElement);
    });
}

function handleCellClick(e) {
    if (!gameActive) return;
    
    const index = e.target.dataset.index;
    if (gameBoard[index] === '') {
        gameBoard[index] = currentPlayer;
        e.target.innerHTML = `<span class="${currentPlayer === 'X' ? 'x-mark' : 'o-mark'}">${currentPlayer}</span>`;
        
        if (checkWin()) {
            gameActive = false;
            document.getElementById('status').innerHTML = `Player ${currentPlayer} Wins!`;
            highlightWinningCombination();
            return;
        }
        
        if (checkDraw()) {
            gameActive = false;
            document.getElementById('status').innerHTML = "Draw!";
            return;
        }
        
        currentPlayer = 'O';
        document.getElementById('status').innerHTML = vsComputer ? "Computer's Turn" : "Player O's Turn";
        
        if (vsComputer && gameActive) {
            setTimeout(computerMove, 1000);
        }
    }
}

function computerMove() {
    const emptyCells = gameBoard
        .map((cell, index) => cell === '' ? index : null)
        .filter(cell => cell !== null);
    
    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        gameBoard[randomIndex] = 'O';
        currentPlayer = 'X';
        createBoard();
        document.getElementById('status').innerHTML = "Player X's Turn";
        
        if (checkWin()) {
            gameActive = false;
            document.getElementById('status').innerHTML = "Computer Wins!";
            highlightWinningCombination();
        } else if (checkDraw()) {
            gameActive = false;
            document.getElementById('status').innerHTML = "Draw!";
        }
    }
}

function checkWin() {
    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winCombinations.some(combination => {
        const [a, b, c] = combination;
        return gameBoard[a] && 
               gameBoard[a] === gameBoard[b] && 
               gameBoard[a] === gameBoard[c];
    });
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function highlightWinningCombination() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.add('winning-cell'));
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    document.getElementById('status').innerHTML = "Player X's Turn";
    createBoard();
}

function toggleMode() {
    vsComputer = !vsComputer;
    document.getElementById('modeBtn').textContent = vsComputer ? "vs Computer" : "vs Friend";
    resetGame();
}

// Initialize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

initParticles();
animateParticles();
createBoard();