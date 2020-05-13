// Ghost prefab
class Ghost extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.setDepth(2);

        this.isPossessing = false;
        this.target = game.input.mousePointer;
        this.speed = 3;

        // add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // set overlap detection
        this.body.onOverlap = true;
    }

    update() {
        // follow mouse if not currently possessing object
        if(!this.isPossessing) {
            //let lerpedDirection = direction.lerp(this.body.velocity, 0.2); // Set 0.2 to 0.99 to get very smooth movement

            let direction = this.getCenter().subtract(this.target.position);
            Phaser.Math.Interpolation.SmootherStep(1, this.body.velocity, direction)
            direction.scale(this.speed);
            this.setVelocity(-direction.x, -direction.y);
        }

    }

    // TODO: Target selecting (mouse or clicked on object) and update movement toward target
    // TODO: Posessing: wait for overlap with target, possessing animation, pause ghost movement,
    // set play variable forevel with  current object/ghost being controlled.
    // TODO: variable for ghost power lsetter/getter/modifiers.
}