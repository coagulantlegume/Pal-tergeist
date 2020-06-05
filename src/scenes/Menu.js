// Main menu
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        // load bgm
        this.load.audio('bgmLoop', './assets/audio/PaltergeistBGMLoop.wav');

        //load title logo and background/foreground
        this.load.image('titleLogo', './assets/textures/PaltergeistLogo.png');
        this.load.image('titleBackground', './assets/textures/TitleMenuBackground.png');
        this.load.image('titleForeground', './assets/textures/TitleForeground.png');

        //load menu options
        this.load.image('playMenu', './assets/textures/PlayMenu.png');
        this.load.image('tutorialMenu', './assets/textures/TutorialMenu.png');
        this.load.image('creditsMenu', './assets/textures/CreditsMenu.png');

        // make the multi-use black box texture (From: https://github.com/nathanaltice/YasTween/blob/master/src/scenes/SonicTitle.js)
        let gfx = this.make.graphics().fillStyle(0x000000).fillRect(0,0,1,1);
        gfx.generateTexture('blackBox', 1, 1);
        gfx.destroy();
    }

    create(){
        //bgm loop
        if(game.music == undefined) {
            game.music = this.sound.add('bgmLoop', {
                loop: true,
                volume: 0.08
            });
            game.music.play();
        }

        // center alignments for canvas
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;

        //background/foreground and title
        var background = this.add.sprite(centerX, centerY, 'titleBackground');
        var foreground = this.add.sprite(centerX, centerY, 'titleForeground');
        var title = this.add.sprite(centerX, centerY - 250, 'titleLogo');

        //menu options
        var playMenu = this.add.sprite(centerX, centerY - 100, 'playMenu');
        var tutorialMenu = this.add.sprite(centerX, centerY + 50, 'tutorialMenu');
        var creditsMenu = this.add.sprite(centerX, centerY + 200, 'creditsMenu');

        playMenu.setInteractive({ useHandCursor: true });
        tutorialMenu.setInteractive({ useHandCursor: true });
        creditsMenu.setInteractive({ useHandCursor: true });

        console.log("menu");
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // detects when mouse pointer is over the options
        playMenu.on('pointerdown', () => { this.scene.start("playScene") });
        tutorialMenu.on('pointerdown', () => { this.scene.start("introScene") });
        creditsMenu.on('pointerdown', () => { this.scene.start("creditScene") });

        //title tween
        let titleTween = this.tweens.add({
            targets: title,
            alpha: {from: 0, to: 1, duration: 2000},
            alpha: {from: 1, to: 0.5, duration: 2000, delay: 2500, yoyo: true, repeat: 100},
            scale: {from: 0.1, to: 1, duration: 2000},
            ease: 'Sine.easeInOut', 
        });   
        
        //menu options tween
        let optionBob = this.tweens.add({
            targets: [playMenu, tutorialMenu, creditsMenu],
            y: '-=20',
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: 1000
        });
    }

    update(){
        // PROGRAM SCENE DEBUGGING
        if (Phaser.Input.Keyboard.JustDown(keySpace)) {
            this.scene.start("introScene");
        }
    }
}