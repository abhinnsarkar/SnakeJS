// MODIFICATION LOG
 
// Sept-30 : Abhinn : Adding a feature to capture Keyboard Input to decide Initial Direction

// November-17 : Abhinn : We added functionality, such that the snake moves only when a directional arrow is pressed
//                        Further, Space bar will stop the snake 
//                        Further, Snake cannot go in the opposite direction

//November 18 : We made it so that the snake will stop when it hits a wall

//November 21 : we added a grid functionality so that we are not using any pixel(x and y) values and drew a target

//November 23 : I made the target disappear when it collides with the snake head

//November 30 : Made snake smooth and change direction

//December 5 : Made snake bend at multiple points without breaking

//December 7 : Troubleshooting why the Snake breaks off in some situations

//December 8 : Made snake stop when it eats itself

//December 15 : Made a margin for target to appear in , made scorebox , made status box

//December 16 : Added sounds --- chomp sound when target is hit 
             // metronome for snake sound as moves 
             // explosion for when snake is dead

            //: Added Textbox for snake size
            //: Added Textbox for game info

//IDEAS//
//--> ...Make snake come out opposite side when wall is hit
//--> ...Different shape for target
 
// REMOVE THIS TESTER PRINT AFTER DEVELOPMENT IS COMPLETED
// const SHOW_ON = true;
const SHOW_ON = true;
function show(msg) {
 
    if (SHOW_ON) {
        console.log(msg);
 
    }
}
 
function show_always(msg) {
    console.log(msg);
}

//global constants / variables

const directions = {  // this is an example of enumeration
 
    RIGHT: "right",
    LEFT:"left",
    UP:"up",
    DOWN:"down"

}
 
const SNAKE_COLORS = {
 
    HEAD: 10,
    BODY:100,
    TARGET:200,
    TAIL:50

}
 
const FRAME_SPEED = {  // this is an example of enumeration
 
    VERY_SLOW: 1,
    SLOW:3,
    MEDIUM:5,
    FAST:7,
    VERY_FAST:10

}

const INITIAL_SNAKE_DIRECTION = directions.RIGHT ;

const CANVAS_SIZE = 600 ;

const FRAME_RATE = FRAME_SPEED.FAST ; // higher is faster

const NUM_OF_SECTIONS = 21 ;

const BODY_SIZE = 3 ; // controls the initial size of the snake
const SNAKE_SIZE = BODY_SIZE + 1;

var g_targetCollisionCount  = 0 ;

const MARGIN = 10 ; //enter the margin in percentage

 snakeStatus = "fine" ; // if everything is good, then status == fine else game over

const CENTER_GRID = (NUM_OF_SECTIONS + 1)/2; // finds center of grid to show snake starts
const g_initialX = CANVAS_SIZE/2;
const g_initialY = CANVAS_SIZE/2;

const g_blockSize = CANVAS_SIZE/NUM_OF_SECTIONS; // makes a block size based on the canvas size and number of sections --- proportional --- will change as canvas size and number of sections changes
const g_blockColor = 10;
const g_headColor = 100;

const ARROW_DOWN = "ArrowDown";
const ARROW_UP = "ArrowUp";
const ARROW_RIGHT = "ArrowRight";
const ARROW_LEFT = "ArrowLeft";
const SPACE_KEY = " ";

var errorMessage = " ";

const BLACK_BLOCK = "Black Block = head block";
const WHITE_BLOCK = "White Block =  target";
const LIGHT_GREY_BLOCK = "Light Grey Block =  body blocks";
const DARK_GREY_BLOCK = "Dark Grey Block = tail block";


//returns a position object with pixel values, given the row and col of the grid
function gridToPixel(rowGrid,colGrid){

    var col = colGrid - 1;
    var row = rowGrid - 1;
    var positionObject = new Position(col*g_blockSize , row*g_blockSize);

    return positionObject;


}

class Coordinate {

    constructor(row,col) {

        this.row = row;
        this.col = col;

    }

}

class TurnFound {

    constructor(foundBoolean, directionsValue) {

        this.found = foundBoolean;
        this.newDir = directionsValue;

    }

}

class Block {
 
    //attributes = size,position,color,shape,speed,direction
    //behavior = move up,move down, move right,move left,start,stop,draw
 
    // creates a block, given the row number, col number, and colour
    constructor(rowGrid, colGrid, color, curve) {
 
        // using the passed parameters

        this.row = rowGrid;
        this.col = colGrid;
 
        // using the global constants
        this.blockSize =  g_blockSize;
        this.blockColor =  color;
 
        this.curve = curve;
    }

    changeColor(color) {

        this.blockColor = color;

    }

    drawBlock(){
 
        noStroke();
        fill(this.blockColor);
        
        var position = gridToPixel(this.row,this.col);
        
        rect(position.x,position.y,this.blockSize,this.blockSize,this.curve);

    }
    
    setDirection(direction) {

        this.direction = direction;
    
    }
    
    //makes block move based on set/current direction
    moveBlock(){
 
        switch(this.direction){

            case directions.UP:

                this.row = this.row -1;

                break;
 
            case directions.DOWN:

                this.row = this.row + 1;

                break;

            case directions.LEFT:

                this.col = this.col - 1;

                break;
            
            case directions.RIGHT:

                this.col = this.col + 1;

        }
        
    }

    //this gives the block a new position
    newPos(newRow,newCol){

        this.row = newRow;
        this.col = newCol;

    }
 

}
 
class Snake {
 
    //attributes = blocks,length
    //behavior = start,stop,eat,change direction, grow [it will grow the size of the snake]
 
    constructor() {
 
        this.blocks = new Array(0);
 
        this.createInitialDirection();
 
        this.createHead();
        this.isMoving = true;
        this.hardStop = false;
 
    }
 
    createInitialDirection(){
 
        this.turns = new Turnings();
        this.turns.createNewTurn(new Coordinate(0,0),INITIAL_SNAKE_DIRECTION);

    }
 
    createHead(){

        //this is the head block
        var headBlock = new Block(CENTER_GRID, CENTER_GRID,SNAKE_COLORS.HEAD,0);
        headBlock.setDirection(this.turns.getLatestDirection());
        this.blocks.push(headBlock);
    
    }

    // returns true, if the user is asking the Snake to turn in the opposite direction
    checkOppositeDirection(newDirection) {
        
        var currentDirection = this.getHead().direction;

        switch (newDirection) {

            case directions.RIGHT:

                return (currentDirection == directions.LEFT);

                break; 

            case directions.LEFT:

                return (currentDirection == directions.RIGHT); 

                break;

            case directions.UP:

                return (currentDirection == directions.DOWN);

                break;

            case directions.DOWN:

                return (currentDirection == directions.UP);

                break;

        }

    }
 
    // directional key has been found, we need to go
    go(newDirection) {

        this.setToStart();

        if (!(this.checkOppositeDirection(newDirection))) {

            this.setDirection(newDirection);

        }

    }

    // when a new direction is provided, save the previous direction before setting the new direction
    setDirection(directionValue) {
 
        let headOfSnake = this.getHead();

        var turningPointRow = headOfSnake.row;
        var turningPointCol = headOfSnake.col;

        let turningPoint = new Coordinate(turningPointRow, turningPointCol); // this is where the head was when the turn was made

        this.turns.createNewTurn(turningPoint,directionValue);

    }
 
    // this will grow the size of the snake by 1 each time a target is hit
    grow() {
        
        // check which direction the snake is going in
        // if the snake is going to the right, the new block should be added to the left
 
        var newC;
        var newR;

        if (! (this.blocks.length == 1)) {

            this.getTail().changeColor(SNAKE_COLORS.BODY);

        }

        var C = this.getTail().col;
        var R = this.getTail().row;
 
        switch (this.getTail().direction) {
 
            case directions.RIGHT:

                newC = C - 1;
                newR = R;
                
                break;
    
            case directions.LEFT:

                newC = C + 1;
                newR = R;
                
                break;
                
            case directions.UP:

                newR = R + 1;
                newC = C;

                break;
                
            case directions.DOWN:

                newR = R - 1;
                newC = C;

                break;
            
        }

        
        var newBlock = new Block(newR,newC,SNAKE_COLORS.TAIL,0);

        newBlock.setDirection(this.getTail().direction);

        this.blocks.push(newBlock);

    }
    
    setToStart(){

        if (!(this.hardStop)) {

            this.isMoving = true;

        }
        
    }
 
    setToStop(){

        this.isMoving = false;

    }

    setToHardStop() {

        this.hardStop = true;
        this.setToStop();

    }
 
    stopStart(){
 
        this.isMoving = !(this.isMoving);

    }
 
    // returns true if the head block has reached the RIGHT wall
    reachedTheRightWall(headOfSnake){
    
        return (headOfSnake.col == NUM_OF_SECTIONS);
        
    }

    // returns true if the head block has reached the LEFT wall
    reachedTheLeftWall(headOfSnake){
 
        return (headOfSnake.col == 1);

    }

    // returns true if the head block has reached the BOTTOM wall
    reachedTheBottomWall(headOfSnake){
 
        return (headOfSnake.row == NUM_OF_SECTIONS);

    }

    // returns true if the head block has reached the TOP wall
    reachedTheTopWall(headOfSnake){
 
        return (headOfSnake.row == 1);

    }

    getHead() {

        return (this.blocks[0]);

    }

    getTail() {

        let arrLength = this.blocks.length - 1
        return (this.blocks[arrLength]);

    }

    // returns true if the head block has reached a wall
    reachedTheWall() {

        let currentDirection = this.direction;

        let headOfSnake = this.getHead(); // this will give the head of the snake (first element of the array)

        switch (currentDirection) {

            case (directions.RIGHT):

                return this.reachedTheRightWall(headOfSnake);
        
                break;

            case (directions.LEFT):

                return this.reachedTheLeftWall(headOfSnake);

                break;

            case (directions.UP):

                return this.reachedTheTopWall(headOfSnake);

                break;

            case (directions.DOWN):

                return this.reachedTheBottomWall(headOfSnake);

                break;

        }

    }

    //checks if the snake head has hit its own body
    eatingSelf(){

        var snakehead = this.getHead();

        var eatingSnake = false;

        for( var i = 1; i < this.blocks.length ; i++){

            if(snakehead.row == this.blocks[i].row && snakehead.col == this.blocks[i].col){
            
                eatingSnake = true;

            }

        }

        return eatingSnake;

    }

    // given a block, and a turning point, this returns true if the block has reached the turning point, else
    // it returns a false
    bodyHasReachedTurningPoint(bodyBlock) {

        // given the bodyBlock, check against each Turn in the Turns objects
        // keep checking until you find a match, and return a true if match found
        // if all turns have been checked, and match has not been found, then return a false

        var found = false;

        var newDirection;

        for(var i = 0; ((i < this.turns.turnPos.length) && (!found)) ; i++){

            if((bodyBlock.row == this.turns.turnPos[i].row) && (bodyBlock.col == this.turns.turnPos[i].col)){

                found = true;

                newDirection = this.turns.turnDir[i];

            }

        }

        var returnObj = new TurnFound(found, newDirection);
        
        return (returnObj);

    }

    trap() {

        var headBlock = this.blocks[0];
        var firstBody = this.blocks[1];

        let hr = headBlock.row;
        let hc = headBlock.col;

        let br = firstBody.row;
        let bc = firstBody.col;

        var fine = false;

        if (br == hr) {

            if ((bc == hc + 1) || (bc == hc - 1)) {

                fine = true;

            }

        }

        else if (bc == hc) {

            if ((br == hr + 1) || (br == hr - 1)) {

                fine = true;

            }

        }

        return (fine);

    }

    //this will start moving the snake
    move(){

         if(this.isMoving){

            if (this.eatingSelf() || this.reachedTheWall()) {

                deathSound.play();

                this.setToHardStop();

                snakeStatus = "eating self";
                errorMessage = "GAME OVER!!!";

            }

            else {

                // if not reached the wall, then keep the snake moving, else stop
                if (!(this.reachedTheWall())){

                    snakeSound.play();

                    // invoke the move function of each block of the snake

                    // headBlock needs to go in New Direction, whereas Body will go in Previous Direction

                    var headBlock = this.getHead();
                    headBlock.setDirection(this.turns.getLatestDirection());
                    headBlock.moveBlock();

                    //repeat this for the body of the snake (except for the tail)
                    for(var i=1; i < this.blocks.length - 1;i++){    // -1 so that we can exclude the tail
            
                        var bodyBlock = this.blocks[i];
                        // if body has reached the turning point, it should be pointed in new direction
                        // otherwise it can keep going in previous direction

                        var turnFound = this.bodyHasReachedTurningPoint(bodyBlock);

                        if (turnFound.found) {

                            bodyBlock.setDirection(turnFound.newDir);
                        
                        }
                        
                        bodyBlock.moveBlock();     

                    }

                    var tailBlock = this.getTail();

                    var turnFound = this.bodyHasReachedTurningPoint(tailBlock);

                    if (turnFound.found) {
                        
                        tailBlock.setDirection(turnFound.newDir);
                        
                        this.turns.removeOldestTurn();

                    }

                    tailBlock.moveBlock();

                    }

            }

        }  

    }
 
    // paints all the blocks within this snake
    paint() {
 
        for(var i=0; i < this.blocks.length; i++){

            this.blocks[i].drawBlock();

        }
 
    }
    

}

class Target{
 
//attributes = block
//behavior = draw,eaten
 
    constructor(){
    
        var targetRow = this.getTargetPosition();
        var targetCol = this.getTargetPosition();
        
        this.block = new Block(targetRow,targetCol,SNAKE_COLORS.TARGET,20);
        
    }

    //draws the target
    paint(){
        
        this.block.drawBlock();

    }

    //gets a random position for the target between the first margin and second margin
    getTargetPosition(){
        
        var sectionMargin = Math.floor((MARGIN/100) * NUM_OF_SECTIONS); // "/100"

        var targetPosition = Math.floor(Math.random() * (NUM_OF_SECTIONS -(2*sectionMargin)) ) + sectionMargin;
        
        return targetPosition;

    }
    
    // this will take the the target and repsoition it
    // we will get a neww random target position
    // create block with new position
    reposition(){

        var newRow = this.getTargetPosition();
        var newCol = this.getTargetPosition();

        this.block.newPos(newRow,newCol);

    }

}
 
class Canvas{}
 
class Position{
 
    //attributes = x,y
 
    constructor(x,y) {
 
        this.x = x;
        this.y = y;

    }
 
}
 
class Turnings{

    constructor(){

        this.turnPos = new Array(0);
        this.turnDir = new Array(0);

    }
    
    // //this method will print out the values of the properties
    // printYourself() {

    //     show("-------- printing the turns -----------")

    //     for (var i =0; i < this.turnPos.length; i++){

    //         show ("Turn >> " + this.turnPos[i].row + "," + this.turnPos[i].col + " >> " + this.turnDir[i]);
            
    //     }

    // }

    //adding position of turn and direction turn in to arrays
    createNewTurn(coordObj,dir){

        this.turnPos.push(coordObj);
        this.turnDir.push(dir);

    }

    //removes the oldest/first turn in array
    removeOldestTurn(){

        this.turnPos.shift();
        this.turnDir.shift();

    }

    // gets the latest value from the direction queue
    getLatestDirection(){

        return (this.turnDir[this.turnDir.length-1]);

    }

    // gets the latest value from the position queue
    getLatestPosition(){

        return (this.turnPos[this.turnPos.length-1]);

    }

    // gets the second from latest value from the direction queue
    getSecondFromLatestDirection(){

        return (this.turnDir[this.turnDir.length-2]);

    }

    // gets the second latest value from the position queue
    getSecondFromLatestPosition(){

        return (this.turnPos[this.turnPos.length-2]);

    }

    print(){

        for (var i=0;i<this.turnPos.length;i++){

            show(i + "-->" + this.turnPos[i] + "-->" + this.turnDir[i]);
            
        }

    }

}

//returns true if snake head has reached target else false
function reachedTarget(){
  
    if(myTarget.block.row == mySnake.getHead().row && myTarget.block.col == mySnake.getHead().col){

        return true;

    }
    
    else{

        return false;

    }

}

//////////////////// MAIN FUNCTIONALITY /////////////////////
//////////////////// MAIN FUNCTIONALITY /////////////////////
//////////////////// MAIN FUNCTIONALITY /////////////////////
//////////////////// MAIN FUNCTIONALITY /////////////////////
//////////////////// MAIN FUNCTIONALITY /////////////////////

//helps figure out which key has been pressed
document.addEventListener("keydown",function(event) {
 
    onkeypressed(event);

})

//////////////////////// END OF MAIN ////////////////////////

//provides ability to incoroporate sounds into game
function sound(src) {

    this.sound = document.createElement("audio");

    this.sound.src = src;

    this.sound.setAttribute("preload", "auto");

    this.sound.setAttribute("controls", "none");

    this.sound.style.display = "none";

    document.body.appendChild(this.sound);

    this.play = function(){

        this.sound.play();

    }

    this.stop = function(){

        this.sound.pause();

    }    

}
 
//sets the color for the lines on the grid (divideCanvas)
function setGridLineColour(){

    let THIN = 1;
    strokeWeight(THIN);
    
    let GREY_COLOR = 10;
    stroke(GREY_COLOR);

}
    
//divides canvas and draws rows and columns
function divideCanvas(){

    setGridLineColour();

    for(var i = 0; i<NUM_OF_SECTIONS; i++){

        var drawLines = i*g_blockSize;

        line(drawLines, 0, drawLines, CANVAS_SIZE);
        line(0, drawLines, CANVAS_SIZE, drawLines);

    }
 
}

// paint the background and then draw the grid lines
function createBackgroundWithGridLines() {
    background(57,104,64);
    divideCanvas(); 

}

// given a snake, this will paint it and ask it to move
function makeSnakeMove(snake) {
    
    snake.paint();
    snake.move();
    
}

//given a size, sets number of body blocks to given size
function intialSnakeGrow(snake) {

    for (var i = 0; i < BODY_SIZE; i++) {

        growTheSnake(snake);

    }

}

// given a snake, this will grow it
function growTheSnake(snake) {

    snake.grow();
    
}

// given a Target, reposition it
function repositionTarget(target) {

    target.reposition();

}

//increments score count
function increaseScoreCount() {

    g_targetCollisionCount++;

}

//display the score count in a textbox
function displayScore(){

    document.getElementById("scoreCount").value = "Score Count = " + g_targetCollisionCount;

}

//display the stats of the snake in a textbox
function snakeStats(){
    
    document.getElementById("snakeStatus").value = "Snake is " + snakeStatus;

}

//displays "GAME OVER!!!" whenever something goes wrong
function displayErrorMessage(){

    document.getElementById("errorMessage").value = errorMessage;

}

//displays the size of the snake
function displaySnakeSize(){

    document.getElementById("snakeSize").value = "Snake is " + SNAKE_SIZE + " blocks big";

}

//displays basic game info
function displayGameInfo(){

    document.getElementById("black").value = BLACK_BLOCK ;
    document.getElementById("white").value = WHITE_BLOCK ;
    document.getElementById("lightgrey").value = LIGHT_GREY_BLOCK ;
    document.getElementById("darkgrey").value = DARK_GREY_BLOCK ;

}

// keyboard event 
function onkeypressed(event) {
 
    switch (event.key) {
 
        case ARROW_DOWN:

            mySnake.go(directions.DOWN);
            
            break;
 
        case ARROW_UP:

            mySnake.go(directions.UP);

            break;
 
        case ARROW_LEFT:

            mySnake.go(directions.LEFT);

            break;
 
        case ARROW_RIGHT:

            mySnake.go(directions.RIGHT);
            
            break;
        
        case SPACE_KEY:

            mySnake.setToStop();
 
    }
 
}

/////////////////////////////////// DRAW ///////////////////////////////////
/////////////////////////////////// DRAW ///////////////////////////////////
/////////////////////////////////// DRAW ///////////////////////////////////
/////////////////////////////////// DRAW ///////////////////////////////////
/////////////////////////////////// DRAW ///////////////////////////////////

function setup(){
 
    createCanvas(CANVAS_SIZE,CANVAS_SIZE);

    frameRate(FRAME_RATE);

    intialSnakeGrow(mySnake);

}

function draw(){
 
    // create the background with the grid lines
    createBackgroundWithGridLines();

    //display the score count in a textbox
    displayScore();

    //display the stats of the snake in a textbox
    snakeStats();

    //displays "GAME OVER!!!" whenever something goes wrong
    displayErrorMessage();

    //displays the size of the snake
    displaySnakeSize();

    //displays basic game info
    displayGameInfo();

    //if the snakehead has reached the Target, 
    //   target will disappear and reappear somewhere else
    //   increase the score count
    //   grow the snake
    //else (snake head has not reached the target)
    //   do nothing 

    if (reachedTarget()) {

        eatingTargetSound.play();

        repositionTarget(myTarget);

        increaseScoreCount();

        growTheSnake(mySnake);

    }
    else {

        // do nothing


    }
    myTarget.paint();

    // make the snake move
    makeSnakeMove(mySnake);
    
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////OBJECTS//////////////////////////////////////////////////////
//////////////////////////////////////////////OBJECTS//////////////////////////////////////////////////////
//////////////////////////////////////////////OBJECTS//////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

var mySnake = new Snake();
var myTarget = new Target();

eatingTargetSound = new sound("eatingTargetSound.wav");
snakeSound = new sound("snakeSound.wav");
deathSound = new sound("deathSound.wav");



