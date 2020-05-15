// Ghost prefab
class Ghost extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.setDepth(2);

        this.isPossessing = false;
        this.target = game.input.mousePointer;
        this.speed = 1;

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
        // change target format if item to possess
        let targetPos = this.target;
        if(this.target !== game.input.mousePointer) {
            targetPos = {position: {x: this.target.x, y: this.target.y}};
        }

        // follow mouse if not currently possessing object
        if(!this.isPossessing && ((typeof this.shiftTimer === 'undefined') || this.shiftTimer.getOverallProgress() == 1)) {
            let direction = this.getCenter().subtract(targetPos.position).scale(this.speed);
            this.setVelocity(-direction.x, -direction.y);
        }
        else {
            this.body.velocity.x *= .9;
            this.body.velocity.y *= .9;
        }

        // if close to target object to interact with, interact
        if(this.target !== game.input.mousePointer) {
            // if within 8 pixels of object to interact with
            if(Math.abs(this.x - targetPos.position.x) < 50 && Math.abs(this.y - targetPos.position.y) < 50) {
                this.target.possess();
            }
        }
    }

    // TODO: Posessing: wait for overlap with target, possessing animation, pause ghost movement,
    // set play variable forevel with  current object/ghost being controlled.
    // TODO: variable for ghost power setter/getter/modifiers.
}