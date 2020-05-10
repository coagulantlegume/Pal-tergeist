// ScareObj prefab, for any object that can scare child
class scareObj extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    // TODO: manipulation functions to be called when active object being controlled
    // TODO: every frame where manipulation is taking place, call this.scene.kid.scaredBy(this)
    // to check if affecting child
}