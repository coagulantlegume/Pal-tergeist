// Ghost prefab
class Ghost extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.setDepth(2);

        this.isPossessing = false;
        this.target = game.input.mousePointer;
        this.targetChanged = false;
        this.speed = 300;
        this.paranormalStrengthMax = 100;
        this.paranormalStrengthCurr = 50;

        this.unpossessSFX = scene.sound.add('unpossession');
        this.unpossessSFX.setVolume(0.5);

        // add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // add level bounding box
        this.body.setBoundsRectangle(game.levelParams.levelBounds);
        this.setCollideWorldBounds(true);

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

    update() {
        // change target format if item to possess
        let targetPos = this.target;
        if(this.target !== game.input.mousePointer) {
            targetPos = {position: {x: this.target.x, y: this.target.y}};
        }

        // follow mouse target (mouse or object to possess/interact with)
        if(!game.levelParams.changingLevel) {
            let direction = this.getCenter().subtract(targetPos.position).normalize(); // direction traveling
            let distance = this.getCenter().subtract(targetPos.position).length();
            let currSpeed = this.body.velocity.length();

            let lerpSpeed;
            if(distance > currSpeed) { // if more than 50 pixels away (speeding up or maintaining speed)
                lerpSpeed = Phaser.Math.Interpolation.SmootherStep(0.2, currSpeed, this.speed);
            }
            else {
                lerpSpeed = distance;
            }

            this.body.velocity = direction.scale(-lerpSpeed);
        }
        else { // changing levels
            this.body.velocity.scale(0.95);
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
        // set toggle UI of object to invisible 
        // (only works when you don't click on a scare object to exit)
        // code for handling when you do is in touchObj() of scareObject.js
        this.target.resizeUI.setAlpha(0);
        this.target.moveUI.setAlpha(0);

        this.target = game.input.mousePointer;
    }

    // TODO: add possession/unpossession animations
    // TODO: variable for ghost power setter/getter/modifiers.
}