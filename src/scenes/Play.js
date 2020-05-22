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
        this.load.image('lvl1Background', './assets/textures/level1BG.png');
        this.load.image('lvl2Background', './assets/textures/tb2.png');
        this.load.image('lvl3Background', './assets/textures/tb3.png');

        // Load level asset images
        //this.load.image('light', './assets/textures/light.png');
        //this.load.image('book', './assets/textures/book.png');
        this.load.image('radio', './assets/textures/radio.png');
        this.load.image('clock', './assets/textures/clock.png');
        this.load.image('light_OFF', './assets/textures/light_OFF.png');
        //this.load.image('light_ON', './assets/textures/light_ON.png');
        this.load.atlas('anims_light', './assets/textures/anims_light.png', './assets/textures/anims_light.json');
        this.load.image('tub', './assets/textures/tub.png');

        // load characters' images
        this.load.image('ghost', './assets/textures/ghost.png');
        this.load.image('kid', './assets/textures/kid.png');

        // load bgm
        this.load.audio('bgmLoop', './assets/audio/PaltergeistBGMLoop.wav');

        //sfx
        this.load.audio('chime', './assets/audio/ClockChime.wav');
        this.load.audio('radioBite', './assets/audio/Radio.wav');
        this.load.audio('lightSwitch', './assets/audio/LightSwitch.wav');
        this.load.audio('lightSwitch', './assets/audio/LightSwitch.wav');

        this.load.audio('possession', './assets/audio/PossessionSFX.wav');
        this.load.audio('unpossession', './assets/audio/UnpossessionSFX.wav');
    }
    
    create() {
        //bgm loop
        this.music = this.sound.add('bgmLoop', {
            loop: true,
            volume: 0.1
        });
        this.music.play();

        // set additional level params
        game.levelParams.changingLevel = false;
        game.levelParams.levelBounds = new Phaser.Geom.Rectangle(0,0,0,0);

        // fix new ceiling
        game.settings.ceiling = config.height;

        // Inital level setup
        game.levelParams.renderedLevels.push(new Level(this, 1));
        game.levelParams.renderedLevels.push(new Level(this, 2));
        game.levelParams.currLevel = 1;
        game.levelParams.currLevelIndex = 0;
        game.levelParams.renderedLevels[0].makeActive();

        // define keyboard keys
        keyLevelUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        keyToggle = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // make ghost
        this.ghost = new Ghost(this, game.config.width / 2, game.config.height / 2, 'ghost', 0);

        // make kid
        this.kid = new Kid(this, game.config.width / 4, (game.config.height / 2) + 250, 'kid', 0);
        
        // TODO: remove, just here for testing level generating
        this.count = 2;

        // format camera
        //this.cameras.main.setZoom(0.3);
        this.cameras.main.setBackgroundColor(0xFACADE);

        // timer for when the kid wanders around
        this.wanderTimer = this.time.addEvent({
            delay: 3000,
            callback: this.moveKid,
            callbackScope: this,
            loop: true
          });
    }

    update() {
        // debug changing level
        if(!game.levelParams.changingLevel && Phaser.Input.Keyboard.JustDown(keyLevelUp)) {
            this.nextLevel(this.count % 3 + 1);
            ++this.count;
        }
        // update ghost
        this.ghost.update();

        // update kid
        this.kid.update();

        // if possessing, move active object
        if(this.ghost.isPossessing) {
            this.ghost.target.update(keyToggle);
        }

        // PROGRAM SCENE DEBUGGING
        if (Phaser.Input.Keyboard.JustDown(keySpace)) {
            game.levelParams.renderedLevels = [];
            this.music.destroy();
            this.scene.start("outroScene");
        }
    }

    // kid wandering around randomly
    moveKid(){
        const randNumber = Math.floor((Math.random() * 4) + 1);
        switch(randNumber) {
            case 1:
                this.kid.setVelocityX(game.settings.wanderSpeed); //kid moves right
                this.kid.resetFlip();
                break;
            case 2:
                this.kid.setVelocityX(-game.settings.wanderSpeed); //kid moves left
                this.kid.toggleFlipX()
                break;
            case 3: 
                this.kid.setVelocityX(0); //kid remains idle
                break;
            default:
                this.kid.setVelocityX(game.settings.wanderSpeed);
                this.kid.resetFlip();
        }
        this.wanderTimer.delay = Math.floor((Math.random() * 5000) + 2000); //selects delay randomly in a range
    }

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

        // TODO: smooth out shift (lerp dat ish)
        // shift levels down to center next level
        this.shiftTimer = this.time.addEvent({
            delay: 25,
            callback: () => {
                Phaser.Actions.Call(game.levelParams.renderedLevels, (level) => {
                    level.shift(shiftDistX / 100, shiftDistY / 100);
                });
                if(isOffscreen) {
                    offscreenLevel.shift(shiftDistX / 100, shiftDistY / 100);
                }
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