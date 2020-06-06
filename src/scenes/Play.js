// Play scene with house view
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        played = true;
        // Load level data
        this.load.json('lvl1','./src/levels/lvl1.json');
        this.load.json('lvl2','./src/levels/lvl2.json');
        this.load.json('lvl3','./src/levels/lvl3.json');

        // Load level backgrounds
        this.load.image('lvl1Background', './assets/textures/level1BG.png');
        this.load.image('lvl2Background', './assets/textures/level2BG.png');
        this.load.image('atticBackground', './assets/textures/atticBG.png');

        // Load level asset images
        this.load.image('radio', './assets/textures/radio.png');
        this.load.image('radioHover', './assets/textures/radioHover.png');
        this.load.image('clock', './assets/textures/clock.png');
        this.load.image('clockHover', './assets/textures/clockHover.png');
        this.load.image('light', './assets/textures/light_OFF.png');
        this.load.image('lightHover', './assets/textures/light_OFFHover.png');
        this.load.atlas('anims_light', './assets/textures/anims_light.png', './assets/textures/anims_light.json');
        this.load.image('tub', './assets/textures/tub.png');
        this.load.image('tubHover', './assets/textures/tubHover.png');
        this.load.json('tubCollision', './assets/textures/tub.xml.json');
        this.load.image('box', './assets/textures/box.png');
        this.load.image('boxHover', './assets/textures/boxHover.png');
        this.load.image('cabinet', './assets/textures/cabinet.png');
        this.load.image('cabinetHover', './assets/textures/cabinetHover.png');
        this.load.image('lamp', './assets/textures/lamp.png');
        this.load.image('lampHover', './assets/textures/lampHover.png');
        this.load.image('mirror', './assets/textures/mirror.png');
        this.load.image('mirrorHover', './assets/textures/mirrorHover.png');
        this.load.image('shelf', './assets/textures/shelf.png');
        this.load.image('shelfHover', './assets/textures/shelf.png');
        this.load.image('balloon', './assets/textures/balloon.png');
        this.load.image('balloonHover', './assets/textures/balloonHover.png');
        

        // UI
        this.load.image('barBorder', './assets/textures/barBorder.png');
        this.load.image('barBackFill', './assets/textures/barBackFill.png');
        this.load.image('resizeToggle', './assets/textures/resizeToggleB.png');
        this.load.image('moveToggle', './assets/textures/moveToggleB.png');

        // pause menu assets
        this.load.image('menuButton', './assets/textures/menuButton.png');
        this.load.image('menuButtonHover', './assets/textures/menuButtonHover.png');
        this.load.image('restartButton', './assets/textures/restartButton.png');
        this.load.image('restartButtonHover', './assets/textures/restartButtonHover.png');
        this.load.image('resumeButton', './assets/textures/resumeButton.png');
        this.load.image('resumeButtonHover', './assets/textures/resumeButtonHover.png');

        // load characters' images
        this.load.image('ghost', './assets/textures/ghost.png');
        this.load.image('kid', './assets/textures/kid.png');
        this.load.atlas('anims_kid', './assets/textures/anims_kid.png', './assets/textures/anims_kid.json');
        this.load.image('scaredEmote', './assets/textures/scaredEmote.png');

        // load bgm
        this.load.audio('bgmLoop', './assets/audio/PaltergeistBGMLoop.wav');

        //sfx
        this.load.audio('chime', './assets/audio/ClockChime.wav');
        this.load.audio('radioBite', './assets/audio/Radio.wav');
        this.load.audio('lightSwitch', './assets/audio/LightSwitch.wav');
        this.load.audio('lightSwitch', './assets/audio/LightSwitch.wav');

        this.load.audio('possession', './assets/audio/PossessionSFX.wav');
        this.load.audio('unpossession', './assets/audio/UnpossessionSFX.wav');
        this.load.audio('toggle', './assets/audio/Toggle.wav');
    }
    
    create() {
    /*    //bgm loop
        this.music = this.sound.add('bgmLoop', {
            loop: true,
            volume: 0.2
        });
        this.music.play(); */

        // make black rectangle for fading out playable area
        this.blackScreen = this.add.image(0, 0, 'blackBox').setScale(game.config.width, game.config.height).
                                                                        setDepth(4).setOrigin(0,0).setAlpha(0);

        // pause menu parameters
        this.pauseMenu = new PauseMenu(this);
        this.isPaused = false;

        // make collision groups
        this.kidCollision = this.matter.world.nextCategory();
        this.ghostCollision = this.matter.world.nextCategory();
        this.scareCollision = this.matter.world.nextCategory(true);
        this.moveCollision = this.matter.world.nextCategory(true);
        this.wallCollision = this.matter.world.nextCategory();

        // set additional level params
        game.levelParams.changingLevel = false;

        // fix new ceiling
        game.settings.ceiling = config.height;

        // make initial floor collision box
        this.floor = this.matter.add.image(0,0,0);
        this.floor.setStatic(true).setCollisionCategory(this.wallCollision).setCollidesWith([0, this.moveCollision, this.ghostCollision, this.kidCollision]).setOrigin(0.5,0.5).setAlpha(0);
        this.floor.body.friction = 4;

        // Inital level setup
        game.levelParams.renderedLevels.push(new Level(this, 1));
        game.levelParams.renderedLevels.push(new Level(this, 2));
        game.levelParams.currLevel = game.levelParams.renderedLevels[0];
        game.levelParams.currLevelIndex = 0;
        game.levelParams.renderedLevels[0].makeActive();

        // define keyboard keys
        keyLevelUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        keyToggle = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyReset = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // make ghost
        this.ghost = new Ghost(this, game.config.width / 2, game.config.height / 2, 'ghost', 0);
        this.paranormalBar = new UIBar(this, this.ghost.x, this.ghost.y-(18+this.ghost.height/2),0x7bfff6,2); 

        // make kid
        this.kid = new Kid(this, game.config.width / 4, (game.config.height / 2) + 250, 'kid', 0);
        this.scareBar = new UIBar(this, this.kid.x, this.kid.y-(18+this.kid.height/2),0xffa100,3);
        this.kid.body.friction = 4;
        
        // TODO: remove, just here for testing level generating
        this.count = 2;

        // format camera
        // this.cameras.main.setZoom(0.3);
        this.cameras.main.setBackgroundColor(0x616765);

        // timer for when the kid wanders around
        this.wanderTimer = this.time.addEvent({
            delay: 3000,
            callback: this.kid.moveKid,
            callbackScope: this.kid,
            loop: true,
        });

          //set params for initial ghost loading on first level
          this.initLoadingGame = true;
          this.initCounter = 1;
          this.startPlay = false;
          this.initAlpha = 0;
    }

    update() {
        // debug changing level
        if(!game.levelParams.changingLevel && Phaser.Input.Keyboard.JustDown(keyLevelUp)) {
            this.nextLevel(this.count % 3 + 1);
            ++this.count;
        }
        // if on first level and when the game first loads, have the ghost spawn from portrait
        if(this.initLoadingGame && game.levelParams.currLevelIndex === 0){
            this.initLoadingGame = false;
            // fade in from opening
            this.blackScreen.setAlpha(1);
            this.tweens.add({
                delay: 0,
                targets: this.blackScreen,
                alpha: 0,
                ease: 'Linear',
                duration: 2500,
                repeat: 0,
                yoyo: false,
            });

            this.ghost.alpha = 0;
            this.ghost.x = 1065;
            this.ghost.y = 448;
            this.paranormalBar.alpha = 0;
            this.paranormalBar.update(this.ghost.x, this.ghost.y-(18+this.ghost.height/2), this.ghost.paranormalStrengthCurr/this.ghost.paranormalStrengthMax);
            this.spawnInTimer = this.time.addEvent({
                delay: 0,
                callback: () => {this.initAlpha += .0125;
                                 this.ghost.alpha = this.initAlpha;
                                 this.paranormalBar.setAlpha(this.initAlpha);
                                 this.initCounter++;
                                 if(this.initCounter == 80){
                                    this.startPlay = true;
                                 }},
                callbackScope: this,
                repeat: 80
            });
            
            
            
        }
        //if not then load as usual
        else if (this.startPlay){
            if(!this.isPaused) {
                // update ghost
                this.ghost.update(game.loop.rawDelta);
    
                // update kid
                if(!game.levelParams.changingLevel) {
                    this.kid.update(game.loop.rawDelta);
                }
                this.scareBar.update(this.kid.x, this.kid.y-(18+this.kid.height/2), this.kid.params.scareLevelCurr/this.kid.params.scareLevelMax);
    
    
                // if possessing, move active object, and set the paranormal bar to the object
                if(this.ghost.isPossessing) {
                    this.ghost.target.update(keyToggle);
                    this.paranormalBar.update(this.ghost.target.x, this.ghost.target.y, this.ghost.paranormalStrengthCurr/this.ghost.paranormalStrengthMax);
                }
                else {
                    this.paranormalBar.update(this.ghost.x, this.ghost.y-(18+this.ghost.height/2), this.ghost.paranormalStrengthCurr/this.ghost.paranormalStrengthMax);
                }
            }
    
            if(Phaser.Input.Keyboard.JustDown(keyEscape) && !game.levelParams.changingLevel) {
                if(this.pauseMenu.isOpen) {
                    this.pauseMenu.close();
                }
                else {
                    this.pauseMenu.open();
                }
            }
    
            // PROGRAM SCENE DEBUGGING
            if (Phaser.Input.Keyboard.JustDown(keySpace)) {
                game.levelParams.renderedLevels = [];
                this.scene.start("outroScene");
            }
    
            // reset the level if the kid reaches max scare
            if(this.kid.params.scareLevelCurr === this.kid.params.scareLevelMax) {
                game.levelParams.renderedLevels[game.levelParams.currLevelIndex].reset();
            }
    
            // Debugging reset level
            if(Phaser.Input.Keyboard.JustDown(keyReset)) {
                game.levelParams.renderedLevels[game.levelParams.currLevelIndex].reset();
            }
        }
    }

    // move to next level (specify level number)
    nextLevel(level) {
        // turn off level complete flag
        game.levelParams.complete = false;
        this.wanderTimer.paused = true;
        this.kid.params.direction = "left";
        this.kid.setFlipX(true);

        // if ghost is possessing something, unpossess
        if(this.ghost.isPossessing) {
            this.ghost.unpossess();
        }

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
        let shiftDistX = game.levelParams.renderedLevels[1].background.x - game.config.width / 2;
        let shiftDistY = game.config.height / 2 - game.levelParams.renderedLevels[1].background.y;
        let distanceTraveled = {x: 0, y: 0};
        game.settings.ceiling += shiftDistY;

        // set passive
        game.levelParams.renderedLevels[0].makePassive();
        game.levelParams.changingLevel = true;
        this.kid.body.collisionFilter.mask = 0; // turn off world bounds collision
        this.kid.setStatic(true);

        let step = 1; // current step on movement (out of 100)

        // walk kid to start of stairs
        this.kidShiftTimer = this.time.addEvent({
            delay:25,
            callback: () => {
                // when reached stairs, start shifting level
                if(this.kidShiftTimer.getOverallProgress() > 0.7) {
                    this.shiftTimer.paused = false;
                }
                else {
                    this.kid.y -= 1.5;
                }
            },
            callbackScope: this,
            repeat: 49,
        });

        // shift levels down to center next level
        this.shiftTimer = this.time.addEvent({
            delay: 25,
            callback: () => {
                let dx, dy;
                if(shiftDistX != 0) {
                    dx = (-shiftDistX / 2) * (Math.cos(step * (Math.PI / 100)) - 1) - distanceTraveled.x;
                    distanceTraveled.x += dx;
                }
                else {
                    dx = 0;
                }
                if(shiftDistY != 0) {
                    dy = (-shiftDistY / 2) * (Math.cos(step * (Math.PI / 100)) - 1) - distanceTraveled.y;
                    distanceTraveled.y += dy;
                }
                else {
                    dy = 0;
                }
                ++step;

                Phaser.Actions.Call(game.levelParams.renderedLevels, (level) => {
                    level.shift(dx, dy);
                });
                if(isOffscreen) {
                    offscreenLevel.shift(dx, dy);
                }

                // shift kid
                this.kid.x += dx;
                this.kid.y += dy - 1.5; // shift with level but walk up stairs
                
                if(this.shiftTimer.getOverallProgress() > 0.8 && isOffscreen) {
                    offscreenLevel.remove();
                    isOffscreen = false;
                }
            },
            callbackScope: this,
            repeat: 99,
            paused: true,
        });

        this.levelChangeTimer = this.time.addEvent({
            delay: 3750,
            callback: () => {
                let currLevel = game.levelParams.renderedLevels[1];
                // set active 
                currLevel.makeActive();
                
                // enter kid
                this.kid.alpha = 0;
                this.kid.enterLevel();
            },
            callbackScope: this,
        });

        // change current level
        game.levelParams.currLevel = game.levelParams.renderedLevels[1];
        game.levelParams.currLevelIndex = 1;
    }
}