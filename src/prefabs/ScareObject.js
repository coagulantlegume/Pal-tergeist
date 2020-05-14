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

        // add to scene
        scene.add.existing(this);
    }

    makeActive() {
        // add to physics scene (for overlap)
        this.scene.physics.add.existing(this);
    }

    makePassive() {
        // no longer update physics body, save processing power
        this.body.destroy();
    }

    // TODO: every frame where manipulation is taking place, call this.scene.kid.scaredBy(this)
    // to check if affecting child
    // TODO: display controls, including manipulation controls and unpossess controls
}