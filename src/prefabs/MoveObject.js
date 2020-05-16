// MoveObject prefab, for objects that can scare child and cost ghost power to manipulate
class MoveObject extends ScareObject {
    constructor(scene, x, y, texture, powerGain, scareGain, powerLossRate, name) {
        super(scene, x, y, texture, powerGain, scareGain, name);

        this.params.powerLoss = powerLossRate;
        // add to scene and physics
        scene.add.existing(this);
        //scene.physics.add.existing(this);
    }

    makeActive() {
        // add to physics scene
        this.scene.physics.add.existing(this);

        // add level collision
        this.body.setBoundsRectangle(game.levelParams.levelBounds);
        this.setCollideWorldBounds(true);

        // set gravity
        this.setGravity(0,1000);

        // make interactable
        this.setInteractive().on('pointerdown', this.touchObj);
    }

    touchObj() {
        this.scene.ghost.target = this;
        this.scene.ghost.targetChanged = true;
    }

    possess() {
        // TODO: add effects of scare object (animation, sound, and scare/power manipulation)
        console.log("ooOOoo scary " + this.params.name);

        // TODO: replace with possession animation
        this.ghostHideTimer = this.scene.time.addEvent({
            delay: 50,
            callback: () => {this.scene.ghost.alpha -= .05},
            callbackScope: this.scene,
            repeat: 20,
        });

        // set possessing variable for ghost
        this.scene.ghost.isPossessing = true;
    }

    // TODO: custom control variables based on size
    // TODO: manipulation drain variables for moving, resizing, and
    // opening based on size.
    // TODO: update function applying drain values when manipulating
}