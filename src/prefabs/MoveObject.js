// MoveObject prefab, for objects that can scare child and cost ghost power to manipulate
class MoveObject extends ScareObject {
    constructor(scene, x, y, texture, powerGain, scareGain, powerLossRate, name) {
        super(scene, x, y, texture, powerGain, scareGain, name, null, null);
        this.params.powerLoss = powerLossRate;
        // add to scene and physics
        scene.add.existing(this);
        //scene.physics.add.existing(this);

        // sfx
        this.possessSFX = scene.sound.add('possession');

        // posessesion mode (move/resize)
        this.mode = "move";
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
        if(Phaser.Input.Keyboard.JustDown(keyRight)){
            if("move" === this.mode){
                // console.log("move right");
                // console.log((100000 * (1/(this.height*this.width))));
                this.x -= (100000 * (1/(this.height*this.width))); 
            }
            else if("resize" === this.mode){
                
            }


        }
        else if(Phaser.Input.Keyboard.JustDown(keyLeft)){
            if("move" === this.mode){
                // console.log("move left");
                // console.log((100000 * (1/(this.height*this.width))));
                this.x += (100000 * (1/(this.height*this.width)));
            }
            else if("resize" === this.mode){
                
            }
        }

        //*Somehow deactive gravity in this mode
        if("move" === this.mode){
            this.body.allowGravity = false; //disable gravity so object can float
            if(Phaser.Input.Keyboard.JustDown(keyUp)){
                this.y -= (100000 * (1/(this.height*this.width)));
            }
            else if(Phaser.Input.Keyboard.JustDown(keyDown)){
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