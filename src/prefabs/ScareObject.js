// ScareObject prefab, for any object that can scare child
class ScareObject extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, scale, powerGain, scareGain, name, sound, animation, animation_fCount, animation_fRate) {
        super(scene, x, y, texture, 0);
        // parameters
        this.params = {
            name: name,
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

        // put in front of background layer
        this.setDepth(1);

        // add to scene
        scene.add.existing(this);
    }

    makeActive() {
        // add to physics scene (for overlap)
        this.scene.physics.add.existing(this);
        // make interactable
        this.setInteractive().on('pointerdown', this.touchObj);
    }

    makePassive() {
        // remove physics body
        this.body.destroy();
        
        // remove interactivity
        this.removeInteractive();
    }

    touchObj() {
        // move to object
        this.scene.ghost.target = this;
        this.scene.ghost.targetChanged = true;
    }

    possess() {
        // TODO: add effects of scare object (scare/power manipulation)
        console.log("ooOOoo scary " + this.params.name);
        //sfx
        if(this.params.sfx){
            this.params.sfx.play();
        }
        // animation
        if(this.params.anims){
            this.play('_anims_'+this.params.name);
        }

        this.scene.ghost.target = game.input.mousePointer;
    }

    // TODO: every frame where manipulation is taking place, call this.scene.kid.scaredBy(this)
    // to check if affecting child
}