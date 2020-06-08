// Play scene with house view
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        played = true;
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

        // make kid
        let kid_collisionJson = this.cache.json.get('kidCollision');
        this.kid = new Kid(this, game.config.width / 4, (game.config.height / 2) + 250, 'kid', 0, {shape: kid_collisionJson.kid});

        this.scareBar = new UIBar(this, this.kid.x, this.kid.y-(18+this.kid.height/2),0xffa100,3);
        this.kid.body.friction = 4;

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

        // set up kid/move object collision events (following https://labs.phaser.io/view.html?src=src\physics\matterjs\compound%20sensors.js)
        this.matter.world.on('collisionactive', (event) => {
            let pairs = event.pairs;
            Phaser.Actions.Call(pairs, (obj) => {
                let bodyA = obj.bodyA;
                let bodyB = obj.bodyB;

                if(obj.isSensor) {
                    if(bodyA.isSensor) {
                        bodyB.gameObject.bumpKid();
                    }
                    else {
                        bodyA.gameObject.bumpKid();
                    }
                }
            }) 
        })
    }

    update() {
        // debug changing level
        if(!game.levelParams.changingLevel && Phaser.Input.Keyboard.JustDown(keyLevelUp)) {
            this.kid._state.setState("changinglevel");
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
                this.kid.update(game.loop.rawDelta);
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
            // if (Phaser.Input.Keyboard.JustDown(keySpace)) {
            //     game.levelParams.renderedLevels = [];
            //     this.scene.start("outroScene");
            // }
    
            // reset the level if the kid reaches max scare
            if(this.kid.params.scareLevelCurr === this.kid.params.scareLevelMax) {
                game.levelParams.renderedLevels[game.levelParams.currLevelIndex].reset();
            }
    
            // Debugging reset level
            // if(Phaser.Input.Keyboard.JustDown(keyReset)) {
            //     game.levelParams.renderedLevels[game.levelParams.currLevelIndex].reset();
            // }
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

        // make new level, if more defined levels
        if(this.count <= game.levelParams.numLevels) {
            game.levelParams.renderedLevels.push(new Level(this, level));
        }
        else {
            game.levelParams.renderedLevels.push(undefined);
        }

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
                    if(level !== undefined) {
                        level.shift(dx, dy);
                    }
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

    endGame() {
        this.isPaused = true;
        this.matter.world.enabled = false;
        this.tweens.add({
            targets: this.blackScreen,
            alpha: { from: 0, to: 1},
            ease: 'Linear',
            duration: 750,
            repeat: 0,
            yoyo: false,
            onComplete: () => { 
                game.levelParams.renderedLevels = [];
                this.scene.start("outroScene");
            }
        });
    }
}