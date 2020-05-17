// Outro/ending cutscene sequence
class Outro extends Phaser.Scene {
    constructor() {
        super("outroScene");
    }
    create(){
        console.log("outro");
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }


    // TODO: display ending story animation
    // TODO: change scenes to credits
    update(){
        // PROGRAM SCENE DEBUGGING
        if (Phaser.Input.Keyboard.JustDown(keySpace)) {
            this.scene.start("creditScene");
        }
    }
}