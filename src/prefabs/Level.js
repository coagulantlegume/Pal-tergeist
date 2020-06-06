// Level prefab
class Level {
    constructor(scene, levelNum) {

        // Read level JSON file
        let rawData = scene.cache.json.get('lvl' + levelNum);

        // add scene parameter
        this.scene = scene;

        // set params (border width, center, size)
        this.params = rawData.params;
        this.params.index;

        // load/draw level background
        this.background = scene.add.sprite(game.config.width / 2, game.settings.ceiling, rawData.backgroundTexture);
        this.background.setOrigin(this.params.center.x / this.background.width, this.params.center.y / this.background.height);
        this.background.y -= this.background.height / 2;

        // set params for new 0,0 coordinate of level
        this.params.x0 = this.background.x - this.params.center.x;
        this.params.y0 = this.background.y - this.params.center.y;

        // make scare objects
        this.scareGroup = [];
        Phaser.Actions.Call(rawData.scareObjects, (obj) => {
            let newObj = new ScareObject(scene, obj.position.x + this.params.x0, obj.position.y + this.params.y0, 
                                         obj.texture, obj.scale, obj.collision, obj.range, obj.visual, obj.auditory, obj.powerGain, obj.scareGain, obj.name, obj.sound, 
                                         obj.anims, obj.anims_fCount, obj.anims_fRate, undefined, obj.disabled);
            newObj.setScale(obj.scale);
            this.scareGroup.push(newObj);
        });

        // make move objects
        this.moveGroup = [];
        Phaser.Actions.Call(rawData.moveObjects, (obj) => {
            // Prep collision body vertices
            let collisionBody;
            if(obj.collision){
                let collisionJson = scene.cache.json.get(obj.collision);
                eval('collisionBody = {shape: collisionJson.' + obj.name + '};'); 
            }
            let newObj = new MoveObject(scene, obj.position.x + this.params.x0, obj.position.y + this.params.y0, 
                                         obj.texture, obj.scale, obj.range, obj.visual, obj.auditory, obj.powerGain, obj.scareGain, obj.powerLossRate, obj.name, obj.scaleMax, collisionBody);
            newObj.setScale(obj.scale);
            this.moveGroup.push(newObj);
        });
        
        // update ceiling var
        game.settings.ceiling -= this.background.height;
    }

    // adds physics objects to physics scene
    makeActive() {
        // TODO: smooth out readjustment
        // readjust current levelBounds
        this.scene.matter.world.setBounds(this.background.x - this.background.width / 2 + this.params.borderWidth, 
                                          this.background.y - this.background.height / 2 + this.params.borderWidth + 5,
                                          this.background.width - 2 * this.params.borderWidth,
                                          this.background.height - 2 * this.params.borderWidth + 10);
        // readjust floor bound
        this.scene.floor.setPosition(this.params.x0 + this.background.width / 2, this.params.y0 + this.background.height);
        this.scene.floor.setScale(this.background.width / this.scene.floor.width, this.params.borderWidth * 2 / this.scene.floor.height);

        // make objects active
        Phaser.Actions.Call(this.scareGroup, (obj) => {
            obj.makeActive();
        });
        Phaser.Actions.Call(this.moveGroup, (obj) => {
            obj.makeActive();
        });
    }

    // removes physics objects from physics scene
    makePassive() {

        // make objects passive
        Phaser.Actions.Call(this.scareGroup, (obj) => {
            obj.makePassive();
        });
        Phaser.Actions.Call(this.moveGroup, (obj) => {
            obj.makePassive();
        });
    }

    // shift entire level and objects
    shift(distX, distY) {
        this.background.x += distX;
        this.background.y += distY;

        // shift all other objects in level
        Phaser.Actions.Call(this.scareGroup, (obj) => {
            obj.x += distX;
            obj.y += distY;
        });
        Phaser.Actions.Call(this.moveGroup, (obj) => {
            obj.x += distX;
            obj.y += distY;
        });

        // update new 0,0 coordinate of level
        this.params.x0 = this.background.x - this.params.center.x;
        this.params.y0 = this.background.y - this.params.center.y;
    }

    // remove level entirely
    remove() {
        this.background.destroy();
        
        // destroy all other objects
        while(this.scareGroup.length > 0) {
            this.scareGroup[0].destroy();
            this.scareGroup.shift();
        } 
        while(this.moveGroup.length > 0) {
            this.moveGroup[0].destroy();
            this.moveGroup.shift();
        } 
    }

    // reset all parameters and positions
    reset() {
        this.scene.tweens.add({
            targets: this.scene.blackScreen,
            alpha: 1,
            ease: 'Linear',
            duration: 500,
            repeat: 0,
            yoyo: false,
            onComplete: () => { 
                // Read original level JSON file, reset level
                let rawData = this.scene.cache.json.get(this.params.name);

                // reset ghost
                if(this.scene.ghost.isPossessing) {
                    this.scene.ghost.unpossess();
                }
                this.scene.ghost.paranormalStrengthCurr = 50;
                this.scene.ghost.setPosition(rawData.params.center.x + this.params.x0, rawData.params.center.y + this.params.y0);
            
                // reset kid
                this.scene.kid.setPosition(this.params.x0 + rawData.params.entrance.x, this.params.y0 + this.background.height - 2 * this.params.borderWidth);
                this.scene.kid.params.scareLevelCurr = 25;
                this.scene.kid.params.isMoving = false;
                this.scene.kid.params.isScared = false;
                this.scene.kid.params.distance = 0;
                this.scene.kid.isCropped = false;
                this.scene.kid.alpha = 1;
                this.scene.kid.shiverTimer.paused = true;
            
                // reset scare objects
                for(let i = 0; i < this.scareGroup.length; ++i ) {
                    this.scareGroup[i].cooldown = false;
                }
            
                // reset move objects
                for(let i = 0; i < rawData.moveObjects.length; ++i ) {
                    this.moveGroup[i].setPosition(this.params.x0 + rawData.moveObjects[i].position.x, 
                                                  this.params.y0 + rawData.moveObjects[i].position.y);
                    this.moveGroup[i].setScale(rawData.moveObjects[i].scale);
                    this.moveGroup[i].setRotation(0);
                }

                // fade back in after .5 seconds
                this.scene.tweens.add({
                    delay: 500,
                    targets: this.scene.blackScreen,
                    alpha: 0,
                    ease: 'Linear',
                    duration: 500,
                    repeat: 0,
                    yoyo: false,
                });
            }
        });
    }
}