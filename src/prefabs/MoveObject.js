// MoveObject prefab, for objects that can scare child and cost ghost power to manipulate
class MoveObject extends ScareObject {
    constructor(scene, x, y, texture, scale, range, visual, auditory, powerGain, scareGain, powerLossRate, name, scaleMax, collisionBody) {
        super(scene, x, y, texture, scale, undefined, range, visual, auditory, powerGain, scareGain, name, null, null, null, null, collisionBody, false);
        this.params.powerLoss = powerLossRate;
        // add to scene
        scene.add.existing(this);

        // previous position tracker (to track if moving)
        this.prevPosY = this.body.position.y;

        // if user input given
        this.inputGiven = false;

        // set collision group and mask
        this.setCollisionCategory(this.scene.moveCollision);
        this.setCollidesWith([1, this.scene.kidCollision, this.scene.wallCollision, this.scene.scareCollision, this.scene.moveCollision]);

        // set density and friction
        this.setDensity(1);
        this.setMass(this.scale * this.width * this.height);
        this.body.frictionAir = 0.008;

        // if balloon, reverse gravity
        if(name === "balloon") {
            this.body.gravityScale.y = -2;
            this.body.centerOfMass.y = 0.1;
            this.body.frictionAir = 0.1;
        }

        // add collision with kid event
        this.body.setOnCollideWith(this.scene.kid.body, () => {
            this.bumpKid();
        });

        // possession force values
        this.horizontalForce = 110;

        // sfx
        this.possessSFX = scene.sound.add('possession');
        this.possessSFX.setVolume(0.1);
        this.toggleSFX = scene.sound.add('toggle');
        this.toggleSFX.setVolume(0.1);

        // posessesion mode (move/resize)
        this.mode = "move";
        this.scaleMax = scaleMax; // max scale value, min scale value = 1/scaleMax

        // move/resize UI
        this.initOffset = 9; // this might be temp. There's a bug where the after clicking on the object for the first time the toggle UI shifts down a bit
        this.resizeUI = scene.add.sprite(x-(this.width/2*this.scale),
                                         y-(this.height/2*this.scale)-this.initOffset, 
                                         'resizeToggle').setOrigin(0,1).setDepth(4).setAlpha(0);
                             
        this.moveUI = scene.add.sprite(x-(this.width/2*this.scale),
                                       y-(this.height/2*this.scale)-this.initOffset, 
                                       'moveToggle').setOrigin(0,1).setDepth(4).setAlpha(0);
    }
    
    update(keyToggle) {
        // constrain delta minimum framerate
        let delta = Math.max(game.loop.rawDelta, 20);

        // TODO: drain ghost power with when actions taken
        let moved = false; // used to see if we need subtract from paranormal bar
        let resized = false; // used to see if we need subtract from paranormal bar
        // set mass based on size
        this.setMass(this.scale * this.width * this.height);

        this.setStatic(false);

        // Set Toggle UI
        if("move" === this.mode){
            this.resizeUI.setAlpha(0);
            this.moveUI.setAlpha(1);
        }
        else if("resize" === this.mode){
            this.resizeUI.setAlpha(1);
            this.moveUI.setAlpha(0);
        }

        //switch modes only once the player releases the key after pressing it
        if(Phaser.Input.Keyboard.JustDown(keyToggle)){
            this.toggleSFX.play();
            //Change the possession mode
            if("move" === this.mode){
                this.mode = "resize";
            }
            else if("resize" === this.mode){
                this.mode = "move";
            }
        }

        // Left/Right Controls
        if("move" === this.mode && this.scene.ghost.paranormalStrengthCurr > 0){
            //this.body.allowGravity = false; //disable gravity so object can float
            if(keyRight.isDown){
                if(Math.abs(this.body.position.y - this.body.positionPrev.y) < 0.001) {// essentially on the ground
                    this.applyForce({x: this.horizontalForce * 2.5, y: 0});
                }
                else { // off of the ground (no friction)
                    this.applyForce({x: this.horizontalForce, y: 0});
                }
                moved = true;
            }

            else if(keyLeft.isDown){
                if(Math.abs(this.body.position.y - this.body.positionPrev.y) < 0.001) {// essentially on the ground
                    this.applyForce({x: -this.horizontalForce * 2.5, y: 0});
                }
                else {
                    this.applyForce({x: -this.horizontalForce, y: 0});
                }
                moved = true;
            }
        }

        // Movement amount based on how big the object is.
        // Resizing up and down from 1 / scaleMax to scaleMax
        if(keyDown.isDown && this.scene.ghost.paranormalStrengthCurr > 0){
            if("move" === this.mode){
                this.applyForce({x: 0,y: 300});
                moved = true;
            }
            else if("resize" === this.mode){
                if(this.scale > 1 / this.scaleMax){
                    this.setScale(this.scale - .01);
                    resized = true;
                }
            }
        }

        if(keyUp.isDown && this.scene.ghost.paranormalStrengthCurr > 0){
            if("move" === this.mode){
                let verticalForce = 32 * Math.pow(1.9, this.scale + 2);
                this.applyForce({x: 0,y: -verticalForce});
                moved = true; 
            }
            else if("resize" === this.mode){
                 // only increase to scaleMax value
                 if(this.scale < this.scaleMax){
                    this.setScale(this.scale + .01);
                    resized = true;
                }
            }
        }


        // if moved or resized decrease paranormal bar
        if(moved){
            this.scene.ghost.paranormalStrengthCurr -= 0.2; 
        }
        if(resized){
            this.scene.ghost.paranormalStrengthCurr -= 0.2; 
        }

        // min cap the paranormalStrength bar to 0
        if(this.scene.ghost.paranormalStrengthCurr < 0){
            this.scene.ghost.paranormalStrengthCurr = 0;
        }
        
        // set position of the toggle UI
        this.resizeUI.setPosition(this.x-(this.width/2*this.scale),
                                  this.y-(this.height/2*this.scale));
        this.moveUI.setPosition(this.x-(this.width/2*this.scale),
                                  this.y-(this.height/2*this.scale));
        
        // update kid's scare effect if object is moving
        if(Math.floor(Math.abs(this.body.position.y - this.prevPosY) + 0.8) != 0 || Math.floor(Math.abs(this.body.velocity.x)) != 0) {
            let typeMultiplier = ("move" === this.mode) ? 0.25:0.5; // multiplier based on type of manipulation (1 for move, 1.5 for scale)
            this.scene.kid.scaredBy(this, this.params.scare * typeMultiplier,  this.params.power);
        }
        this.prevPosY = this.body.position.y;

        this.inputGiven = moved || resized;
    }

    makeActive() {
        // make dynamic (render physics)
        this.setStatic(false);

        // make interactable
        this.setInteractive().on('pointerdown', this.touchObj).on('pointerover', this.hoverObj).on('pointerout', this.unhoverObj);;

        // set friction
        this.body.friction = 10;
    }

    touchObj() {
        // extra measure to clear toggle UI when clicking on scareObject after possessing an object
        //last condition checks if the function even exists
        if(this.scene.ghost.isPossessing && typeof this.scene.ghost.target.makeToggleInvis() == 'function'){
            this.scene.ghost.target.makeToggleInvis();
        }
        this.scene.ghost.target = this;
        this.scene.ghost.targetChanged = true;
    }

    hoverObj(){
        this.setTexture(this.params.name+'Hover');
    }

    unhoverObj(){
        this.setTexture(this.params.name);
    }

    possess() {
        //console.log("ooOOoo possess " + this.params.name);
        //sfx
        this.possessSFX.play();

        // reset mode
        this.mode = "move"

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

    makeToggleInvis(){
        this.resizeUI.setAlpha(0);
        this.moveUI.setAlpha(0);
    }

    // for when object bumps into kid
    bumpKid() {
        if(this.params.name === "balloon") {
            this.scene.endGame();
        }
        else {
            this.scene.kid.params.scareLevelCurr = Math.min(this.scene.kid.params.scareLevelCurr + 2, this.scene.kid.params.scareLevelMax);
            if(this.scene.kid.params.scareLevelCurr >= this.scene.kid.params.scareLevelMax) {
                game.levelParams.currLevel.reset();
            }
        }
    }
}