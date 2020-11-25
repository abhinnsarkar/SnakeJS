// MODIFICATION LOG
 
// Sept-30 : Abhinn : Adding a feature to capture Keyboard Input to decide Initial Direction

// November-17 : Abhinn : We added functionality, such that the snake moves only when a directional arrow is pressed
//                        Further, Space bar will stop the snake 
//                        Further, Snake cannot go in the opposite direction

//November 18 : We made it so that the snake will stop when it hits a wall

//November 21 : we added a grid functionality so that we are not using any pixel(x and y) values and drew a target

//November 23 : I made the target disappear when it collides with the snake head

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

 
const FRAME_SPEED = {  // this is an example of enumeration
 
    VERY_SLOW: 1,
    SLOW:3,
    MEDIUM:5,
    FAST:7,
    VERY_FAST:10
}



const g_canvasSize = 600;
const g_FrameRate = FRAME_SPEED.FAST;   // higher is faster
const g_numberOfSections = 21;
var g_targetCollisionCount  = 0;

const g_centreGrid = (g_numberOfSections + 1)/2;
// show(g_centreGrid);
 
const g_initialX = g_canvasSize/2;
const g_initialY = g_canvasSize/2;
const g_blockSize = g_canvasSize/g_numberOfSections;
const g_blockColor = 10;
const g_headColor = 100;
 
const ARROW_DOWN = "ArrowDown";
const ARROW_UP = "ArrowUp";
const ARROW_RIGHT = "ArrowRight";
const ARROW_LEFT = "ArrowLeft";
const SPACE_KEY = " ";
 
const directions = {  // this is an example of enumeration
 
    RIGHT: "right",
    LEFT:"left",
    UP:"up",
    DOWN:"down"
}
 
const snakecolors = {
 
    HEAD: 10,
    BODY:100,
    TARGET:200
}
 
 
const g_distance = 15;
 
//returns a position object with pixel values, given the row and col of the grid
function gridToPixel(rowGrid,colGrid){

    var col = colGrid - 1;
    var row = rowGrid - 1;
    var positionObject = new Position(col*g_blockSize , row*g_blockSize);

    // show(rowGrid,colGrid);

    return positionObject;


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
 
    drawBlock(){
 
        // show("entered drawBlock");
        noStroke();
        fill(this.blockColor);
        
        var position = gridToPixel(this.row,this.col);

        // show(positionObject);
        
        rect(position.x,position.y,this.blockSize,this.blockSize);

        // show(position.x + " ,  " + position.y);

    }
    //makes block move based on set/current direction
    moveBlock(direction){
 
        switch(direction){

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
 
        // this.createInitialDirection();
 
        this.createHead();
        this.isMoving = false;
 
    }
    //
    // // createInitialDirection(){
 
    //     this.direction = directions.UP;
    //     this.direction = directions.DOWN;
    //     this.direction = directions.LEFT;
    //     this.direction = directions.RIGHT;
    // // }
 
    createHead(){
        //this is the head block
        // this.blocks.push(new Block(g_centreGrid, g_centreGrid,snakecolors.HEAD));
        this.blocks.push(new Block(g_centreGrid, g_centreGrid,snakecolors.HEAD));
    
    
    }



    // returns true, if the user is asking the Snake to turn in the opposite direction
    checkOppositeDirection(newDirection) {
        
        var currentDirection = this.direction;

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

    setDirection(directionValue) {
 
        this.direction = directionValue;
    }
 
    // this will grow the size of the snake by 1
    grow() {
 
        // check which direction the snake is going in
        // if the snake is going to the right, the new block should be added to the left
 
        // find the last block,
        // find the x and y coordinate of the last block
        // reduce x by block size for the new block
 

        show("entered grow");
        // var newXR = this.getTail().row;
        // var newYU = this.getTail().col;
        // var newXL = this.getTail().row;
        // var newYD = this.getTail().col;
 

        var newC;
        var newR;

        var C = this.getTail().col;
        var R = this.getTail().row;
 

        // show("newXR => " + newXR);
        // show("newYU => " + newYU);
        // show("newXL => " + newXL);
        // show("newYD => " + newYD);
        // show("newX  => " + newX);
        // show("newY  => " + newY);

        switch (this.direction) {
 
            case directions.RIGHT:
                show("direction is right");
                newC = C - 1;
                newR = R;
                break;
    
            case directions.LEFT:
                show("direction is left");
                newC = C + 1;
                newR = R;
                break;
                //
            case directions.UP:
                show("direction is up");
                newR = R + 1;
                newC = C;
                break;
                //
            case directions.DOWN:
                show("direction is down");
                newR = R - 1;
                newC = C;
                break;
                //
            
        }

        // show("After the direction switch ----------------");
        // show("newXR => " + newXR);
        // show("newYU => " + newYU);
        // show("newXL => " + newXL);
        // show("newYD => " + newYD);
        // show("newX  => " + newX);
        // show("newY  => " + newY);
 
        show("creating newBlock");
        // var newBlock = new Block(new Position(newX, newY),snakecolors.HEAD);
        var newBlock = new Block(newR,newC,snakecolors.BODY);

        show("new block created, pushing it now");
        this.blocks.push(newBlock);

        show("new block has been pushed");
 
    }
    
    setToStart(){
        this.isMoving = true;
    }
 
    setToStop(){
        this.isMoving = false;
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
 
        // let rightWall = g_canvasSize;
        // return (headOfSnake.position.x + g_blockSize >= rightWall);


        return (headOfSnake.col == g_numberOfSections);
    }

    // returns true if the head block has reached the LEFT wall
    reachedTheLeftWall(headOfSnake){
 
        // let leftWall = 0;
        // return (headOfSnake.position.x /*- g_blockSize*/ <= leftWall);

        return (headOfSnake.col == 1);

    }

    // returns true if the head block has reached the BOTTOM wall
    reachedTheBottomWall(headOfSnake){
 
        // let bottomWall = g_canvasSize;
        // return (headOfSnake.position.y + g_blockSize >= bottomWall);

        return (headOfSnake.row == g_numberOfSections);

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

    //this will start moving the snake
    move(){

         if(this.isMoving){

            if (!(this.reachedTheWall()))

                // invoke the move function of each block of the snake
                for(var i=0; i < this.blocks.length;i++){
        
                    this.blocks[i].moveBlock(this.direction);

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
// g_targetColAndRowLimit = g_numberOfSections - 1;
// var target_Row_Block2 = Math.floor(Math.random() * g_targetColAndRowLimit);
// var target_Col_Block2 = Math.floor(Math.random() * g_targetColAndRowLimit);

 
class Target{
 
//attributes = block
//behavior = draw,eaten
 
    constructor(){

        // this.block = new Block(16,16,snakecolors.TARGET);
        // this.block.drawBlock();

        //
        
        // this.getTargetPosition();
        
        var targetRow = this.getTargetPosition();
        var targetCol = this.getTargetPosition();
        // var target_Row = Math.floor(Math.random() * g_numberOfSections);
        // var target_Col = Math.floor(Math.random() * g_numberOfSections);

        // var target_Row_Block2 = Math.floor(Math.random() * g_targetColAndRowLimit);
        // var target_Col_Block2 = Math.floor(Math.random() * g_targetColAndRowLimit);

        // if(g_targetCollisionCount == 1){
            this.block = new Block(targetRow,targetCol,snakecolors.TARGET);
            // this.block = new Block(target_Row_Block2,target_Col_Block2,snakecolors.TARGET);
        // }
        // else{
        //     this.block = new Block(target_Row_Block2,target_Col_Block2,snakecolors.TARGET);
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
        
        // var targetRow = Math.floor(Math.random() * g_numberOfSections);


        var targetPosition = Math.floor(Math.random() * g_numberOfSections);

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

        // this.block = new Block(newRow,newCol,snakecolors.TARGET);

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

    // }

    // if(g_targetCollisionCount > 0){
    //     // this.block = new Block(target_Row_Block2,target_Col_Block2,snakecolors.TARGET);
    //     // myTarget2.paint();
    //     // // show("Collsion Count = " + g_targetCollisionCount);
    //     // g_targetCollisionCount = 2;;
    //     // showCollisonCount();
     
        

    //     if(myTarget2.block.row == mySnake.getHead().row && myTarget2.block.col == mySnake.getHead().col){

    //         // show("COLLISION HAS OCCURED!!!")
            
    //         g_targetCollisionCount++;

    //         // show("Collsion Count = " + g_targetCollisionCount);
    //         showCollisonCount();

    //         return true;



    //     }
    //     else{

    //         myTarget.paint();

    //         return false;


    //     }




















    }




// function reachedTarget2(){

//     if(g_targetCollisionCount >= 1){
//         // this.block = new Block(target_Row_Block2,target_Col_Block2,snakecolors.TARGET);
//         // myTarget2.paint();
//         // // show("Collsion Count = " + g_targetCollisionCount);
//         // g_targetCollisionCount = 2;;
//         // showCollisonCount();
     
        

//         if(myTarget2.block.row == mySnake.getHead().row && myTarget2.block.col == mySnake.getHead().col){

//             // show("COLLISION HAS OCCURED!!!")
            
//             g_targetCollisionCount = 2;

//             // show("Collsion Count = " + g_targetCollisionCount);
//             showCollisonCount();

//             return true;



//         }
//         else{

//             myTarget2.paint();

//             return false;


//         }
//     }
// }

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
 
// ------------------- MAIN FUNCTIONALITY -------------------
 
// Add Global Functionality here 
 
var mySnake = new Snake();
var myTarget = new Target();
// var myTarget2 = new Target();





// mySnake.grow();
// mySnake.grow();
// mySnake.grow();
 
// grow();
// grow();
// grow();
 
 
document.addEventListener("keydown",function(event) {
 
    onkeypressed(event);
 
}
 
 
)
 
// ------------------- END OF MAIN -------------------
 
function setup(){
 
    createCanvas(g_canvasSize,g_canvasSize);
    frameRate(g_FrameRate);


    
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
    // var space = g_canvasSize / numberOfLines;
    
    for(var i = 0; i<g_numberOfSections; i++){

        var drawLines = i*g_blockSize;

        // console.log("Drawing a line");

        line(drawLines, 0, drawLines, g_canvasSize);
        line(0, drawLines, g_canvasSize, drawLines);

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

// given a snake, this will grow it
function growTheSnake(snake) {
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

    // make the snake move
    makeSnakeMove(mySnake);
    
}