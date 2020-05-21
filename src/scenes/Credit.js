// Credits sequence
class Credit extends Phaser.Scene {
    constructor() {
        super("creditScene");
    }
    create(){
        console.log("credit");
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // TODO: play credits
    update(){
        // PROGRAM SCENE DEBUGGING
        if (Phaser.Input.Keyboard.JustDown(keySpace)) {
            this.scene.start("menuScene");
        }
    }
}