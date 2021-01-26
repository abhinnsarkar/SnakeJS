import { gc } from './Globals.js';
import { Position } from './Position.js';
import { GAME_COLORS } from './Colors.js';
import { BLOCK_SIZE } from './game.js';
import { DIRECTIONS } from './KeysAndDirections.js';


export class Block {
 
    //attributes = size,position,color,shape,speed,direction
    //behavior = move up,move down, move right,move left,start,stop,draw
 
    // creates a block, given the row number, col number, and colour
    constructor(rowGrid, colGrid, color, curve) {
 
        // using the passed parameters

        this.row = rowGrid;
        this.col = colGrid;
 
        // using the global constants
        const BLOCK_SIZE = gc.CANVAS_SIZE/gc.NUM_OF_SECTIONS; // makes a block size based on the canvas size and number of sections --- proportional --- will change as canvas size and number of sections changes
        this.blockSize =  BLOCK_SIZE;
        this.blockColor =  color;
 
        this.curve = curve;
    }

    changeColor(color) {

        this.blockColor = color;

    }

    gridToPixel(rowGrid,colGrid){

        var col = colGrid - 1;
        var row = rowGrid - 1;
        var positionObject = new Position(col*BLOCK_SIZE , row*BLOCK_SIZE);

        return positionObject;

    }


    drawBlock(ctx){
 
        // noStroke();
        ctx.clearRect(0,0,ctx.width,ctx.height);
        ctx.fillStyle = this.blockColor;
        // fill(this.blockColor);
        
        var position = this.gridToPixel(this.row,this.col);
        
        // rect(position.x,position.y,this.blockSize,this.blockSize,this.curve);
        ctx.fillRect(position.x, position.y, BLOCK_SIZE, BLOCK_SIZE,this.curve);

    }
    
    setDirection(direction) {

        this.direction = direction;
    
    }
    
    //makes block move based on set/current direction
    moveBlock(){
 
        switch(this.direction){

            case DIRECTIONS.UP:

                this.row = this.row -1;

                break;
 
            case DIRECTIONS.DOWN:

                this.row = this.row + 1;

                break;

            case DIRECTIONS.LEFT:

                this.col = this.col - 1;

                break;
            
            case DIRECTIONS.RIGHT:

                this.col = this.col + 1;

        }
        
    }

    //this gives the block a new position
    newPos(newRow,newCol){

        this.row = newRow;
        this.col = newCol;

    }
 

}
