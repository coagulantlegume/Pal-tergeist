// Credits sequence
class Credit extends Phaser.Scene {
    constructor() {
        super("creditScene");
    }
    create(){
        console.log("credit");
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        const names = this.add.text(100, 100, 'Alec Wolf, Daniel Liao, Nathan Huynh', { fill: '#0f0' })
    }

    // TODO: play credits
    update(){
        // PROGRAM SCENE DEBUGGING
        if (Phaser.Input.Keyboard.JustDown(keySpace)) {
            this.scene.start("menuScene");
        }
    }
}