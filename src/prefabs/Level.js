// Level prefab
class Level {
    constructor(scene, levelNum) {

        // Read level JSON file
        let rawData = scene.cache.json.get('lvl' + levelNum);

        // set params (border width, center, size)
        this.params = rawData.params;
        this.params.index;

        // load/draw level background
        this.background = scene.add.sprite(game.config.width / 2, game.settings.ceiling, rawData.backgroundTexture);
        this.background.setOrigin(this.params.center.x / this.background.width, this.params.center.y / this.background.height);
        this.background.y -= this.background.height / 2;

        // set params for new 0,0 coordinate of level
        this.params.x0 = this.background.x - this.background.width / 2;
        this.params.y0 = this.background.y - this.background.height / 2;

        // make scare objects
        this.scareGroup = [];
        Phaser.Actions.Call(rawData.scareObjects, (obj) => {
            let newObj = new ScareObject(scene, obj.position.x + this.params.x0, obj.position.y + this.params.y0, 
                                         obj.texture, obj.powerGain, obj.scareGain, obj.name, obj.sound, 
                                         obj.anims, obj.anims_fCount, obj.anims_fRate);
            newObj.setScale(obj.scale);
            this.scareGroup.push(newObj);
        });

        // make move objects
        this.moveGroup = [];
        Phaser.Actions.Call(rawData.moveObjects, (obj) => {
            let newObj = new MoveObject(scene, obj.position.x + this.params.x0, obj.position.y + this.params.y0, 
                                         obj.texture, obj.powerGain, obj.scareGain, obj.powerLossRate, obj.name, obj.scaleMax);
            newObj.setScale(obj.scale);
            this.moveGroup.push(newObj);
        });
        
        // update ceiling var
        game.settings.ceiling -= this.background.height;
    }

    // TODO: makeActive(), adds physics objects to physics scene
    makeActive() {
        // TODO: smooth out readjustment
        // readjust current levelBounds
        game.levelParams.levelBounds.setPosition(this.background.x - this.background.width / 2 + this.params.borderWidth, 
                                                 this.background.y - this.background.height / 2 + this.params.borderWidth).
             setSize(this.background.width - 2 * this.params.borderWidth,
                     this.background.height - 2 * this.params.borderWidth);

        // make objects active
        Phaser.Actions.Call(this.scareGroup, (obj) => {
            obj.makeActive();
        });
        Phaser.Actions.Call(this.moveGroup, (obj) => {
            obj.makeActive();
        });
    }

    // TODO: makePassive(), removes physics objects from physics scene
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
    }

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
}