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

        // set position of the toggle UI
        this.resizeUI.setPosition(this.x-(this.width/2*this.scale),
                                  this.y-(this.height/2*this.scale));
        this.moveUI.setPosition(this.x-(this.width/2*this.scale),
                                  this.y-(this.height/2*this.scale));

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
}