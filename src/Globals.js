export const gc = {

    MAX_SPEED : 1000,

    
    // directions : {  // this is an example of enumeration
 
    //     RIGHT: "right",
    //     LEFT:"left",
    //     UP:"up",
    //     DOWN:"down"
    
    // },
     
    // SNAKE_COLORS : {
     
    //     HEAD: 10,
    //     BODY:100,
    //     TARGET:200,
    //     TAIL:50
    
    // },
     
    // FRAME_SPEED : {  // this is an example of enumeration
     
    //     VERY_SLOW: 1,
    //     SLOW:3,
    //     MEDIUM:5,
    //     FAST:7,
    //     VERY_FAST:20
    
    // },
    
    // FRAME_RATE : this.FRAME_SPEED.FAST, // higher is faster
    
    
    // MODE : {
    
    //     VERY_EASY : FRAME_SPEED.VERY_SLOW,
    //     EASY : FRAME_SPEED.EASY,
    //     NORMAL : FRAME_SPEED.MEDIUM,
    //     HARD : FRAME_SPEED.FAST,
    //     VERY_HARD : FRAME_SPEED.VERY_FAST
    
    // },
    
    
    
    // CANVAS_SIZE : 800,
    CANVAS_SIZE : 0.33*window.innerWidth,
    
    //Number Of Sections has to be odd because otherwise, snake head will not be able to start in middle
    NUM_OF_SECTIONS : 21,
    
    BODY_SIZE : 4, // controls the initial size of the snake
    
    MARGIN : 10, //enter the margin in percentage
    
    
    
    // BLOCK_COLOR : 10,
    // HEAD_COLOR : 100,
    
    // ARROW_DOWN : "ArrowDown",
    // ARROW_UP : "ArrowUp",
    // ARROW_RIGHT : "ArrowRight",
    // ARROW_LEFT : "ArrowLeft",
    // SPACE_KEY : " ",
    
    SNAKE_CURVE : 20,
    TARGET_CURVE : 50,
    


}

export var gv = {

    TARGET_COLLISION_COUNT  : 0,
    SNAKE_STATUS : "fine", // if everything is good, then status == fine else state problem
    GAME_STATUS : " ", // if there is an error, such as dying , print GAME OVER
    
}