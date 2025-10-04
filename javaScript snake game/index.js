const gameBoard = document.querySelector("#GameBoard");//connect to id GameBoard
const ctx = gameBoard.getContext("2d");//so this mean you can use this board in 2d (x,y)
const scoreText = document.querySelector("#score");//connect to id score
const resetBtn = document.querySelector("#restbutton");//connect to id restbutton
const stopBtn = document.querySelector("#stop");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "yellow";
const ffoodColor = "red";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let gameover =false;
let speed =100;
const minSpeed=30;
//when the game start that was nomal body
let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];
//give even to move the snake or when press the button to change the game like press and resume the game
window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
stopBtn.addEventListener("click",stopGame)
// game start 
gameStart();
//when the game start let the game working
function gameStart(){
    running= true;
    scoreText.textContent = score;
    createFood();
    createFFood();
    drawFood();
    nextTick();
};
function nextTick(){ 
    if(running && !gameover){ 
        setTimeout(()=>{ 
            clearBoard(); 
            drawFood(); 
            moveSnake(); 
            drawSnake();
            drawFFood(); 
            checkGameOver(); 
            nextTick(); 
        }, speed); 
    } else if (gameover){
        displayGameOver(); // always shows GAME OVER
    }
};

//create the game board
function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

//so I want to create a food to give snake a new buff snake size -1 score willnot change
function createFFood(){
    function randomFFood(min,max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    ffoodX = randomFFood(0, gameWidth - unitSize);
    ffoodY = randomFFood(0, gameWidth - unitSize);
}
function drawFFood(){
    ctx.fillStyle = ffoodColor;
    ctx.fillRect(ffoodX, ffoodY, unitSize, unitSize);
};
// creat food make a to generate to random place in side the gameboard
function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }// so here is the area food can be generate
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
};
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};

function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    snake.unshift(head);

    if (snake[0].x == ffoodX && snake[0].y == ffoodY) {
        if (snake.length > 1) {
            snake.pop();
            snake.pop(); // shrink snake
        } else {
            // no body left → game over
            running = false;
            gameover = true;
            displayGameOver(); // <-- show immediately
            return;           // <-- stop further processing
        }
        // 🍎 red food effect: speed up snake
    if (speed > minSpeed) {
        speed -= 10; // increase speed (make faster)
    }
        createFFood();
    } else if (snake[0].x == foodX && snake[0].y == foodY) {
        score += 1;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop();
    }

    // safety check if snake became empty after pop
    if (snake.length === 0 && !gameover) {
        running = false;
        gameover = true;
        displayGameOver(); // <-- show immediately
    }
};

function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};
//make the snake can move in left right up and down
function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);
//checking witch button I just press
    switch(true){
        case(keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
};

//checking the game is game over 
//when you snake touch the edge game will be over
function checkGameOver(){
    switch(true){
        case (snake[0].x < 0):
            running = false;
            displayGameOver();
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            displayGameOver();
            break;
        case (snake[0].y < 0):
            running = false;
            displayGameOver();
            break;
        case (snake[0].y >= gameHeight):
            running = false;
            displayGameOver();
            break;
    }
    //so the snake was eat it self the game will be over
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
            displayGameOver();            
        }
    }
};
//so the game over will be show up a text to tell you the game was over
function displayGameOver(){
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
};
//reset the game like the score reset snake reset
function resetGame(){
    score = 0;
    speed=100;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];
    gameStart();
};
function stopGame(){
    if(!gameover){ // only allow pause/resume if game not over
        if(running){
            // currently running → pause
            running = false;
        } else {
            // currently paused → resume
            running = true;
            nextTick(); // restart the loop
        }
    }
}
