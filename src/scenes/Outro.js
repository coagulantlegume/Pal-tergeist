// Outro/ending cutscene sequence
class Outro extends Phaser.Scene {
    constructor() {
        super("outroScene");
    }

    preload(){
        this.load.image('outro', './assets/textures/outro.png');
    }

    create(){
        console.log("outro");
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.bg = this.add.image(game.config.width/2, game.config.height/2, 'outro');
        this.finished = false;

        // fade in from opening
        this.blackScreen = this.add.image(0, 0, 'blackBox').setScale(game.config.width, game.config.height).setDepth(4).setOrigin(0,0);
        this.tweens.add({
            delay: 0,
            targets: this.blackScreen,
            alpha: 0,
            ease: 'Linear',
            duration: 2500,
            repeat: 0,
            yoyo: false,
        });

        this.tweens.add({
            delay: 4500,
            targets: this.blackScreen,
            alpha: 1,
            ease: 'Linear',
            duration: 2500,
            repeat: 0,
            yoyo: false,
            onComplete: () => {this.finished = true;} 
        });


    }


    // TODO: display ending story animation
    update(){
        // PROGRAM SCENE DEBUGGING
        if (Phaser.Input.Keyboard.JustDown(keySpace) || this.finished) {
            this.scene.start("creditScene");
        }
    }
}