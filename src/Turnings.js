
export class Turnings{

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