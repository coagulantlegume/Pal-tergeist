// Kid prefab
class Kid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    // TODO: variable for scare level with setter/getter/modifiers.
    // TODO: timer for cooldown of scare level.
    // TODO: scaredBy({Object}) function which calculates if child perceived
    // scare and modifies scare level.
    // TODO: runFrom({Object}, distance) function for when scare amount is
    // above a given threshhold, with distance -1 for running out of level
    // if level failed.
    // TODO: child wander timer with randomized time and distance.
    // TODO: target variable with setter/getter/modifiers, turns off wander
    // mechanic if target is set.
}