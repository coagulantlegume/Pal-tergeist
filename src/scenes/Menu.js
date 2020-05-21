// Main menu
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    create(){
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