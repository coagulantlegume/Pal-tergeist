// Main menu
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        //load title logo and background/foreground
        this.load.image('titleLogo', './assets/textures/PaltergeistLogo.png');
        this.load.image('titleBackground', './assets/textures/TitleMenuBackground.png');
        this.load.image('titleForeground', './assets/textures/TitleForeground.png');

        //load menu options
        this.load.image('playMenu', './assets/textures/PlayMenu.png');
        this.load.image('tutorialMenu', './assets/textures/TutorialMenu.png');
        this.load.image('creditsMenu', './assets/textures/CreditsMenu.png');

    }

    create(){
        // center alignments for canvas
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;

        //background/foreground and title
        var background = this.add.sprite(centerX, centerY, 'titleBackground');
        var foreground = this.add.sprite(centerX, centerY, 'titleForeground');
        var title = this.add.sprite(centerX, centerY - 250, 'titleLogo');

        //menu options
        var playMenu = this.add.sprite(centerX, centerY - 100, 'playMenu');
        var tutorialMenu = this.add.sprite(centerX, centerY, 'tutorialMenu');
        var creditsMenu = this.add.sprite(centerX, centerY + 100, 'creditsMenu');


        console.log("menu");
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(){
        // PROGRAM SCENE DEBUGGING
        if (Phaser.Input.Keyboard.JustDown(keySpace)) {
            this.scene.start("introScene");
        }
    }
}