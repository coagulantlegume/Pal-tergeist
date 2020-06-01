// ScareObject prefab, for any object that can scare child
class ScareObject extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, scale, collision, range, visual, auditory, powerGain, scareGain, name, sound, animation, animation_fCount, animation_fRate, collisionBody) {
        // console.log(name);
        // console.log(collisionBody);
        super(scene.matter.world, x, y, texture, 0, collisionBody);
        // parameters
        this.params = {
            name: name,
            range: range,
            visual: visual,
            auditory: auditory,
            power: powerGain,
            scare: scareGain,
            sfx: sound,
            anims: animation
        };

        // set scale
        this.scale = scale;

        //Set sound effect
        if(this.params.sfx){
            this.params.sfx = scene.sound.add(sound);
            this.params.sfx.setVolume(0.5);
        }

        // set animation
        if(this.params.anims){
            scene.anims.create({
                key: '_anims_'+name,
                repeat: 0,
                frameRate: animation_fRate,
                frames: scene.anims.generateFrameNames(animation, {
                    prefix: 'f',
                    suffix: '.png',
                    start: 1,
                    end: animation_fCount,
                    zeroPad: 2
                })
            })
            this.anims.load('_anims_'+name);
        }

        // set collision group and mask if collision is set
        if(collision) {
            this.setCollisionCategory(this.scene.scareCollision);
            this.setCollidesWith([this.scene.moveCollision, this.kidCollision]);
        }
        else if(collision !== undefined) {
            this.setCollisionGroup(this.scene.scareCollision);
            this.setCollidesWith();
        }

        // make static
        this.setStatic(true);

        // put in front of background layer
        this.setDepth(1);

        // add to scene
        scene.add.existing(this);

        // set cooldown 
        this.cooldown = false;
    }

    makeActive() {
        // make interactable
        this.setInteractive().on('pointerdown', this.touchObj).on('pointerover', this.hoverObj).on('pointerout', this.unhoverObj);
        this.setActive(true);
    }

    makePassive() {
        // remove interactivity
        this.disableInteractive();

        // make static (for move objects)
        this.setStatic(true);
        this.setActive(false);
    }

    touchObj() {
        // extra measure to clear toggle UI when clicking on scareObject after possessing an object
        if(this.scene.ghost.isPossessing){
            this.scene.ghost.target.makeToggleInvis();
        }
        // move to object
        this.scene.ghost.target = this;
        this.scene.ghost.targetChanged = true;

        //Set Cooldown of scareObj
        if(!this.cooldown){
            this.setAlpha(0.75); //make semi transparent to indicate not interactable
            this.cooldownTimer = this.scene.time.addEvent({
                delay: 10000,
                callback: () => {this.cooldown = false; this.setAlpha(1)},
                callbackScope: this,
                repeat: 0,
            });
        }

    }

    hoverObj(){
        // if not on cooldown show obj glow meaning it can be interacted with
        if(!this.cooldown){
            this.setTexture(this.params.name+'Hover');
        }
    }

    unhoverObj(){
        this.setTexture(this.params.name);
    }

    possess() {
        if(!this.cooldown){
            //sfx
            if(this.params.sfx){
                this.params.sfx.play();
            }
            // animation
            if(this.params.anims){
                this.play('_anims_'+this.params.name);
            }
        }

        // update kid's scare effect
        this.scene.kid.scaredBy(this, this.params.scare, this.params.power);
        this.cooldown = true;

        this.scene.ghost.target = game.input.mousePointer;
    }
}