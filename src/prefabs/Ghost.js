// Ghost prefab
class Ghost extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene.matter.world, x, y, texture, frame);

        this.setDepth(2);

        this.isPossessing = false;
        this.target = game.input.mousePointer;
        this.targetChanged = false;
        this.maxSpeed = 100;
        this.paranormalStrengthMax = 100;
        this.paranormalStrengthCurr = 50;

        this.unpossessSFX = scene.sound.add('unpossession');
        this.unpossessSFX.setVolume(0.1);

        // add to scene
        scene.add.existing(this);

        // set collision group and mask (ghost does not collide with anything, so no mask needed)
        this.setCollisionCategory(this.scene.ghostCollision);
        this.setCollidesWith([1, this.scene.wallCollision]);

        // don't allow rotation
        this.setFixedRotation();

        // add level bounding box
        this.setIgnoreGravity(true);

        // set overlap detection
        this.body.onOverlap = true;

        // setup unpossession pointerdown touch event
        this.scene.input.on('pointerdown', (pointer, currentlyOver) => {
            if(this.isPossessing){
                let objectInStack = false;
                Phaser.Actions.Call(currentlyOver, (obj) => {
                    if(obj === this.target && this.targetChanged) { // if found target, but target changed (moving between objects)
                        objectInStack = false;
                        this.targetChanged = false;
                        return;
                    }
                    else if(obj === this.target) {
                        objectInStack = true;
                        return;
                    }
                });
            
                // if clicked not on currently possessed object
                if(!objectInStack) {
                    this.scene.ghost.unpossess();
                }
            }
        });
    }

    update(delta) {
        // constrain delta minimum framerate
        delta = Math.min(delta, 20);

        // change target format if item to possess
        let targetPos = this.target;
        if(this.target !== game.input.mousePointer) {
            targetPos = {position: {x: this.target.x, y: this.target.y}};
        }

        // follow mouse target (mouse or object to possess/interact with)
        if(!game.levelParams.changingLevel) {
            let direction = this.getCenter().subtract(targetPos.position).normalize(); // direction traveling
            let distance = this.getCenter().subtract(targetPos.position).length();

            // update position, if not already at target
            if(distance > 0.5) {

                let newVelocity = {
                    x: Phaser.Math.Interpolation.SmootherStep(0.2, this.body.velocity.x, (targetPos.position.x - this.x) * 0.25), 
                    y: Phaser.Math.Interpolation.SmootherStep(0.2, this.body.velocity.y, (targetPos.position.y - this.y) * 0.25)
                };
                
                // if already at max speed, ignore new speed (broken because for some reason can't use length on vector2?)
                // if(this.body.velocity.length() > this.maxSpeed) {
                //    newVelocity = direction.scale(this.maxSpeed);
                // }

                newVelocity.x *= delta / 30;
                newVelocity.y *= delta / 30;
                this.setVelocity(newVelocity.x, newVelocity.y);
            }
        }
        else { // changing levels
            this.target = game.input.mousePointer;
        }

        // if close to target object to interact with, interact
        if(!this.isPossessing && this.target !== game.input.mousePointer) {
            // if within 60 pixels of object to interact with TODO: maybe use aabb instead
            if(Math.abs(this.x - targetPos.position.x) < 60 && Math.abs(this.y - targetPos.position.y) < 60) {
                this.target.possess();
            }
        }
    }

    unpossess() {
        this.ghostHideTimer = this.scene.time.addEvent({
            delay: 50,
            callback: () => {this.scene.ghost.alpha += .05},
            callbackScope: this,
            repeat: 20,
        });

        //sfx
        this.unpossessSFX.play();

        this.isPossessing = false;

        // set toggle UI of object to invisible if the function for it exists for the target
        // (only works when you don't click on a scare object to exit)
        // code for handling when you do is in touchObj() of scareObject.js
        //console.log(this.target);
        if(typeof this.target.makeToggleInvis() !== "undefined" || typeof this.target.makeToggleInvis() === "function")
            this.target.makeToggleInvis(); //this will sometimes cause errors but doesn't break the game

        this.target = game.input.mousePointer;
    }

    // TODO: add possession/unpossession animations
    // TODO: variable for ghost power setter/getter/modifiers.
}