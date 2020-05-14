// Play scene with house view
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // Load level data
        this.load.json('lvl1','./src/levels/lvl1.json');
        this.load.json('lvl2','./src/levels/lvl2.json');
        this.load.json('lvl3','./src/levels/lvl3.json');

        // Load level backgrounds
        this.load.image('lvl1Background', './assets/textures/tb1.png');
        this.load.image('lvl2Background', './assets/textures/tb2.png');
        this.load.image('lvl3Background', './assets/textures/tb3.png');

        // TODO: Load level asset images

        // load characters' images
        this.load.image('ghost', './assets/textures/ghost.png');
        this.load.image('kid', './assets/textures/kid.png');

    }
    
    create() {
        // set additional level params
        game.levelParams.changingLevel = false;
        game.levelParams.levelBounds = new Phaser.Geom.Rectangle(0,0,0,0);

        // Create first level
        game.levelParams.renderedLevels.push(new Level(this, 1));
        game.levelParams.renderedLevels.push(new Level(this, 2));
        game.levelParams.currLevel = 1;
        game.levelParams.currLevelIndex = 0;
        game.levelParams.renderedLevels[0].makeActive();

        // define keyboard keys
        keyLevelUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);

        // make ghost
        this.ghost = new Ghost(this, game.config.width / 2, game.config.height / 2, 'ghost', 0);

        // make kid
        this.kid = new Kid(this, game.config.width / 2, (game.config.height / 2) + 300, 'kid', 0);
        
        // TODO: remove, just here for testing level generating
        this.count = 2;

        // format camera
        //this.cameras.main.setZoom(0.3);
        this.cameras.main.setBackgroundColor(0xFACADE);
    }

    update() {
        // debug changing level
        if(!this.changingLevel && Phaser.Input.Keyboard.JustDown(keyLevelUp)) {
            this.nextLevel(this.count % 3 + 1);
            ++this.count;
        }

        // update ghost
        this.ghost.update();
    }

    // TODO: on create, add all textures for start level and all other visible levels,
    // then add physics for current level.
    // TODO: variable for current object/ghost being controlled w/ setter/getter/manipulators
    // levels no longer visible, and draw textures for now visible levels. Add animation.
    // TODO: update all physics objects.
    // TODO: load all audio

    // move to next level (specify level number)
    nextLevel(level) {
        // make new level
        game.levelParams.renderedLevels.push(new Level(this, level));

        let offscreenLevel = game.levelParams.renderedLevels[0];
        let isOffscreen = false;

        // remove unseen level
        if(game.levelParams.renderedLevels.length > 3) {
            isOffscreen = true;
            game.levelParams.renderedLevels.shift();
        }

        // shift levels 
        let shiftDistX = game.config.width / 2 - game.levelParams.renderedLevels[1].background.x;
        let shiftDistY = game.config.height / 2 - game.levelParams.renderedLevels[1].background.y;
        game.settings.ceiling += shiftDistY;

        
        // set passive
        game.levelParams.renderedLevels[0].makePassive();
        game.levelParams.changingLevel = true;

        this.shiftTimer = this.time.addEvent({
            delay: 25,
            callback: () => {
                Phaser.Actions.Call(game.levelParams.renderedLevels, (level) => {
                    level.shift(shiftDistX / 100, shiftDistY / 100);
                });
                if(isOffscreen) {
                    offscreenLevel.shift(shiftDistX / 100, shiftDistY / 100);
                }
                //for(let level of game.levelParams.renderedLevels) 
                if(this.shiftTimer.getOverallProgress() > 0.8 && isOffscreen) {
                    offscreenLevel.remove();
                    isOffscreen = false;
                }
            },
            callbackScope: this,
            repeat: 99,
        });

        this.levelChangeTimer = this.time.addEvent({
            delay: 2500,
            callback: () => {
                // set active 
                game.levelParams.renderedLevels[1].makeActive();
                game.levelParams.changingLevel = false;
            },
            callbackScope: this,
        });

        // change current level
        game.levelParams.currLevel = level;
        game.levelParams.currLevelIndex = 1;
    }
}