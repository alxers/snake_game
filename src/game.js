;(function() {
  var body = document.body;
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;

  var blockSize = 10;
  var widthInBlocks = canvasWidth / blockSize;
  var heightInBlocks = canvasHeight / blockSize;

  var score = 0;

  var animationTime = 130;
  var animationStep = 2;

  var SNAKE_COLOR = 'Blue';
  var APPLE_COLOR = 'Green';

  var drawBorder = function() {
    ctx.fillStyle = 'Gray';
    ctx.fillRect(0, 0, canvasWidth, blockSize);
    ctx.fillRect(0, canvasHeight - blockSize, canvasWidth, blockSize);
    ctx.fillRect(0, 0, blockSize, canvasHeight);
    ctx.fillRect(canvasWidth - blockSize, 0, blockSize, canvasHeight);
  };

  var drawScore = function() {
    ctx.font = '20px Courier';
    ctx.fillStyle = 'Black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Score: ' + score, blockSize, blockSize);
  };

  // TODO: fix game over state (currently it allows to continue the game)
  var gameOver = function() {
    ctx.font = '60px Courier';
    ctx.fillStyle = 'Black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', canvasWidth / 2, canvasHeight / 2);
    clearTimeout(timeoutId);
  };

  // Helper function
  var circle = function(x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);

    if (fillCircle) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  }

  // Block constructor
  var Block = function(col, row) {
    this.col = col;
    this.row = row;
  };

  Block.prototype.drawSquare = function(color) {
    var x = this.col * blockSize;
    var y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
  };

  Block.prototype.drawCircle = function(color) {
    var centerX = this.col * blockSize + blockSize / 2;
    var centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
  };

  Block.prototype.equal = function(otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
  };

  // Snake constructor
  var Snake = function() {
    this.segments = [
      new Block(7, 5),
      new Block(6, 5),
      new Block(5, 5)
    ];

    this.direction = 'right';
    this.nextDirection = 'right';
  };

  Snake.prototype.draw = function() {
    for (var i = 0; i < this.segments.length; i++) {
      this.segments[i].drawSquare(SNAKE_COLOR);
    }
  };

  Snake.prototype.move = function() {
    var head = this.segments[0];
    var newHead;

    this.direction = this.nextDirection;

    if (this.direction === 'right') {
      newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === 'down') {
      newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === 'left') {
      newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === 'up') {
      newHead = new Block(head.col, head.row - 1);
    }

    if (this.checkCollision(newHead)) {
      gameOver();
      return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
      score++;
      animationTime -= animationStep;
      apple.move();
    } else {
      this.segments.pop();
    }
  };

  Snake.prototype.checkCollision = function(head) {
    var leftCollision = (head.col === 0);
    var topCollision = (head.row === 0);
    var rightCollision = (head.col === widthInBlocks - 1);
    var bottomCollision = (head.row === heightInBlocks - 1);

    var wallCollision = leftCollision || topCollision ||
                        rightCollision || bottomCollision;

    var selfCollision = false;

    for (var i = 0; i < this.segments.length; i++) {
      if (head.equal(this.segments[i])) {
        selfCollision = true;
      }
    }

    return wallCollision || selfCollision;
  };

  Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === 'up' && newDirection === 'down') {
      return;
    } else if (this.direction === 'right' && newDirection === 'left') {
      return;
    } else if (this.direction === 'down' && newDirection === 'up') {
      return;
    } else if (this.direction === 'left' && newDirection === 'right') {
      return;
    }

    this.nextDirection = newDirection;
  };

  // Apple constructor
  var Apple = function() {
    this.position = new Block (10, 10);
  };

  Apple.prototype.draw = function() {
    this.position.drawCircle(APPLE_COLOR);
  }

  Apple.prototype.move = function() {
    var randCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    var randRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randCol, randRow);
  }

  // Keys handler
  var directions = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  body.addEventListener('keydown', function(event) {
    var newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
      snake.setDirection(newDirection);
    }
  });

  // Create snake and apple
  var snake = new Snake();
  var apple = new Apple();

  // Run main game loop
  var timeoutId;
  var gameLoop = function() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();

    timeoutId = setTimeout(gameLoop, animationTime);
  };

  gameLoop();


  // var intervalId = setInterval(function() {
  //   ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  //   drawScore();
  //   snake.move();
  //   snake.draw();
  //   apple.draw();
  //   drawBorder();
  // }, 100);
})()
