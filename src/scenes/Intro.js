// Introduction cutscene sequence
class Intro extends Phaser.Scene {
    constructor() {
        super("introScene");
    }

    preload(){       
        // load assets
        this.load.image('tubTut', './assets/textures/tubHover.png');
        this.load.image('lightTut', './assets/textures/light_OFFHover.png');
        this.load.image('textboxTut1', './assets/textures/textboxTut1.png');
        this.load.image('textboxTut2', './assets/textures/textboxTut2.png');
        this.load.image('dialogueTut1', './assets/textures/textboxDialogue1.png');
        this.load.image('ghostTut', './assets/textures/ghost.png');
        this.load.image('controls', './assets/textures/textboxControls.png');
        this.load.image('kidTut', './assets/textures/kid.png');
        this.load.image('exclamation', './assets/textures/scaredEmote.png');

        // font load    
        this.load.bitmapFont('myfont', 'assets/font/font.png', 'assets/font/font.fnt');        
    }

    create(){
        console.log("intro");
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        // creates visual assets + tutorial title 
        var background = this.add.sprite(centerX, centerY, 'titleBackground');
        var tutorialTitle = this.add.sprite(centerX, centerY - 300, 'tutorialMenu');
        var tub = this.add.sprite(centerX - 580, centerY + 175, 'tubTut');
        var light = this.add.sprite(centerX - 350, centerY + 175, 'lightTut');
        var textboxTut1 = this.add.sprite(centerX - 510, centerY + 300, 'textboxTut1');
        var textboxTut2 = this.add.sprite(centerX + 580, centerY - 10, 'textboxTut2');
        var ghost = this.add.sprite(centerX - 380 , centerY - 15, 'ghostTut');
        var kid = this.add.sprite(centerX + 360 , centerY - 15, 'kidTut');
        var exclamation = this.add.sprite(centerX + 390, centerY - 70, 'exclamation');
        var dialogue = this.add.sprite(centerX - 580 , centerY - 70, 'dialogueTut1');
        var controls = this.add.sprite(centerX , centerY + 150, 'controls');

        // creates text assets
        this.shortLore = this.add.bitmapText(centerX, centerY - 220, 'myfont', 'A sudden gust of wind takes the balloon away from Pal as it flies into the attic of an abandoned manor!', 35).setOrigin(0.5);
        if(!played && fromCutscene){
            this.startText = this.add.bitmapText(centerX, centerY + 300, 'myfont', 'Press SPACE to Play', 40).setOrigin(0.5);
        }
        else{
            this.startText = this.add.bitmapText(centerX, centerY + 300, 'myfont', 'Press SPACE to return to the Menu', 40).setOrigin(0.5);
        }
           

       // this.add.text(centerX, centerY- textSpacer*2, 'Click on objects with a glow to interact with them.', menuConfig).setOrigin(0.5);
       // this.add.text(centerX, centerY - textSpacer, 'Blue glow = can be possessed. Orange glow = can scare with audio and/or visual', menuConfig).setOrigin(0.5);
       // this.add.text(centerX, centerY, "Possessed obj's can move/resize. Press 'Q' to toggle between. You start in move mode.", menuConfig).setOrigin(0.5);
       // this.add.text(centerX, centerY + textSpacer, 'Move: WASD. Resize: W(increase) and S(decrease)', menuConfig).setOrigin(0.5);
       // this.add.text(centerX, centerY + textSpacer*2, 'Click again on the screen to unpossess a possessed object.', menuConfig).setOrigin(0.5);
       // this.add.text(centerX, centerY + textSpacer*3, 'Press SPACE to start (in general use SPACE to change scene)', menuConfig).setOrigin(0.5);
    }

    // TODO: display introduction story animation
    update(){
        // PROGRAM SCENE DEBUGGING
        if (Phaser.Input.Keyboard.JustDown(keySpace)) {
            if(!played && fromCutscene){
                this.scene.start("playScene");
                fromCutscene = false;
            }
            else{
                this.scene.start("menuScene");
            }
        }
    }
}