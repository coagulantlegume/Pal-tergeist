// Introduction cutscene sequence
class Intro extends Phaser.Scene {
    constructor() {
        super("introScene");
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

        this.add.text(centerX, centerY - textSpacer*3, 'Paltergeist', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY- textSpacer*2, 'Click on objects with a glow to interact with them.', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY - textSpacer, 'Blue glow = can be possessed. Orange glow = can scare with audio and/or visual', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, "Possessed obj's can move/resize. Press 'Q' to toggle between. You start in move mode.", menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer, 'Move: WASD. Resize: A(increase) and D(decrease)', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer*2, 'Click again on the screen to unpossess a possessed object.', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer*3, 'Press SPACE to start (in general use SPACE to change scene)', menuConfig).setOrigin(0.5);
    }

    // TODO: display introduction story animation
    // TODO: change scenes to play
    update(){
        // PROGRAM SCENE DEBUGGING
        if (Phaser.Input.Keyboard.JustDown(keySpace)) {
            this.scene.start("playScene");
        }
    }
}