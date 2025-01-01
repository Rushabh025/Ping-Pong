const container = document.getElementById('game-container');
const rodTop = document.getElementById('rod-top');
const rodBottom = document.getElementById('rod-bottom');
const ball = document.getElementById('ball');

// Game state
let rodWidth = rodTop.offsetWidth;
let rodHeight = rodTop.offsetHeight;
let ballWidth = ball.offsetWidth;
let ballHeight = ball.offsetHeight;

let containerWidth = window.innerWidth;
let containerHeight = window.innerHeight;

let ballDirection = { x: 2, y: 2 }; // Ball movement speed and direction
let ballPosition = { x: containerWidth / 2, y: containerHeight / 2 }; // Ball position
let score = 0;
let highestScore = parseInt(localStorage.getItem('highestScore')) || 0;
let winner = localStorage.getItem('winner') || "No one";

// Alert high score at game start
alert(`Highest Score: ${highestScore} by ${winner}`);

// Positioning
function resetPositions() {
  rodTop.style.left = `${(containerWidth - rodWidth) / 2}px`;
  rodBottom.style.left = `${(containerWidth - rodWidth) / 2}px`;

  ballPosition = {
    x: containerWidth / 2 - ballWidth / 2,
    y: containerHeight / 2 - ballHeight / 2,
  };
  updateBallPosition();

  score = 0;
}

// Update ball position on the screen
function updateBallPosition() {
  ball.style.left = `${ballPosition.x}px`;
  ball.style.top = `${ballPosition.y}px`;
}

// Move rods
function moveRod(direction) {
  const step = 15;
  const leftTop = parseInt(rodTop.style.left || 0);

  if (direction === 'left' && leftTop > 0) {
    rodTop.style.left = `${leftTop - step}px`;
    rodBottom.style.left = `${leftTop - step}px`;
  } else if (direction === 'right' && leftTop + rodWidth < containerWidth) {
    rodTop.style.left = `${leftTop + step}px`;
    rodBottom.style.left = `${leftTop + step}px`;
  }
}

// Ball movement
function moveBall() {
    ballPosition.x += ballDirection.x;
    ballPosition.y += ballDirection.y;
  
    // Collision with side walls
    if (ballPosition.x <= 0 || ballPosition.x + ballWidth >= containerWidth) {
      ballDirection.x *= -1;
    }
  
    // Collision with top rod
    const rodTopLeft = parseInt(rodTop.style.left || 0);
    const rodTopRight = rodTopLeft + rodWidth;
    if (
      ballPosition.y <= rodHeight && // Ball touching the rod vertically
      ballPosition.x + ballWidth >= rodTopLeft && // Ball touching rod horizontally (left side)
      ballPosition.x <= rodTopRight // Ball touching rod horizontally (right side)
    ) {
      ballDirection.y *= -1; // Reverse Y-direction
      ballPosition.y = rodHeight; // Adjust ball to sit exactly at the edge of the rod
      score++;
    }
  
    // Collision with bottom rod
    const rodBottomLeft = parseInt(rodBottom.style.left || 0);
    const rodBottomRight = rodBottomLeft + rodWidth;
    if (
      ballPosition.y + ballHeight >= containerHeight - rodHeight && // Ball touching the rod vertically
      ballPosition.x + ballWidth >= rodBottomLeft && // Ball touching rod horizontally (left side)
      ballPosition.x <= rodBottomRight // Ball touching rod horizontally (right side)
    ) {
      ballDirection.y *= -1; // Reverse Y-direction
      ballPosition.y = containerHeight - rodHeight - ballHeight; // Adjust ball to sit exactly at the edge of the rod
      score++;
    }
  
    // Ball out of bounds (game over)
    if (ballPosition.y <= 0 || ballPosition.y + ballHeight >= containerHeight) {
      clearInterval(gameInterval);
  
      const losingRod = ballPosition.y <= 0 ? "Top Rod" : "Bottom Rod";
      alert(`Game Over! ${losingRod} loses with a score of ${score}`);
  
      if (score > highestScore) {
        highestScore = score;
        winner = losingRod === "Top Rod" ? "Bottom Rod" : "Top Rod";
  
        localStorage.setItem('highestScore', highestScore);
        localStorage.setItem('winner', winner);
  
        alert(`New High Score by ${winner}: ${highestScore}`);
      }
  
      resetPositions();
    }
  
    updateBallPosition();
}
  

// Controls
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    gameInterval = setInterval(moveBall, 10);
  } else if (event.key === 'a') {
    moveRod('left');
  } else if (event.key === 'd') {
    moveRod('right');
  }
});

// Adjust positions when window resizes
window.addEventListener('resize', () => {
  containerWidth = window.innerWidth;
  containerHeight = window.innerHeight;

  rodWidth = rodTop.offsetWidth;
  ballWidth = ball.offsetWidth;
  resetPositions();
});

// Initialize positions
resetPositions();

