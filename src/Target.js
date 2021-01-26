
import { gc } from './Globals.js';
import { Block } from './Block.js';
import { GAME_COLORS } from './Colors.js';

export class Target{
 
    //attributes = block
    //behavior = draw,eaten
     
        constructor(){
        
            var targetRow = this.getTargetPosition();
            var targetCol = this.getTargetPosition();
            
            this.block = new Block(targetRow,targetCol,GAME_COLORS.TARGET,gc.TARGET_CURVE);
            
        }
    
        //draws the target
        paint(ctx){
            
            this.block.drawBlock(ctx);
    
        }
    
        //gets a random position for the target between the first margin and second margin
        getTargetPosition(){
            
            var sectionMargin = Math.floor((gc.MARGIN/100) * gc.NUM_OF_SECTIONS); // "/100"
    
            var targetPosition = Math.floor(Math.random() * (gc.NUM_OF_SECTIONS -(2*sectionMargin)) ) + sectionMargin;
            
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