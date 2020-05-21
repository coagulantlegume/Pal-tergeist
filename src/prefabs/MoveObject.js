// MoveObject prefab, for objects that can scare child and cost ghost power to manipulate
class MoveObject extends ScareObject {
    constructor(scene, x, y, texture, scale, powerGain, scareGain, powerLossRate, name, scaleMax) {
        super(scene, x, y, texture, scale, powerGain, scareGain, name, null, null);
        this.params.powerLoss = powerLossRate;
        // add to scene and physics
        scene.add.existing(this);
        //scene.physics.add.existing(this);

        // sfx
        this.possessSFX = scene.sound.add('possession');

        // posessesion mode (move/resize)
        this.mode = "move";
        this.scaleMax = scaleMax; // max scale value, min scale value = 1/scaleMax
    }
    
    update(keyToggle) {
        // set drag based on size
        if (!this.body.blocked.none) { // if against ceiling or floor
            this.body.setDragX((this.scale * this.height * this.width) / 60);
        }
        else {
            this.body.setDragX(0);
        }

        // set gravity based on size
        this.setGravity(0, (this.scale * this.height * this.width) / 40)

        // set max velocity
        this.setMaxVelocity((this.height * this.width) / (this.scale * 400), (this.height * this.width) / (this.scale * 100));

        //switch modes only once the player releases the key after pressing it
        if(Phaser.Input.Keyboard.JustDown(keyToggle)){
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
                // console.log("move right");
                // console.log((100000 * (1/(this.height*this.width))));
                this.body.velocity.x += ((this.height * this.width) / (this.scale * 2000)); 
            }
            else if("resize" === this.mode){
                // only increase to scaleMax value
                if(this.scale < this.scaleMax){
                    this.scale += .01;
                }
            }
        }
        else if(keyLeft.isDown){
            if("move" === this.mode){
                // console.log("move left");
                // console.log((100000 * (1/(this.height*this.width))));
                this.body.velocity.x -= ((this.height * this.width) / (this.scale * 2000));
            }
            else if("resize" === this.mode){
                if(this.scale > 1 / this.scaleMax){
                    this.scale -= .01;
                }
            }
        }

        // UP/DOWN Controls
        if("move" === this.mode){
            //this.body.allowGravity = false; //disable gravity so object can float
            if(keyUp.isDown){
                this.body.velocity.y -= ((this.height * this.width) / (this.scale * 2000));
            }
            else if(keyDown.isDown){
                this.body.velocity.y += ((this.height * this.width) / (this.scale * 2000));
            }
        }

        return;
    }

    makeActive() {
        // add to physics scene
        this.scene.physics.add.existing(this);

        // add level collision
        this.body.setBoundsRectangle(game.levelParams.levelBounds);
        this.setCollideWorldBounds(true);

        // set gravity
        this.setGravity(0,700);

        // make interactable
        this.setInteractive().on('pointerdown', this.touchObj);
    }

    touchObj() {
        this.scene.ghost.target = this;
        this.scene.ghost.targetChanged = true;
    }

    possess() {
        // TODO: add effects of scare object (animation, sound, and scare/power manipulation)
        console.log("ooOOoo possess " + this.params.name);
        //sfx
        this.possessSFX.setVolume(0.8);
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

    // TODO: custom control variables based on size
    // TODO: manipulation drain variables for moving, resizing, and
    // opening based on size.
    // TODO: update function applying drain values when manipulating
}