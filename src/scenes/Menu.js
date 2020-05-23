// Main menu
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        this.load.image('titleLogo', './assets/textures/PaltergeistLogo.png');
    }

    create(){
        // center alignments for canvas
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;

        var title = this.add.sprite(centerX, centerY, 'titleLogo');
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