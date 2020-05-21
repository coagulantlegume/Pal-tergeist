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
        // TODO: add control effects

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

        // Movement amount based on how big the object is. *Might need to rework better math
        // Resizing up and down by a quarter of the current size *definitely needs to be reworked
        if(keyRight.isDown){
            if("move" === this.mode){
                // console.log("move right");
                // console.log((100000 * (1/(this.height*this.width))));
                this.x += (100000 * (1/(this.height*this.width))); 
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
                this.x -= (100000 * (1/(this.height*this.width)));
            }
            else if("resize" === this.mode){
                if(this.scale > 1 / this.scaleMax){
                    this.scale -= .01;
                }
            }
        }

        // UP/DOWN Controls
        if("move" === this.mode){
            this.body.allowGravity = false; //disable gravity so object can float
            if(keyUp.isDown){
                this.y -= (100000 * (1/(this.height*this.width)));
            }
            else if(keyDown.isDown){
                this.y += (100000 * (1/(this.height*this.width)));
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