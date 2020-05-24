// MoveObject prefab, for objects that can scare child and cost ghost power to manipulate
class MoveObject extends ScareObject {
    constructor(scene, x, y, texture, scale, range, visual, auditory, powerGain, scareGain, powerLossRate, name, scaleMax) {
        super(scene, x, y, texture, scale, range, visual, auditory, powerGain, scareGain, name, null, null);
        this.params.powerLoss = powerLossRate;
        // add to scene
        scene.add.existing(this);

        // previous position tracker (to track if moving)
        this.prevPosY = this.body.position.y;

        // set collision group and mask
        this.setCollisionGroup(this.scene.moveCollision);
        this.setCollidesWith([this.scene.kidCollision, this.scene.wallCollision]);

        // set density and friction
        this.setDensity(1);
        this.setMass(this.scale * this.width * this.height);
        this.body.frictionAir = 0.008;

        // sfx
        this.possessSFX = scene.sound.add('possession');
        this.possessSFX.setVolume(0.5);
        this.toggleSFX = scene.sound.add('toggle');
        this.toggleSFX.setVolume(0.5);

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
        // TODO: drain ghost power with when actions taken
        // set mass based on size
        this.setMass(this.scale * this.width * this.height);

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
            console.log(this.mode);
        }

        // Movement amount based on how big the object is.
        // Resizing up and down from 1 / scaleMax to scaleMax
        if(keyRight.isDown){
            if("move" === this.mode){
                this.applyForce({x: 200,y: 0});
            }
            else if("resize" === this.mode){
                // only increase to scaleMax value
                if(this.scale < this.scaleMax){
                    this.setScale(this.scale + .01);
                }
            }
        }
        else if(keyLeft.isDown){
            if("move" === this.mode){
                this.applyForce({x: -200,y: 0});
            }
            else if("resize" === this.mode){
                if(this.scale > 1 / this.scaleMax){
                    this.setScale(this.scale - .01);
                }
            }
        }

        // UP/DOWN Controls
        if("move" === this.mode){
            //this.body.allowGravity = false; //disable gravity so object can float
            if(keyUp.isDown){
                this.applyForce({x: 0,y: -220});
            }
            else if(keyDown.isDown){
                this.applyForce({x: 0,y: 220});
            }
        }

        // set position of the toggle UI
        this.resizeUI.setPosition(this.x-(this.width/2*this.scale),
                                  this.y-(this.height/2*this.scale));
        this.moveUI.setPosition(this.x-(this.width/2*this.scale),
                                  this.y-(this.height/2*this.scale));
        
        // update kid's scare effect if object is moving
        if(Math.floor(Math.abs(this.body.position.y - this.prevPosY) + 0.8) != 0 || Math.floor(Math.abs(this.body.velocity.x)) != 0) {
            let typeMultiplier = ("move" === this.mode) ? 1:1.5; // multiplier based on type of manipulation (1 for move, 1.5 for scale)
            this.scene.kid.scaredBy(this, this.params.scare * typeMultiplier);
        }
        this.prevPosY = this.body.position.y;
    }

    makeActive() {
        // make dynamic (render physics)
        this.setStatic(false);

        // make interactable
        this.setInteractive().on('pointerdown', this.touchObj);

        // set friction
        this.body.friction = 10;
    }

    touchObj() {
        this.scene.ghost.target = this;
        this.scene.ghost.targetChanged = true;
    }

    possess() {
        console.log("ooOOoo possess " + this.params.name);
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
}