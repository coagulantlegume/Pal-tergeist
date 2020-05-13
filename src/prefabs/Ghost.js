// Ghost prefab
class Ghost extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    // TODO: Target selecting (mouse or clicked on object) and update movement toward target
    // TODO: Posessing: wait for overlap with target, possessing animation, pause ghost movement,
    // set play variable forevel with  current object/ghost being controlled.
    // TODO: variable for ghost power lsetter/getter/modifiers.
}