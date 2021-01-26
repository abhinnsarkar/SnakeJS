import { playDeathSound, playSnakeSound } from './Sounds.js';
import { Turnings } from './Turnings.js';
import { Coordinate } from './Coordinate.js';
import { Block } from './Block.js';
import { GAME_COLORS } from './Colors.js';
import { TurnFound } from './TurnFound.js';
import { gc , gv } from './Globals.js';
import { onkeypressed } from './game.js';
import { DIRECTIONS } from './KeysAndDirections.js'

const CENTER_GRID = (gc.NUM_OF_SECTIONS + 1)/2; // finds center of grid to show snake starts

// import { gc } from './Globals.js';
const INITIAL_SNAKE_DIRECTION = DIRECTIONS.RIGHT;

export class Snake {
 
    //attributes = blocks,length
    //behavior = start,stop,eat,change direction, grow [it will grow the size of the snake]
 
    constructor() {
 
        // this.ctx = ctx; // this is the context of the canvas, which will be used to draw things

        this.blocks = new Array(0);
 
        this.createInitialDirection();
 
        this.createHead();
        this.isMoving = false;
        this.hardStop = false;
 
    }
 
    createInitialDirection(){
 
        this.turns = new Turnings();
        this.turns.createNewTurn(new Coordinate(0,0),INITIAL_SNAKE_DIRECTION);

    }
 
    createHead(){

        //this is the head block
        var headBlock = new Block(CENTER_GRID, CENTER_GRID,GAME_COLORS.SNAKE_HEAD,gc.SNAKE_CURVE);

        // var headBlock = new Block(CENTER_GRID, CENTER_GRID,gc.BLOCK_SIZE,gc.BLOCK_SIZE,gc.SNAKE_CURVE);
        headBlock.setDirection(this.turns.getLatestDirection());
        this.blocks.push(headBlock);
    
    }

    // returns true, if the user is asking the Snake to turn in the opposite direction
    checkOppositeDirection(newDirection) {
        
        var currentDirection = this.getHead().direction;

        switch (newDirection) {

            case DIRECTIONS.RIGHT:

                return (currentDirection == DIRECTIONS.LEFT);

                break; 

            case DIRECTIONS.LEFT:

                return (currentDirection == DIRECTIONS.RIGHT); 

                break;

            case DIRECTIONS.UP:

                return (currentDirection == DIRECTIONS.DOWN);

                break;

            case DIRECTIONS.DOWN:

                return (currentDirection == DIRECTIONS.UP);

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

            this.getTail().changeColor(GAME_COLORS.BODY);

        }

        var C = this.getTail().col;
        var R = this.getTail().row;
 
        switch (this.getTail().direction) {
 
            case DIRECTIONS.RIGHT:

                newC = C - 1;
                newR = R;
                
                break;
    
            case DIRECTIONS.LEFT:

                newC = C + 1;
                newR = R;
                
                break;
                
            case DIRECTIONS.UP:

                newR = R + 1;
                newC = C;

                break;
                
            case DIRECTIONS.DOWN:

                newR = R - 1;
                newC = C;

                break;
            
        }

        
        var newBlock = new Block(newR,newC,GAME_COLORS.SNAKE_TAIL,gc.SNAKE_CURVE);

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

            case (DIRECTIONS.RIGHT):

                return this.reachedTheRightWall(headOfSnake);
        
                break;

            case (DIRECTIONS.LEFT):

                return this.reachedTheLeftWall(headOfSnake);

                break;

            case (DIRECTIONS.UP):

                return this.reachedTheTopWall(headOfSnake);

                break;

            case (DIRECTIONS.DOWN):

                return this.reachedTheBottomWall(headOfSnake);

                break;

        }

    }

    //checks if the snake head has hit its own body
    eatingSelf(){

        var snakehead = this.getHead();

        var eatingSnake = false;

        for( var i = 1; i < this.blocks.length ; i++){

            if((snakehead.row == this.blocks[i].row) && (snakehead.col == this.blocks[i].col)){
            
                eatingSnake = true;
                // show("SNAKE HEAD >> " + snakehead.row + " , " + snakehead.col);

                // show("BODY >> " + i + " >> " + this.blocks[i].row + " , " + this.blocks[i].col);

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

            playSnakeSound();

            if (this.eatingSelf() /*|| this.reachedTheWall()*/) {
                
                // stopGameSoundTrack();
                playDeathSound();
                

                this.setToHardStop();

                gv.SNAKE_STATUS = "eating self";
                gv.GAME_STATUS = " ; GAME OVER!!!";

            }

            else {

                // if not reached the wall, then keep the snake moving, else stop
                if (!(this.reachedTheWall())){

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
    paint(ctx) {
 
        for(var i=0; i < this.blocks.length; i++){

            this.blocks[i].drawBlock(ctx);

        }
 
    }
    
}

export var mySnake = new Snake();
