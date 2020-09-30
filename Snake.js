// global variables go here //

var g_canvasSize = 600;

const g_initialX = g_canvasSize/2;
const g_initialY = g_canvasSize/2;
const g_blockSize = g_canvasSize/40;
const g_blockColor = 10;
const g_headColor = 100;

const directions = {  // this is an example of enumeration

    RIGHT: "right",
    LEFT:"left",
    UP:"up",
    DOWN:"down"
}

const snakecolors = {

    HEAD: 100,
    BODY:10
}

// const RIGHT = "0";
// const LEFT = "1";
// const UP = "2";
// const DOWN = "3";

const g_distance = 15;

class Block {

    //attributes = size,position,color,shape,speed,direction
    //behavior = move up,move down, move right,move left,start,stop,draw

    // creates a block, given only the position
    constructor(blockPosition,color) {

        // using the passed parameters
        this.position = blockPosition;   

        // using the global constants
        this.blockSize =  g_blockSize;
        this.blockColor =  color;

    }

    drawBlock(){

        noStroke();
        fill(this.blockColor);
        rect(this.position.x,this.position.y,this.blockSize,this.blockSize,5);

    }

    moveBlock(direction){

        switch(direction){
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

        this.direction = directions.RIGHT;

        this.blocks.push(new Block(new Position(g_initialX, g_initialY),snakecolors.HEAD));

        this.isMoving = false;

    }

    // this will grow the size of the snake by 1
    grow() {

        // check which direction the snake is going in
        // if the snake is going to the right, the new block should be added to the left

        // find the last block,
        // find the x and y coordinate of the last block
        // reduce x by block size for the new block

        var newX = this.blocks[this.blocks.length - 1].position.x;
        var newY = this.blocks[this.blocks.length - 1].position.y;

        switch (this.direction) {

            case directions.RIGHT:
                newX = newX - g_blockSize
            case directions.LEFT:
                //
            case directions.UP:
                //
            case directions.DOWN:
                //
            
        }

        var newBlock = new Block(new Position(newX, newY),snakecolors.BODY);

        this.blocks.push(newBlock);

    }

    move(){

        //this will start moving the snake

        if(this.checkIfReachedRightWall()){
            console.log("reached");
        }
        else{
            console.log("has not reached");
            this.isMoving = true;
        

        for(var i=0; i < this.blocks.length;i++){

            this.blocks[i].moveBlock(this.direction);

        }

        } 

    }

    checkIfReachedRightWall(){

        var headBlock = this.blocks[0];

        console.log("inside check if reached")
        console.log(headBlock.position.x);
        
        if( (headBlock.position.x + ( g_canvasSize / 30 ) ) >= g_canvasSize){

            return true;
            
        }

        else{

            return false;

        }

    }

    stop(){

    }

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


    draw() {

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


function setup(){

    createCanvas(g_canvasSize,g_canvasSize);

    
    // mySnake.buildRandomSnake();


    // mySnake.draw();
    // mySnake.move();

    // mySnake.draw();
    // mySnake.move();

    // mySnake.draw();
    // mySnake.move();

    // mySnake.draw();
    // mySnake.move();

    // mySnake.draw();
    // mySnake.move();

    // mySnake.draw();
    // mySnake.move();

    // mySnake.draw();
    // mySnake.move();
}

function draw(){
    

    background(57,104,64);

    mySnake.draw();
    mySnake.move();
    
    
}

