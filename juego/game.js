// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game states
const GAME_STATE = {
    MENU: 'menu',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver'
};

// Player object
const player = {
    x: 0,
    y: 0,
    width: 28,
    height: 45,
    lane: 1, // 0 = left, 1 = center, 2 = right
    velocityY: 0,
    isJumping: false,
    isSliding: false,
    slidingTimer: 0,
    maxSlideTime: 15,
    color: '#ff6b35',
    draw() {
        // Draw personaje realista
        if (this.isSliding) {
            // Cabeza
            ctx.fillStyle = '#f4a460';
            ctx.beginPath();
            ctx.arc(this.x + 14, this.y + 10, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Cuerpo en posición de deslizamiento
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y + 15, this.width, 15);
            
            // Piernas
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(this.x + 2, this.y + 30, 10, 10);
            ctx.fillRect(this.x + 16, this.y + 30, 10, 10);
        } else {
            // Cabeza
            ctx.fillStyle = '#f4a460';
            ctx.beginPath();
            ctx.arc(this.x + 14, this.y + 8, 7, 0, Math.PI * 2);
            ctx.fill();
            
            // Ojos
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(this.x + 11, this.y + 6, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + 17, this.y + 6, 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Cuerpo
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x + 3, this.y + 17, this.width - 6, 18);
            
            // Brazos
            ctx.fillStyle = '#f4a460';
            ctx.fillRect(this.x - 2, this.y + 18, 5, 8);
            ctx.fillRect(this.x + this.width - 3, this.y + 18, 5, 8);
            
            // Piernas
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(this.x + 5, this.y + 35, 6, 10);
            ctx.fillRect(this.x + this.width - 11, this.y + 35, 6, 10);
            
            // Zapatos
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(this.x + 5, this.y + 44, 6, 3);
            ctx.fillRect(this.x + this.width - 11, this.y + 44, 6, 3);
        }
    },
    update() {
        const laneWidth = canvas.width / 3;
        this.x = this.lane * laneWidth + laneWidth / 2 - this.width / 2;
        
        // Jump physics
        if (this.isJumping) {
            this.velocityY += 0.5; // gravity
            this.y += this.velocityY;
            
            if (this.y >= canvas.height - 80) {
                this.y = canvas.height - 80;
                this.isJumping = false;
                this.velocityY = 0;
            }
        }
        
        // Sliding
        if (this.isSliding) {
            this.slidingTimer++;
            if (this.slidingTimer >= this.maxSlideTime) {
                this.isSliding = false;
                this.slidingTimer = 0;
            }
        }
    },
    jump() {
        if (!this.isJumping && !this.isSliding) {
            this.isJumping = true;
            this.velocityY = -12;
            playSound('jump');
        }
    },
    slide() {
        if (!this.isJumping && !this.isSliding) {
            this.isSliding = true;
            this.slidingTimer = 0;
            playSound('slide');
        }
    },
    moveLane(direction) {
        const newLane = this.lane + direction;
        if (newLane >= 0 && newLane <= 2) {
            this.lane = newLane;
        }
    }
};

// Game variables
let gameState = GAME_STATE.MENU;
let score = 0;
let coins = 0;
let level = 1;
let gameSpeed = 3;
let maxGameSpeed = 8;
let obstacles = [];
let coins_collected = [];
let powerUps = [];
let lastObstacleY = 0;
let lastCoinY = 0;
let distanceTraveled = 0;
let gameStartTime = 0;

// Input handling
const keys = {};
let touchStartX = 0;
let touchStartY = 0;

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    if (e.key === 'ArrowLeft') {
        player.moveLane(-1);
    } else if (e.key === 'ArrowRight') {
        player.moveLane(1);
    } else if (e.key === 'ArrowUp') {
        player.jump();
    } else if (e.key === ' ') {
        if (gameState === GAME_STATE.MENU) {
            startGame();
        }
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (e.key === 'ArrowDown') {
        if (gameState === GAME_STATE.PLAYING) {
            player.slide();
        }
    }
});

// Touch controls
canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
    if (gameState !== GAME_STATE.PLAYING) return;
    
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 30) {
            player.moveLane(1);
            touchStartX = touchEndX;
        } else if (diffX < -30) {
            player.moveLane(-1);
            touchStartX = touchEndX;
        }
    } else {
        // Vertical swipe
        if (diffY < -30) {
            player.jump();
            touchStartY = touchEndY;
        } else if (diffY > 30) {
            player.slide();
            touchStartY = touchEndY;
        }
    }
    
    e.preventDefault();
});

// Obstacle class
class Obstacle {
    constructor(lane) {
        this.lane = lane;
        this.laneWidth = canvas.width / 3;
        this.x = lane * this.laneWidth + this.laneWidth / 2 - 20;
        this.y = -40;
        this.width = 40;
        this.height = 40;
        this.type = Math.random() > 0.5 ? 'train' : 'bar';
        this.color = this.type === 'train' ? '#8b4513' : '#c0392b';
    }
    
    draw() {
        if (this.type === 'train') {
            // Vagón de tren realista
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(this.x - 5, this.y, this.width + 10, this.height - 5);
            
            // Ventana
            ctx.fillStyle = '#87ceeb';
            ctx.fillRect(this.x + 5, this.y + 5, 20, 15);
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x + 5, this.y + 5, 20, 15);
            
            // Ruedas
            ctx.fillStyle = '#1a1a1a';
            ctx.beginPath();
            ctx.arc(this.x + 5, this.y + this.height - 2, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + this.width + 5, this.y + this.height - 2, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Detalles
            ctx.strokeStyle = '#34495e';
            ctx.lineWidth = 1;
            ctx.strokeRect(this.x - 5, this.y, this.width + 10, this.height - 5);
        } else {
            // Barra de metal realista
            ctx.fillStyle = '#c0392b';
            ctx.fillRect(this.x, this.y, this.width, this.height - 5);
            
            // Sombra
            ctx.fillStyle = '#a93226';
            ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 9);
            
            // Brillos metálicos
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(this.x + 2, this.y + 2, 3, this.height - 9);
            
            // Base
            ctx.fillStyle = '#7f8c8d';
            ctx.fillRect(this.x - 3, this.y + this.height - 5, this.width + 6, 5);
        }
    }
    
    update() {
        this.y += gameSpeed;
    }
    
    isOffScreen() {
        return this.y > canvas.height;
    }
}

// Coin class
class Coin {
    constructor(lane) {
        this.lane = lane;
        this.laneWidth = canvas.width / 3;
        this.x = lane * this.laneWidth + this.laneWidth / 2 - 10;
        this.y = -30;
        this.width = 20;
        this.height = 20;
        this.rotation = 0;
        this.color = '#ffd700';
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        
        // Moneda realista
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Borde
        ctx.strokeStyle = '#daa520';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Brillo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(-2, -2, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Símbolo $
        ctx.fillStyle = '#cc8800';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 0, 0);
        
        ctx.restore();
    }
    
    update() {
        this.y += gameSpeed;
        this.rotation += 0.1;
    }
    
    isOffScreen() {
        return this.y > canvas.height;
    }
}

// PowerUp class
class PowerUp {
    constructor(lane, type) {
        this.lane = lane;
        this.laneWidth = canvas.width / 3;
        this.x = lane * this.laneWidth + this.laneWidth / 2 - 15;
        this.y = -35;
        this.width = 30;
        this.height = 30;
        this.type = type; // 'shield' or 'speed'
        this.rotation = 0;
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        
        if (this.type === 'shield') {
            // Escudo realista
            ctx.fillStyle = '#27ae60';
            ctx.beginPath();
            ctx.moveTo(0, -12);
            ctx.lineTo(10, -5);
            ctx.lineTo(10, 10);
            ctx.bezierCurveTo(10, 15, 0, 15, 0, 15);
            ctx.bezierCurveTo(0, 15, -10, 15, -10, 10);
            ctx.lineTo(-10, -5);
            ctx.closePath();
            ctx.fill();
            
            // Borde del escudo
            ctx.strokeStyle = '#1a5c3a';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Brillo
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(-7, -8, 5, 8);
        } else {
            // Rayo de velocidad realista
            ctx.fillStyle = '#f39c12';
            ctx.beginPath();
            ctx.moveTo(0, -14);
            ctx.lineTo(5, -2);
            ctx.lineTo(0, 0);
            ctx.lineTo(8, 12);
            ctx.lineTo(0, 8);
            ctx.lineTo(-6, 16);
            ctx.lineTo(-3, 2);
            ctx.lineTo(-8, 0);
            ctx.closePath();
            ctx.fill();
            
            // Brillo en el rayo
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(-2, -8, 4, 6);
        }
        
        ctx.restore();
    }
    
    update() {
        this.y += gameSpeed;
        this.rotation += 0.08;
    }
    
    isOffScreen() {
        return this.y > canvas.height;
    }
}

// Collision detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Spawn obstacles
function spawnObstacle() {
    const randomLane = Math.floor(Math.random() * 3);
    const obstacle = new Obstacle(randomLane);
    obstacles.push(obstacle);
    lastObstacleY = obstacle.y;
}

// Spawn coins
function spawnCoin() {
    const randomLane = Math.floor(Math.random() * 3);
    const coin = new Coin(randomLane);
    coins_collected.push(coin);
    lastCoinY = coin.y;
}

// Spawn power-ups
function spawnPowerUp() {
    const randomLane = Math.floor(Math.random() * 3);
    const type = Math.random() > 0.5 ? 'shield' : 'speed';
    const powerUp = new PowerUp(randomLane, type);
    powerUps.push(powerUp);
}

// Sound effects (visual feedback instead of audio)
function playSound(soundType) {
    // Visual feedback
    canvas.style.filter = 'brightness(1.2)';
    setTimeout(() => {
        canvas.style.filter = 'brightness(1)';
    }, 50);
}

// Game over
function endGame() {
    gameState = GAME_STATE.GAME_OVER;
    document.getElementById('gameOver').classList.remove('hidden');
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalCoins').textContent = coins;
    document.getElementById('finalLevel').textContent = level;
}

// Start game
function startGame() {
    gameState = GAME_STATE.PLAYING;
    document.getElementById('startMenu').classList.add('hidden');
    document.getElementById('gameOver').classList.add('hidden');
    
    score = 0;
    coins = 0;
    level = 1;
    gameSpeed = 3;
    distanceTraveled = 0;
    obstacles = [];
    coins_collected = [];
    powerUps = [];
    
    player.lane = 1;
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - 80;
    player.isJumping = false;
    player.isSliding = false;
    player.velocityY = 0;
    
    gameStartTime = Date.now();
}

// Update game
function update() {
    if (gameState !== GAME_STATE.PLAYING) return;
    
    player.update();
    
    // Increase difficulty
    distanceTraveled += gameSpeed;
    level = Math.floor(distanceTraveled / 5000) + 1;
    gameSpeed = Math.min(3 + (level - 1) * 0.3, maxGameSpeed);
    
    // Spawn obstacles
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].y > 150) {
        spawnObstacle();
    }
    
    // Spawn coins
    if (coins_collected.length === 0 || coins_collected[coins_collected.length - 1].y > 100) {
        if (Math.random() > 0.6) {
            spawnCoin();
        }
    }
    
    // Spawn power-ups randomly
    if (Math.random() > 0.98) {
        spawnPowerUp();
    }
    
    // Update obstacles
    obstacles = obstacles.filter(obs => {
        obs.update();
        
        // Collision with obstacles
        if (checkCollision(player, obs)) {
            if (!player.isSliding && !player.isJumping) {
                playSound('hit');
                endGame();
            } else if (player.isSliding) {
                // Can pass under obstacles while sliding
                return true;
            }
        }
        
        if (obs.isOffScreen()) {
            score += 10;
            return false;
        }
        return true;
    });
    
    // Update coins
    coins_collected = coins_collected.filter(coin => {
        coin.update();
        
        if (checkCollision(player, coin)) {
            coins += 1;
            score += 50;
            playSound('coin');
            return false;
        }
        
        if (coin.isOffScreen()) {
            return false;
        }
        return true;
    });
    
    // Update power-ups
    powerUps = powerUps.filter(powerUp => {
        powerUp.update();
        
        if (checkCollision(player, powerUp)) {
            activatePowerUp(powerUp.type);
            return false;
        }
        
        if (powerUp.isOffScreen()) {
            return false;
        }
        return true;
    });
    
    // Update UI
    document.getElementById('score').textContent = score;
    document.getElementById('coins').textContent = coins;
    document.getElementById('level').textContent = level;
}

// Activate power-ups
function activatePowerUp(type) {
    if (type === 'shield') {
        score += 100;
        showPowerUpNotification('🛡️ ¡ESCUDO ACTIVADO!');
        const originalColor = player.color;
        player.color = '#27ae60';
        setTimeout(() => {
            player.color = originalColor;
        }, 5000);
    } else if (type === 'speed') {
        score += 100;
        showPowerUpNotification('⚡ ¡VELOCIDAD MÁXIMA!');
        const originalColor = player.color;
        player.color = '#f39c12';
        gameSpeed += 2;
        setTimeout(() => {
            player.color = originalColor;
            gameSpeed = Math.min(3 + (level - 1) * 0.3, maxGameSpeed);
        }, 5000);
    }
}

// Show power-up notification
function showPowerUpNotification(text) {
    const indicator = document.getElementById('powerUpIndicator');
    document.getElementById('powerUpText').textContent = text;
    indicator.classList.remove('hidden');
    setTimeout(() => {
        indicator.classList.add('hidden');
    }, 2000);
}

// Draw game
function draw() {
    // Draw sky background
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw distant buildings (parallax effect)
    ctx.fillStyle = 'rgba(150, 150, 150, 0.3)';
    for (let i = 0; i < 4; i++) {
        ctx.fillRect(i * 150, 50, 140, 100);
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(i * 150, 50, 140, 100);
    }
    
    // Draw metro track/platform
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, canvas.height - 120, canvas.width, 50);
    
    // Draw track details
    ctx.fillStyle = '#654321';
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.fillRect(i, canvas.height - 118, 30, 8);
    }
    
    // Draw rails
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 3;
    ctx.setLineDash([30, 20]);
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 95);
    ctx.lineTo(canvas.width, canvas.height - 95);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 75);
    ctx.lineTo(canvas.width, canvas.height - 75);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // Draw lane dividers (concrete)
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.setLineDash([15, 20]);
    
    for (let i = 1; i < 3; i++) {
        const x = (canvas.width / 3) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height - 120);
        ctx.stroke();
    }
    
    ctx.setLineDash([]);
    
    // Draw safety line at bottom
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, canvas.height - 125, canvas.width, 3);
    
    // Draw side walls
    ctx.fillStyle = '#696969';
    ctx.fillRect(0, canvas.height - 70, 5, 70);
    ctx.fillRect(canvas.width - 5, canvas.height - 70, 5, 70);
    
    // Draw obstacles
    obstacles.forEach(obs => obs.draw());
    
    // Draw coins
    coins_collected.forEach(coin => coin.draw());
    
    // Draw power-ups
    powerUps.forEach(pu => pu.draw());
    
    // Draw player
    player.draw();
    
    // Draw speed indicator
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Velocidad: ${gameSpeed.toFixed(1)}x`, 10, 30);
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Event listeners for buttons
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);

// Start the game loop
gameLoop();

// Initialize
console.log('🎮 Subway Surfers iniciado!');
