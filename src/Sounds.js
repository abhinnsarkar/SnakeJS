function sound(src) {

    this.sound = document.createElement("audio");

    this.sound.src = src;

    this.sound.setAttribute("preload", "auto");

    this.sound.setAttribute("controls", "none");

    this.sound.style.display = "none";

    document.body.appendChild(this.sound);

    this.play = function(){

        this.sound.play();

    }

    this.stop = function(){

        this.sound.pause();

    }    

}

export function playEatingTargetSound(){

    eatingTargetSound.play();

}

export function playSnakeSound(){

    snakeSound.play();

}

export function playDeathSound(){

    deathSound.play();

}

export function playGameSoundTrack(){

    gameSoundTrack.play();
    
}

var eatingTargetSound = new sound("eatingTargetSound.mp3");
var snakeSound = new sound("snakeSound.mp3");
var deathSound = new sound("deathSound.mp3");
var gameSoundTrack = new sound("gameSoundTrack.mp3");
