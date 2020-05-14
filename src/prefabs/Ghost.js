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

        // add level bounding box
        this.body.setBoundsRectangle(game.levelParams.levelBounds);
        this.setCollideWorldBounds(true);

        // set overlap detection
        this.body.onOverlap = true;
    }

    update() {
        // follow mouse if not currently possessing object
        if(!this.isPossessing && ((typeof this.shiftTimer === 'undefined') || this.shiftTimer.getOverallProgress() == 1)) {
            let direction = this.getCenter().subtract(this.target.position).scale(this.speed);
            this.setVelocity(-direction.x, -direction.y);
        }
        else {
            this.body.velocity.x *= .9;
            this.body.velocity.y *= .9;
        }

    }

    // TODO: Target selecting (mouse or clicked on object) and update movement toward target
    // TODO: Posessing: wait for overlap with target, possessing animation, pause ghost movement,
    // set play variable forevel with  current object/ghost being controlled.
    // TODO: variable for ghost power lsetter/getter/modifiers.
}