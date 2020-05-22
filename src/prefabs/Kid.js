// Kid prefab
class Kid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.setDepth(2);

        this.params = {
            walkAreaLBound: undefined,  // left (min) y value of walkable area
            walkAreaRBound: undefined,  // right (max) y value of walkable area
            direction: "right",         // direction kid is walking in
            isMoving: false,            // whether kid is currently walking or standing still
        }

        // cet center
        this.setOrigin(0.5, 0.5);

        // add walkable area debug rectangle
        this.walkAreaRect = this.scene.add.rectangle(this.scene,0,0,0,0,0xFACADE);
        this.walkAreaRect.alpha = 0.5;
        this.walkAreaRect.setOrigin(0, 0.5);
        this.walkAreaRect.setDepth(3);
        
        // add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // add level bounding box
        this.body.setBoundsRectangle(game.levelParams.levelBounds);
        this.setCollideWorldBounds(true);
    }

    update() {
        // calculate walkable area
        let currLevel = game.levelParams.renderedLevels[game.levelParams.currLevelIndex];
        this.params.walkAreaLBound = currLevel.params.x0 + currLevel.params.borderWidth; // left wall of level
        this.params.walkAreaRBound = this.params.walkAreaLBound + currLevel.background.width - 2 * currLevel.params.borderWidth; // right wall of level
        Phaser.Actions.Call(currLevel.moveGroup, (obj) => {
            if(obj.y + obj.scale * obj.height / 2 >= this.y - this.height / 2) { // on the correct y plane
                if(obj.x > this.params.walkAreaLBound && obj.x < this.x) { // closer than current left bound
                    this.params.walkAreaLBound = obj.x + (obj.width * obj.scale) / 2;
                }
                else if(obj.x < this.params.walkAreaRBound && obj.x > this.x) { // closer than current right bound
                    this.params.walkAreaRBound = obj.x - (obj.width * obj.scale) / 2;
                }
            }
        });

        // add safety buffer to walkable area
        this.params.walkAreaLBound += 5;
        this.params.walkAreaRBound -= 5;

        // draw debug walkable area rectangle
        this.walkAreaRect.setPosition(this.params.walkAreaLBound, this.y - this.height / 2);
        this.walkAreaRect.setSize((this.params.walkAreaRBound - this.params.walkAreaLBound), this.height);

        // test for exit condition
        if(!game.levelParams.changingLevel) {
            let exitLeft = currLevel.params.x0 + (currLevel.params.exit.x - currLevel.params.exit.width / 2);
            let exitRight = currLevel.params.x0 + (currLevel.params.exit.x + currLevel.params.exit.width / 2);
            if(exitLeft >= this.params.walkAreaLBound && exitLeft <= this.params.walkAreaRBound && 
               this.params.walkAreaRBound -exitLeft > this.width) {
                console.log("exit path");
            }
            else if(exitRight <= this.params.walkAreaRBound && exitRight >= this.params.walkAreaLBound &&
                    exitRight - this.params.walkAreaLBound > this.width) {
                console.log("exit path");
            }
        }
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