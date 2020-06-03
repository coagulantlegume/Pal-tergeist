// Credits sequence
class Credit extends Phaser.Scene {
    constructor() {
        super("creditScene");
    }

    preload(){

        // background title load
        this.load.image('titleBackground', './assets/textures/TitleMenuBackground.png');
        this.load.image('titleForeground', './assets/textures/TitleForeground.png');
        this.load.image('creditsMenu', './assets/textures/CreditsMenu.png');

        // font load    
        this.load.bitmapFont('myfont', 'assets/font/font.png', 'assets/font/font.fnt');
    }

    create(){
        console.log("credit");
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // center alignments for canvas
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        
        //background/foreground and title
        var background = this.add.sprite(centerX, centerY, 'titleBackground');
        var foreground = this.add.sprite(centerX, centerY, 'titleForeground');
        var creditTitle = this.add.sprite(centerX, centerY - 300, 'creditsMenu');

        // credits
        this.alecCredit = this.add.bitmapText(centerX - 700, centerY - 200, 'myfont', 'Alec Wolf: main programmer, clutch programming wizard, master of physics management', 30).setOrigin(0);
        this.danCredit = this.add.bitmapText(centerX - 700, centerY - 100, 'myfont', 'Daniel Liao: artist, programming, UI, level design', 30).setOrigin(0);
        this.nateCredit = this.add.bitmapText(centerX - 700, centerY, 'myfont', 'Nathan Huynh: audio producer, title/credits, programming, UI', 30).setOrigin(0);

        this.spaceExit = this.add.bitmapText(centerX, centerY + 200, 'myfont', 'Press Space to continue', 30).setOrigin(0.5);

        //const names = this.add.text(100, 100, 'Alec Wolf, Daniel Liao, Nathan Huynh', { fill: '#0f0' })
    }

    // TODO: play credits
    update(){
        // PROGRAM SCENE DEBUGGING
        if (Phaser.Input.Keyboard.JustDown(keySpace)) {
            this.scene.start("menuScene");
        }
    }
}