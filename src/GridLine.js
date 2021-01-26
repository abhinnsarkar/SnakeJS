import { gc , gv } from './Globals.js';

export class GridLine{

    constructor(color,width,startX,startY,endX,endY){

        this.color = color;
        this.width = width;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;

    }

    draw(ctx){
    
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;

        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX,this.endY);
        ctx.stroke();

    }

}

