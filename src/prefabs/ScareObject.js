// ScareObject prefab, for any object that can scare child
class ScareObject extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, powerGain, scareGain, name) {
        super(scene, x, y, texture, 0);

        // parameters
        this.params = {
            name: name,
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

        // make interactable
        this.setInteractive().on('pointerdown', this.touchObj);
    }

    makePassive() {
        // remove physics body
        this.body.destroy();
        
        // remove interactivity
        this.removeInteractive();
    }

    touchObj() {
        console.log("touched " + this.params.name);
    }

    // TODO: every frame where manipulation is taking place, call this.scene.kid.scaredBy(this)
    // to check if affecting child
}