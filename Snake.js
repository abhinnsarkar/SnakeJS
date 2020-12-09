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
// global variables go here //
 
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



const INITIAL_SNAKE_DIRECTION = directions.RIGHT;
const CANVAS_SIZE = 600;
const FRAME_RATE = FRAME_SPEED.VERY_FAST;   // higher is faster
const NUM_OF_SECTIONS = 51;
const BODY_SIZE=11;
var g_targetCollisionCount  = 0;

const CENTER_GRID = (NUM_OF_SECTIONS + 1)/2;
// show(CENTER_GRID);
 
const g_initialX = CANVAS_SIZE/2;
const g_initialY = CANVAS_SIZE/2;
const g_blockSize = CANVAS_SIZE/NUM_OF_SECTIONS;
const g_blockColor = 10;
const g_headColor = 100;
 
const ARROW_DOWN = "ArrowDown";
const ARROW_UP = "ArrowUp";
const ARROW_RIGHT = "ArrowRight";
const ARROW_LEFT = "ArrowLeft";
const SPACE_KEY = " ";
 

 
 
const g_distance = 15;
 
//returns a position object with pixel values, given the row and col of the grid
function gridToPixel(rowGrid,colGrid){

    var col = colGrid - 1;
    var row = rowGrid - 1;
    var positionObject = new Position(col*g_blockSize , row*g_blockSize);

    // show(rowGrid,colGrid);

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
    constructor(rowGrid, colGrid, color) {
 
        // using the passed parameters
        // this.position = gridToPixel(rowGrid,colGrid);   

        this.row = rowGrid;
        this.col = colGrid;
 
        // using the global constants
        this.blockSize =  g_blockSize;
        this.blockColor =  color;

        // show("Color of the block is " + color);
        
        // show(this.row);
        // show(this.col);

 
    }

    
    changeColor(color) {
        this.blockColor = color;
    }
    drawBlock(){
 
        // show("entered drawBlock");
        noStroke();
        fill(this.blockColor);
        
        var position = gridToPixel(this.row,this.col);

        // show(positionObject);
        
        rect(position.x,position.y,this.blockSize,this.blockSize);

        // show(position.x + " ,  " + position.y);

    }
    
    
    setDirection(direction) {
        this.direction = direction;
    }
    
    //makes block move based on set/current direction
    moveBlock(){
 
        switch(this.direction){

            case directions.UP:
                // this.position.y = this.position.y - g_blockSize;

                // this.col = this.col - g_blockSize;

                this.row = this.row -1;

                break;
 
            case directions.DOWN:
                // this.position.y = this.position.y + g_blockSize;

                // this.col = this.col + g_blockSize;
                this.row = this.row + 1;

                break;

            case directions.LEFT:
                // this.position.x = this.position.x - g_blockSize;

                // this.row = this.row - g_blockSize;
                this.col = this.col - 1;


                break;
            
            case directions.RIGHT:

                // this.position.x = this.position.x + g_blockSize;

                // this.row = this.row + g_blockSize;
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
    //behavior = start,stop,eat,changedirection, grow [it will grow the size of the snake]
 
    constructor() {
 
        this.blocks = new Array(0);
 
        this.createInitialDirection();
 
        this.createHead();
        this.isMoving = true;
        this.hardStop = false;

        //this.turningPoint = new Coordinate(0,0);

 
        
 
    }
 
    //
    createInitialDirection(){
 
        this.turns = new Turnings();
        this.turns.createNewTurn(new Coordinate(0,0),INITIAL_SNAKE_DIRECTION);

    }
 
    createHead(){
        //this is the head block
        // this.blocks.push(new Block(CENTER_GRID, CENTER_GRID,SNAKE_COLORS.HEAD));
        var headBlock = new Block(CENTER_GRID, CENTER_GRID,SNAKE_COLORS.HEAD);
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
 
        // this.prevDirection = this.direction;  // save the current direction in the prev variable ; so RIGHT
        // this.direction = directionValue; // this will now be UP

        let headOfSnake = this.getHead();

        var turningPointRow = headOfSnake.row;
        var turningPointCol = headOfSnake.col;

        let turningPoint = new Coordinate(turningPointRow, turningPointCol); // this is where the head was when the turn was made

        this.turns.createNewTurn(turningPoint,directionValue);

        

        // show("--------------------------------------------------------------------")
        // show("New Dir " + this.turns.getLatestDirection() + " Prev Dir " + this.turns.getSecondFromLatestDirection());
        // show("turn point " + this.turns.getLatestPosition().row + " " + this.turns.getLatestPosition().col);

    }
 
    // this will grow the size of the snake by 1
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
                // show("direction is right");
                newC = C - 1;
                newR = R;
                break;
    
            case directions.LEFT:
                // show("direction is left");
                newC = C + 1;
                newR = R;
                break;
                //
            case directions.UP:
                // show("direction is up");
                newR = R + 1;
                newC = C;
                break;
                //
            case directions.DOWN:
                // show("direction is down");
                newR = R - 1;
                newC = C;
                break;
                //
            
        }

        
        var newBlock = new Block(newR,newC,SNAKE_COLORS.TAIL);
        newBlock.setDirection(this.getTail().direction);

        // show("new block created, pushing it now");
        this.blocks.push(newBlock);

        // show("new block has been pushed");
 
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
 
        // if(this.isMoving){
        //     this.isMoving = false;
        // }
        // else{
        //     this.isMoving = true;
        // }
    }
 

    // returns true if the head block has reached the RIGHT wall
    reachedTheRightWall(headOfSnake){
 
        // let rightWall = CANVAS_SIZE;
        // return (headOfSnake.position.x + g_blockSize >= rightWall);


        return (headOfSnake.col == NUM_OF_SECTIONS);
    }

    // returns true if the head block has reached the LEFT wall
    reachedTheLeftWall(headOfSnake){
 
        // let leftWall = 0;
        // return (headOfSnake.position.x /*- g_blockSize*/ <= leftWall);

        return (headOfSnake.col == 1);

    }

    // returns true if the head block has reached the BOTTOM wall
    reachedTheBottomWall(headOfSnake){
 
        // let bottomWall = CANVAS_SIZE;
        // return (headOfSnake.position.y + g_blockSize >= bottomWall);

        return (headOfSnake.row == NUM_OF_SECTIONS);

    }

    // returns true if the head block has reached the TOP wall
    reachedTheTopWall(headOfSnake){
 
        // let topWall = 0;
        // return (headOfSnake.position.y /*- g_blockSize*/ <= topWall);

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

            // return(snakehead.row == this.blocks[i].row && snakehead.col == this.blocks[i].col);

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


        // return ((bodyBlock.row == this.turns.getLatestPosition().row) && (bodyBlock.col == this.turns.getLatestPosition().col));

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

            // if(!(this.eatingSelf())){

            // }


            if (this.eatingSelf()) {

                this.setToHardStop();
                show("SNAKE EATING SELF !! GAME OVER")
            }
            else {
                // if not reached the wall, then keep the snake moving, else stop
                if (!(this.reachedTheWall()))

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
                        // show("... reached turn, go " + turnFound.newDir);
                        bodyBlock.setDirection(turnFound.newDir);
                    
                    }
                    
                    bodyBlock.moveBlock();      
                }

                var tailBlock = this.getTail();

                // var turnFound = this.bodyHasReachedTurningPoint(tailBlock);
                var turnFound = this.bodyHasReachedTurningPoint(tailBlock);
                if (turnFound.found) {

                    // show("entered if");
                    tailBlock.setDirection(turnFound.newDir);
                    this.turns.removeOldestTurn();

                    
                }

                tailBlock.moveBlock();
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
// g_targetColAndRowLimit = NUM_OF_SECTIONS - 1;
// var target_Row_Block2 = Math.floor(Math.random() * g_targetColAndRowLimit);
// var target_Col_Block2 = Math.floor(Math.random() * g_targetColAndRowLimit);

 
class Target{
 
//attributes = block
//behavior = draw,eaten
 
    constructor(){

        // this.block = new Block(16,16,SNAKE_COLORS.TARGET);
        // this.block.drawBlock();

        //
        
        // this.getTargetPosition();
        
        var targetRow = this.getTargetPosition();
        var targetCol = this.getTargetPosition();
        // var target_Row = Math.floor(Math.random() * NUM_OF_SECTIONS);
        // var target_Col = Math.floor(Math.random() * NUM_OF_SECTIONS);

        // var target_Row_Block2 = Math.floor(Math.random() * g_targetColAndRowLimit);
        // var target_Col_Block2 = Math.floor(Math.random() * g_targetColAndRowLimit);

        // if(g_targetCollisionCount == 1){
            this.block = new Block(targetRow,targetCol,SNAKE_COLORS.TARGET);
            // this.block = new Block(target_Row_Block2,target_Col_Block2,SNAKE_COLORS.TARGET);
        // }
        // else{
        //     this.block = new Block(target_Row_Block2,target_Col_Block2,SNAKE_COLORS.TARGET);
        // }
        

        
        

        // show(target_Row);
        // show(target_Col);

    }

    //draws the target
    paint(){
        
        this.block.drawBlock();

    }

    //gets a random position for the target between 1 and the number of sections
    getTargetPosition(){
        
        // var targetRow = Math.floor(Math.random() * NUM_OF_SECTIONS);


        var targetPosition = Math.floor(Math.random() * NUM_OF_SECTIONS);

        if(targetPosition == 0){
            targetPosition = 1;
        }

        return targetPosition;
    }
    
    
    // this will take the the target and repsoition it
    // we will get a neww random target position
    // create block with new position
    reposition(){

        var newRow = this.getTargetPosition();
        var newCol = this.getTargetPosition();

        // this.block = new Block(newRow,newCol,SNAKE_COLORS.TARGET);

        this.block.newPos(newRow,newCol);


    }

}


//returns true if snake head has reached target else false

function reachedTarget(){

    // if(g_targetCollisionCount == 0){
  
        if(myTarget.block.row == mySnake.getHead().row && myTarget.block.col == mySnake.getHead().col){

            // show("COLLISION HAS OCCURED!!!")
            
            // g_targetCollisionCount++;

            // show("Collsion Count = " + g_targetCollisionCount);
            // showCollisonCount();

            return true;



        }
        else{

            // myTarget.paint();

            return false;


        }

    
    }


function showCollisonCount(){
    show("Collsion Count = " + g_targetCollisionCount);
}
 
class Canvas{
 
    //attributes = size,color,shape,position
    //behavior = draw
 
}
 
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
    

    
    //this method will print out the values of the properties
    printYourself() {

        show("-------- printing the turns -----------")

        for (var i =0; i < this.turnPos.length; i++){

            show ("Turn >> " + this.turnPos[i].row + "," + this.turnPos[i].col + " >> " + this.turnDir[i]);
            
        }

    }
    //adding position of turn and direction turn in to arrays
    createNewTurn(coordObj,dir){

        // this.blocks.push(new Block(CENTER_GRID, CENTER_GRID,SNAKE_COLORS.HEAD));
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


// ------------------- MAIN FUNCTIONALITY -------------------
// ------------------- MAIN FUNCTIONALITY -------------------
// ------------------- MAIN FUNCTIONALITY -------------------
// ------------------- MAIN FUNCTIONALITY -------------------
// ------------------- MAIN FUNCTIONALITY -------------------
// ------------------- MAIN FUNCTIONALITY -------------------
// ------------------- MAIN FUNCTIONALITY -------------------
// ------------------- MAIN FUNCTIONALITY -------------------
// ------------------- MAIN FUNCTIONALITY -------------------
// ------------------- MAIN FUNCTIONALITY -------------------
// ------------------- MAIN FUNCTIONALITY -------------------
// ------------------- MAIN FUNCTIONALITY -------------------


// Add Global Functionality here 
 
var mySnake = new Snake();
var myTarget = new Target();

 
document.addEventListener("keydown",function(event) {
 
    onkeypressed(event);
 
}
 
 
)
 
// ------------------- END OF MAIN -------------------
 
function setup(){
 
    createCanvas(CANVAS_SIZE,CANVAS_SIZE);
    frameRate(FRAME_RATE);
    

    intialSnakeGrow(mySnake);



}


function setGridLineColour(){

    let THIN = 1;
    strokeWeight(THIN);
    
    let GREY_COLOR = 10;
    stroke(GREY_COLOR);
}
    
function divideCanvas(){
    
    // console.log("Dividing the canvas");
    setGridLineColour();
    // var numberOfLines = 10;
    // var space = CANVAS_SIZE / numberOfLines;
    
    for(var i = 0; i<NUM_OF_SECTIONS; i++){

        var drawLines = i*g_blockSize;

        // console.log("Drawing a line");

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


function intialSnakeGrow(snake) {

    for (var i = 0; i < BODY_SIZE; i++) {
        growTheSnake(snake);
    }
}


// given a snake, this will grow it
function growTheSnake(snake) {
    // show("enetered growTheSnake");
    snake.grow();
    
}


// given a Target, reposition it
function repositionTarget(target) {
    target.reposition();

}

function increaseScoreCount() {
    //todo : rename this to a more appropriate variable name
    g_targetCollisionCount++;
    show( "Score Count = " + g_targetCollisionCount);
}


 
// keyboard event 
function onkeypressed(event) {
 
    // show(">>>" + event.key + "<<<");
 
 
 
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
// show(mySnake.getHead().row);


//************************************************************************//
//*                                                                      *//
//*                                                                      *//
//*              javascript runs this function in a loop                 *//
//*                                                                      *//
//*                                                                      *//
//************************************************************************//
function draw(){
    
 
    // create the background with the grid lines
    createBackgroundWithGridLines();

    //if the snakehead has reached the Target, 
    //   target will disappear and reappear somewhere else
    //   increase the score count
    //   grow the snake
    //else (snake head has not reached the target)
    //   do nothing 

    if (reachedTarget()) {
        repositionTarget(myTarget);
        increaseScoreCount();
        growTheSnake(mySnake);
    }
    else {
        // do nothing
    }

    
    
    myTarget.paint();

    // mySnake.grow();
    // make the snake move
    makeSnakeMove(mySnake);
    
}