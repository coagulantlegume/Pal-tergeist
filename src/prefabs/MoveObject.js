// MoveObject prefab, for objects that can scare child and cost ghost power to manipulate
class MoveObject extends ScareObject {
    constructor(scene, x, y, texture, powerGain, scareGain, powerLossRate) {
        super(scene, x, y, texture, powerGain, scareGain);

        this.params.powerLoss = powerLossRate;
        // add to scene and physics
        scene.add.existing(this);
        //scene.physics.add.existing(this);
    }

    // TODO: custom control variables based on size
    // TODO: manipulation drain variables for moving, resizing, and
    // opening based on size.
    // TODO: update function applying drain values when manipulating
}