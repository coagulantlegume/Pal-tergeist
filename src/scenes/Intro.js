// Introduction cutscene sequence
class Intro extends Phaser.Scene {
    constructor() {
        super("introScene");
    }
    create(){
        console.log("intro");
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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