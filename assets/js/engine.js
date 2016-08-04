var canvas;
var canvasContext;

// Ball position and speed
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

// Player move
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

// Player Score
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

window.onload = function () {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000/framesPerSecond);

  canvas.addEventListener('click', handelMouseClick);

  canvas.addEventListener('mousemove', function (evt) {
    var mousePos = calculateMousePosition(evt);
    paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
  });

};

function handelMouseClick(evt) {
  if(showingWinScreen){
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

function calculateMousePosition(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollLeft;
  return {
    x: mouseX,
    y: mouseY
  };
}

function ballReset() {

  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

function computerMovement() {

  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);

  if (paddle2YCenter < ballY-35) {
    paddle2Y += 6;
  } else if(paddle2YCenter > ballY+35) {
    paddle2Y -= 6;
  }
}

function moveEverything() {

  if (showingWinScreen) {
    return;
  }

  computerMovement();

  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  if(ballX < 0){
    if (ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
      var deltaY = ballY -(paddle1Y+PADDLE_HEIGHT/2);
      ballSpeedX = -ballSpeedX;
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++;
      ballReset();
    }
  }
  if(ballX > canvas.width){
    if (ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) {
      var deltaY = ballY -(paddle2Y+PADDLE_HEIGHT/2);
      ballSpeedX = -ballSpeedX;
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++;
      ballReset();
    }
  }
  if(ballY < 0){
    ballSpeedY = -ballSpeedY;
  }
  if(ballY > canvas.height){
    ballSpeedY = -ballSpeedY;
  }

}

function drawNet() {
  for (var i = 0; i < canvas.height; i+=40) {
    colorRect(canvas.width/2-1, i, 2, 20, '#fff')
  }
}

function drawEverything() {


  // Background
  colorRect(0,0, canvas.width, canvas.height, '#000');

  if (showingWinScreen) {
    canvasContext.fillStyle = '#fff';

    if (player1Score >= WINNING_SCORE){
      showingWinScreen = true;
      canvasContext.fillText("Player 1 Won!", 350, 200);
    } else if (player2Score >= WINNING_SCORE) {
      showingWinScreen = true;
      canvasContext.fillText("Player 2 Won!", 350, 200);
    }

    canvasContext.fillText("Click To Continue", 330, 500);
    canvasContext.strokeStyle="#fff";
    canvasContext.lineWidth=3;
    canvasContext.strokeRect(318, 475, 180, 40);
    return;
  }

  // Net
  drawNet();
  // Player1
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, '#fff');
  // PC
  colorRect(canvas.width-PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, '#fff');
  // Ball
  colorCircle(ballX, ballY, 10, '#fff');

  // Score
  canvasContext.font = "20px arial";
  canvasContext.fillText("player 1", 70, 50);
  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width-100, 100);
  canvasContext.fillText("PC", canvas.width-115, 50);

}

function colorCircle(centerX, centerY, radius, drawColor) {

  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();

}

function colorRect(leftX, topY, width, height, drawColor) {

  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);

}
