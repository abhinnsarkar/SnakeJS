// MODIFICATION LOG
 
// Sept-30 : Abhinn : Adding a feature to capture Keyboard Input to decide Initial Direction

// November-17 : Abhinn : We added functionality, such that the snake moves only when a directional arrow is pressed
//                        Further, Space bar will stop the snake 
//                        Further, Snake cannot go in the opposite direction

//November 18 : We made it so that the snake will stop when it hits a wall

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
 
const g_canvasSize = 600;

const g_numberOfSections = 5;

const g_centreGrid = (g_numberOfSections + 1)/2;
show(g_centreGrid);
 
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
    BODY:100
}
 
 
const g_distance = 15;
 
//returns a position object with pixel values, given the row and col of the grid
function gridToPixel(rowGrid,colGrid){

    var col = colGrid - 1;
    var row = rowGrid - 1;
    var positionObject = new Position(col*g_blockSize , row*g_blockSize);

    show(rowGrid,colGrid);

    return positionObject;


}

class Block {
 
    //attributes = size,position,color,shape,speed,direction
    //behavior = move up,move down, move right,move left,start,stop,draw
 
    // creates a block, given the row number, col number, and colour
    constructor(rowGrid, colGrid, color) {
 
        // using the passed parameters
        this.position = gridToPixel(rowGrid,colGrid);   
 
        // using the global constants
        this.blockSize =  g_blockSize;
        this.blockColor =  color;

        show("Color of the block is " + color);
 
    }
 
    drawBlock(){
 
        noStroke();
        fill(this.blockColor);
        rect(this.position.x,this.position.y,this.blockSize,this.blockSize,5);
 
    }
    //makes block move based on set/current direction
    moveBlock(direction){
 
        switch(direction){

            case directions.UP:
                this.position.y = this.position.y - g_blockSize;
                break;
 
            case directions.DOWN:
                this.position.y = this.position.y + g_blockSize;
                break;

            case directions.LEFT:
                this.position.x = this.position.x - g_blockSize;
                break;
            
            case directions.RIGHT:
                this.position.x = this.position.x + g_blockSize;

        }
        
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
        this.blocks.push(new Block(g_centreGrid, g_centreGrid,10));
    
    
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


    // // asks the snake to go to the right
    // goRight() {

    //     // set the snake in motion in case it was not already moving
        
    // }

    // // asks the snake to go to the Left
    // goLeft() {

    //     // set the snake in motion in case it was not already moving
    //     this.setToStart();

    //     if (!(this.checkOppositeDirection(directions.LEFT))) {

    //         console.log("I am going Right ");
 
    //         this.setDirection(directions.LEFT);
    //     }
    // }

    // // asks the snake to go to the right
    // goUp() {

    //     // set the snake in motion in case it was not already moving
    //     this.setToStart();

    //     if (!(this.checkOppositeDirection(directions.UP))) {

    //         console.log("I am going Right ");
 
    //         this.setDirection(directions.RIGHT); 
    //     }
    // }

    // // asks the snake to go to the right
    // goRight() {

    //     // set the snake in motion in case it was not already moving
    //     this.setToStart();

    //     if (!(this.checkOppositeDirection(directions.RIGHT))) {

    //         console.log("I am going Right ");
 
    //         this.setDirection(directions.RIGHT);
    //     }
    // }
 
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
 
        var newXR = this.blocks[this.blocks.length - 1].position.x;
        var newYU = this.blocks[this.blocks.length - 1].position.y;
        var newXL = this.blocks[this.blocks.length - 1].position.x;
        var newYD = this.blocks[this.blocks.length - 1].position.y;
 
        var newX = this.blocks[this.blocks.length - 1].position.x;
        var newY = this.blocks[this.blocks.length - 1].position.y;
 
        switch (this.direction) {
 
            case directions.RIGHT:
                newXR = newXR - g_blockSize
    
            case directions.LEFT:
                newXL = newXL - g_blockSize;
                //
            case directions.UP:
                newYU = newYU - g_blockSize
                //
            case directions.DOWN:
                newYD = newYD + g_blockSize
                //
            
        }
 
        var newBlock = new Block(new Position(newX, newY),snakecolors.BODY);
 
        this.blocks.push(newBlock);
 
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
 
        let rightWall = g_canvasSize;
        return (headOfSnake.position.x + g_blockSize >= rightWall);
    }

    // returns true if the head block has reached the LEFT wall
    reachedTheLeftWall(headOfSnake){
 
        let leftWall = 0;
        return (headOfSnake.position.x /*- g_blockSize*/ <= leftWall);
    }

    // returns true if the head block has reached the BOTTOM wall
    reachedTheBottomWall(headOfSnake){
 
        let bottomWall = g_canvasSize;
        return (headOfSnake.position.y + g_blockSize >= bottomWall);
    }

    // returns true if the head block has reached the TOP wall
    reachedTheTopWall(headOfSnake){
 
        let topWall = 0;
        return (headOfSnake.position.y /*- g_blockSize*/ <= topWall);
    }

    // returns true if the head block has reached a wall
    reachedTheWall() {
        let currentDirection = this.direction;
        let headOfSnake = this.blocks[0]; // this will give the head of the snake (first element of the array)

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
 
    checkIfReachedRightWall(){
 
        var headBlock = this.blocks[0];
 
        if( (headBlock.position.x + ( g_canvasSize / 30 ) ) >= g_canvasSize){
 
            this.setToStop();
            return true;
            
        }
 
        else{
 
            for(var i=0; i < 100;i++){
    
                this.blocks[i].moveBlock(this.direction);

            }
            return false;
 
        }
 
    }

    // checkIfReachedLeftWall(){

    //     if( (this.blocks[0].position.x - (g_canvasSize/30)) <= 0){
    //         this.setToStop();
    //         return true;
    //     }
    //     else{
    //         return false;
    //     }
    
    // }
 
 
    // buildRandomSnake() {
 
    //     var positions = new Array(this.length);
    //     for (var i = 0; i< this.length; i++) {
 
    //         var x = g_initialX + (g_distance * i);
    //         var y = g_initialY;
 
 
    //         positions[i] = new Position(x,y);
 
    //         //we are changing the color of the first block so we know where the head is
    //         if(i==0){
    //             this.blocks[i] = new Block(positions[i] , g_headColor);    
    //         }
    //         else{
    //             this.blocks[i] = new Block(positions[i] , g_blockColor);
    //         }
            
 
    //     }
 
    // }
 
 
    // paints all the blocks within this snake
    paint() {
 
        for(var i=0; i < this.blocks.length; i++){
            this.blocks[i].drawBlock();
        }
 
    }
 
}
 
class Target{
 
//attributes = size,position,color,shape
//behavior = draw,eaten
 
 
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
 
mySnake.grow();
mySnake.grow();
mySnake.grow();
 
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
    frameRate(7);


    
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
 
function draw(){
    
 //   console.log("Draw Function");

    background(57,104,64);
   // console.log("Background has been drawn");


    divideCanvas(); 
  


    mySnake.paint();
    mySnake.move();
 
    
    
}
 
// keyboard event 
function onkeypressed(event) {
 
    show(">>>" + event.key + "<<<");
 
 
 
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
 
 

