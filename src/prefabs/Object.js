// Object prefab, for objects that can scare child and cost ghost power to manipulate
class Object extends scareObj {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    // TODO: custom control variables based on size
    // TODO: manipulation drain variables for moving, resizing, and
    // opening based on size.
    // TODO: display for controls, including controls to stop posession
    // TODO: update function applying drain values when manipulating
}