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

        // TODO: make objects

        // update ceiling var
        game.settings.ceiling -= this.background.height;
    }

    // TODO: makeActive(), adds physics objects to physics scene
    makeActive() {
        console.log(this.params.name + " made active");
        game.levelParams.levelBounds.setPosition(this.background.x - this.background.width / 2 + this.params.borderWidth, 
                                                 this.background.y - this.background.height / 2 + this.params.borderWidth).
             setSize(this.background.width - 2 * this.params.borderWidth,
                     this.background.height - 2 * this.params.borderWidth);
    }

    // TODO: makePassive(), removes physics objects from physics scene
    makePassive() {
        console.log(this.params.name + " made passive");
    }

    // shift entire level and objects
    shift(distX, distY) {
        this.background.x += distX;
        this.background.y += distY;

        // TODO: shift all other objects in level
    }

    remove() {
        this.background.destroy();
        // TODO: destroy all other objects
    }
}