// Main menu
class Cutscene extends Phaser.Scene {
    constructor() {
        super("cutsceneScene");
    }

    preload(){
        //load frames
        this.load.image('intro_f0', './assets/textures/introSlides/intro_f0.png');
        this.load.image('intro_f1', './assets/textures/introSlides/intro_f1.png');
        this.load.image('intro_f2', './assets/textures/introSlides/intro_f2.png');
        this.load.image('intro_f3', './assets/textures/introSlides/intro_f3.png');
        this.load.image('intro_f4', './assets/textures/introSlides/intro_f4.png');
        this.load.image('intro_f5', './assets/textures/introSlides/intro_f5.png');
        this.load.image('intro_f6', './assets/textures/introSlides/intro_f6.png');
        this.load.image('intro_f7', './assets/textures/introSlides/intro_f7.png');
    }

    create(){
        // center alignments for canvas
        this.centerX = game.config.width/2;
        this.centerY = game.config.height/2;

        //place frames
        this.animationFrames = [];
        for(let frameNum = 0; frameNum < 8; frameNum++){
            this.animationFrames[frameNum] = this.add.sprite(this.centerX, this.centerY, 'intro_f'+frameNum);
            this.animationFrames[frameNum].alpha = 0;
        }

        this.pictureA;
        this.pictureB;
        this.timer;
        this.current = 0;
        
        this.pictureA = this.animationFrames[0];
        this.pictureA.setAlpha(1);
        this.pictureB = this.animationFrames[1];

        this.timer = this.time.addEvent({
            delay: 3000,
            callback: this.fadePictures(),
            callbackScope: this,
            repeat: 0,
        });
    
    }

    fadePictures() {
        let fade_duration = 1200;
        this.tweens.add({
            delay: 0,
            targets: this.pictureA,
            alpha: 0,
            ease: 'Linear',
            duration: fade_duration,
            repeat: 0,
            yoyo: false,
        });
            
        this.tweens.add({
            delay: 0,
            targets: this.pictureB,
            alpha: 1,
            ease: 'Linear',
            duration: fade_duration,
            repeat: 0,
            yoyo: false,
            onComplete: () => {if(this.current < 8){this.changePicture()}},
        });
    }
    
    changePicture() {
        this.current++;
        if (this.current < 7){
            this.pictureA = this.animationFrames[this.current]
            this.pictureB = this.animationFrames[this.current+1]
        }
        else{
            fromCutscene = true;
            this.scene.start("introScene");
        }
        //  And set a new TimerEvent to occur after 3 seconds
        this.timer = this.time.addEvent({
            delay: 3000,
            callback: this.fadePictures(),
            callbackScope: this,
            repeat: 0,
        });
    }
}