// ScareObject prefab, for any object that can scare child
class ScareObject extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, powerGain, scareGain) {
        super(scene, x, y, texture, 0);

        // parameters
        this.params = {
            power: powerGain,
            scare: scareGain,
        };

        // put in front of background layer
        this.setDepth(1);

        // add to scene and physics
        scene.add.existing(this);
        //scene.physics.add.existing(this);
    }

    // TODO: manipulation functions to be called when active object being controlled
    // TODO: every frame where manipulation is taking place, call this.scene.kid.scaredBy(this)
    // to check if affecting child
    // TODO: display controls, including manipulation controls and unpossess controls
}