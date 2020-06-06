// Kid prefab
class Kid extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene.matter.world, x, y, texture, frame);

        this.setDepth(2);
        this._crop = this.resetCropObject();

        this.params = {
            walkAreaLBound: undefined,  // left (min) y value of walkable area
            walkAreaRBound: undefined,  // right (max) y value of walkable area
            direction: "right",         // direction kid is walking in
            isMoving: false,            // whether kid is currently walking or standing still
            exiting: false,             // if kid currently walking to exit (calculated path)
            scareLevelMax: 100,
            scareLevelHigh: 75,
            scareLevelCurr: 25,
            shiverAmount: .75,          // the distance in each direction that the kid shivers in
            showPercent: 100,           // the percentage of the sprite visible(from left side)
            isScared: false,            // whether kid is currently being scared/running away
        }

        // set up rudimentary state machine
        this.states = [ // definition of states
            {
                // required for all states
                key: "idle",
                kid: this,
                onSwitch: this.idleSwitchTo,
                update: this.idleUpdate,

                // additional info
                target: 0,  // x coordinate target to travel to
                speed: {
                    base: 1,
                    highScare: 2.5
                },
            },
            {
                // required
                key: "scared",
                kid: this,
                onSwitch: this.scaredSwitchTo,
                update: this.scaredUpdate,

                // additional
                speed: 4,
            },
            {
                // required
                key: "exiting",
                kid: this,
                onSwitch: this.exitingSwitchTo,
                update: this.exitingUpdate,

                // additional
                target: 0, // exit x coordinate
                speed: 3,
            },
            {
                // required
                key: "changinglevel",
                kid: this,
                onSwitch: this.changingLevelSwitchTo,
                update: this.changingLevelUpdate,
            },
        ];
        this._state = { // object containing state management
            currState: undefined,
            setState: (stateKey) => {
                this._state.currState = this.states.find(state => state.key == stateKey);
                this._state.currState.onSwitch();
            },
            update: () => {
                this._state.currState.update();
            }
        }
        this._state.setState("idle");

        // make static (so it can be drawn outside of world area)
        this.setStatic(true);

        // set collision group and mask 
        this.setCollisionCategory(this.scene.kidCollision);
        this.setCollidesWith([1, this.scene.moveCollision, this.scene.scareCollision, this.scene.wallCollision]);

        // set center
        this.setOrigin(0.5, 0.5);

        // add walkable area debug rectangle
        this.walkAreaRect = this.scene.add.rectangle(this.scene,0,0,0,0,0xFACADE);
        this.walkAreaRect.alpha = 0.5;
        this.walkAreaRect.setOrigin(0, 0.5);
        this.walkAreaRect.setDepth(4);

        // add walkable area debug rectangle
        this.exitAreaRect = this.scene.add.rectangle(this.scene,0,0,0,0,0xFACADE);
        this.exitAreaRect.alpha = 0.5;
        this.exitAreaRect.setOrigin(0, 0.5);
        this.exitAreaRect.setDepth(4);

        // add target position debug point
        this.targetPoint = this.scene.add.rectangle(this.scene,0,0,0,0,0xFACADE);
        this.targetPoint.setSize(10,10);
        this.targetPoint.alpha = 0.5;
        this.targetPoint.setOrigin(0, 0.5);
        this.targetPoint.setDepth(4);
        
        // add to scene and physics
        scene.add.existing(this);

        // add animations
        scene.anims.create({
            key: 'kidWalkLeft',
            repeat: -1,
            frameRate: 10,
            frames: scene.anims.generateFrameNames('anims_kid', {
                prefix: 'kid_left_',
                suffix: '.png',
                start: 1,
                end:  2,
                zeroPad: 2
            })
        })
        this.anims.load('kidWalkLeft');

        scene.anims.create({
            key: 'kidWalkRight',
            repeat: -1,
            frameRate: 10,
            frames: scene.anims.generateFrameNames('anims_kid', {
                prefix: 'kid',
                suffix: '.png',
                start: 1,
                end:  2,
                zeroPad: 2
            })
        })
        this.anims.load('kidWalkRight');

        //set scared emote
        this.scaredEmote = scene.add.sprite(x-(this.width/4)-10,
                                         y-(this.height/4), 
                                         'scaredEmote').setOrigin(1,1).setDepth(4).setAlpha(0);
    
        this.shiverTimer = this.scene.time.addEvent({
            delay: 50,
            callback: () => {
                this.x += this.params.shiverAmount;
                this.params.shiverAmount *= -1;
            },
            callbackScope: this,
            paused: true,
            loop: true,
        });

        this.turnExitTimer = undefined; // timer to be declared for not immediately turning to exit
    }

    update(delta) {
        // constrain delta minimum framerate
        delta = Math.min(delta, 20);

        this._state.update();

        // draw debug walkable area rectangle
        this.walkAreaRect.setPosition(this.params.walkAreaLBound, this.y - this.height / 2);
        this.walkAreaRect.setSize((this.params.walkAreaRBound - this.params.walkAreaLBound), this.height);

        // draw target point debug
        this.targetPoint.setPosition(this._state.currState.target, this.y);

        // // calculate the slowly decreasing scare level
        // if(this.params.scareLevelCurr > 0){
        //     this.params.scareLevelCurr -=0.02;
        // }

        // let currLevel = game.levelParams.renderedLevels[game.levelParams.currLevelIndex];

        // // calculate walkable area
        // this.params.walkAreaLBound = currLevel.params.x0 + currLevel.params.borderWidth; // left wall of level
        // this.params.walkAreaRBound = this.params.walkAreaLBound + currLevel.background.width - 2 * currLevel.params.borderWidth; // right wall of level
        // Phaser.Actions.Call(currLevel.moveGroup, (obj) => {
        //     if(obj.y + obj.scale * obj.height / 2 >= this.y - this.height / 2) { // on the correct y plane
        //         if(obj.x > this.params.walkAreaLBound && obj.x < this.x) { // closer than current left bound
        //             this.params.walkAreaLBound = obj.body.bounds.max.x;
        //         }
        //         else if(obj.x < this.params.walkAreaRBound && obj.x > this.x) { // closer than current right bound
        //             this.params.walkAreaRBound = obj.body.bounds.min.x;
        //         }
        //     }
        // });

        // // add safety buffer to walkable area
        // this.params.walkAreaLBound += 5;
        // this.params.walkAreaRBound -= 5;

        // // draw debug walkable area rectangle
        // this.walkAreaRect.setPosition(this.params.walkAreaLBound, this.y - this.height / 2);
        // this.walkAreaRect.setSize((this.params.walkAreaRBound - this.params.walkAreaLBound), this.height);

        // // if barrier moved, readjust distance and cancel exiting and complete 
        // if(this.params.direction == "right" && Math.floor(this.params.distance - (this.params.walkAreaRBound - this.x - this.width / 2)) > 1) {
        //     if(this.params.isMoving) {
        //         this.params.distance = this.params.walkAreaRBound - this.x - this.width / 2;
        //     }
        //     else {
        //         this.params.distance = 0;
        //     }
        //     this.params.exiting = false;
        //     game.levelParams.complete = false;
        //     console.log("path readjusted " + Math.floor(this.params.distance - (this.params.walkAreaRBound - this.x - this.width / 2)));
        // }
        // else if(this.params.direction == "left" && Math.floor(this.params.distance - (this.x - this.width / 2 - this.params.walkAreaLBound)) > 1) {
        //     if(this.params.isMoving) {
        //         this.params.distance = this.x - this.width / 2 - this.params.walkAreaLBound;
        //     }
        //     else {
        //         this.params.distance = 0;
        //     }
        //     this.params.exiting = false;
        //     game.levelParams.complete = false;
        //     console.log("path readjusted " + Math.floor(this.params.distance - (this.x - this.width / 2 - this.params.walkAreaLBound)));
        // }

        // // test for exit condition
        // if(!game.levelParams.changingLevel && !this.params.isScared) {
        //     let exitLeft = Math.ceil(currLevel.params.x0 + (currLevel.params.exit.x - currLevel.params.exit.width / 2));
        //     let exitRight = Math.floor(currLevel.params.x0 + (currLevel.params.exit.x + currLevel.params.exit.width / 2));
        //     if(exitLeft >= this.params.walkAreaLBound && exitLeft <= this.params.walkAreaRBound && 
        //        this.params.walkAreaRBound -exitLeft > this.width) {
        //         game.levelParams.complete = true;
        //         console.log("level complete");
        //     }
        //     else if(exitRight <= this.params.walkAreaRBound && exitRight >= this.params.walkAreaLBound &&
        //             exitRight - this.params.walkAreaLBound > this.width) {
        //         game.levelParams.complete = true;
        //         console.log("level complete");
        //     }
        //     else {
        //         if(this.params.exiting) { // if kid is on previous exit path, but no longer viable exit
        //             this.moveKid();
        //         }
        //         game.levelParams.complete = false;
        //         this.params.exiting = false;
        //     }
        //     // draw debug exit area rectangle
        //     this.exitAreaRect.setPosition(exitLeft, this.y - this.height / 2);
        //     this.exitAreaRect.setSize((exitRight - exitLeft), this.height);
        // }
        
        // // if just stopped moving, reset timer
        // if(this.params.distance <= 0 && this.params.isMoving == true) { // end of calculated walk distance (or within 1 pixel)
        //     this.scene.wanderTimer.elapsed = 0;
        //     this.scene.wanderTimer.paused = false;
        //     this.params.isMoving = false;
        //     if(this.params.isScared) { // turn kid back around
        //         this.cowerLookBackTimer = this.scene.time.addEvent({
        //             delay: 500,
        //             callback: () => {
        //                 this.params.direction = (this.params.direction == "left") ? "right" : "left";
        //                 this.setFlip(this.params.direction == "left");
        //                 this.params.isScared = false;
        //             },
        //             callbackScope: this,
        //         });
        //     }
        // }
        // else if(this.params.distance > 0 && this.params.isMoving == false) {
        //     this.params.distance = 0;
        // }
        
        // // handle exiting
        // if(game.levelParams.complete && !this.params.isScared) {
        //     // get rid of toggle UI
        //     //if(this.scene.ghost.isPossessing){
        //     //    this.scene.ghost.target.makeToggleInvis();
        //     //}
            
        //     if(!this.params.exiting) { // level complete but path not yet set)
        //         this.scene.time.addEvent({ // wait 1 second, then turn to exit
        //             delay: 1000,
        //             callback: () => {
        //                 if(this.params.distance > 0) { // exit to right of kid
        //                     this.setFlipX(false);
        //                     this.params.direction = "right";
        //                     this.params.exiting = true;
        //                 }
        //                 else { // exit to left of kid
        //                     this.setFlipX(true);
        //                     this.params.direction = "left";
        //                     this.params.distance = -this.params.distance;
        //                     this.params.exiting = true;
        //                 }
        //                 this.params.distance = currLevel.params.exit.x + currLevel.params.x0 - this.x;
        //                 console.log("exiting");
        //             },
        //             callbackScope: this,
        //         });
                
        //         this.params.isMoving = true;
        //         this.params.exiting = true;
        //         this.scene.wanderTimer.paused = true;
        //         this.params.speed = 3;
        //         console.log("exit path set");
        //     }
        //     else if(Math.floor(currLevel.params.exit.x - (this.x + (this.params.direction == "left" ? -1 : 1) * this.params.distance) > 0)) { // if exiting but path borked
        //         this.params.exiting = false;
        //     }
        //     else if(this.x - this.width / 2 > currLevel.params.x0 + (currLevel.params.exit.x - currLevel.params.exit.width / 2) &&
        //             this.x + this.width / 2 < currLevel.params.x0 + (currLevel.params.exit.x + currLevel.params.exit.width / 2)) { // if completely overlapping with exit
        //         this.scene.nextLevel(this.scene.count % 3 + 1);
        //         ++this.scene.count;
        //         this.params.isMoving = false;
        //         this.scaredEmote.setAlpha(0); //reset scared emote since kid is exiting
        //         console.log("leaving level");
        //     }
        // }

        // // calculate movement
        // if(this.params.isMoving) {
        //     if(this.params.direction == "right") {
        //         this.x +=this.params.speed * delta / 40;
        //     }
        //     else {
        //         this.x -=this.params.speed * delta / 40;
        //     }
        //     this.params.distance -= this.params.speed * delta / 40;
        // }

        // // set scaredEmote position
        // this.scaredEmote.setPosition(this.x-(this.width/4)-10, this.y-(this.height/4));

        // // set high scare effects
        // if(!this.params.exiting && !this.params.isScared) {
        //     if(this.params.scareLevelCurr >= this.params.scareLevelHigh) {
        //         this.shiverTimer.paused = false;
        //         this.params.speed = 2.5;
        //     }
        //     else {
        //         this.shiverTimer.paused = true;
        //         this.params.speed = 1;
        //     }
        // }

        // // draw target point debug
        // if(this.params.direction == "left") {
        //     this.targetPoint.setPosition(this.x - this.params.distance, this.y);
        // }
        // else {
        //     this.targetPoint.setPosition(this.x + this.params.distance, this.y);
        // }
    }

    // kid wandering around randomly
    moveKid() {
        let rightPercent = Math.floor(100 * (this.params.walkAreaRBound - this.x) / (this.params.walkAreaRBound - this.params.walkAreaLBound)); // percentage of walkable area to right of kid
        let randNumber;
        if(this.params.scareLevelCurr >= this.params.scareLevelHigh) {
            randNumber = Phaser.Math.Between(1, 75);
        }
        else {
            randNumber = Phaser.Math.Between(1, 100);
        }
        switch(true) {
            case (randNumber < rightPercent / 2): // move right (0 to rightPercentage / 2)
                this.scene.wanderTimer.paused = true;
                this.params.direction = "right";
                this.setFlipX(false);
                this.params.isMoving = true;
                // calculate random location between kid and right bound
                this.setTarget(Phaser.Math.Between(this.x, this.params.walkAreaRBound));
                break;
            case (randNumber < 50): // move left (rightPercentage / 2 to 50)
                this.scene.wanderTimer.paused = true;
                this.params.direction = "left";
                this.setFlipX(true);
                this.params.isMoving = true;
                // calculate random location between kid and left bound
                this.setTarget(Phaser.Math.Between(this.params.walkAreaLBound, this.x));
                break;
            case (randNumber < 75): // idle turn (50 to 75)
                this.params.direction = (this.params.direction == "left") ? "right" : "left";
                this.setFlip(this.params.direction == "left");
                this.params.isMoving = false;
                this.scene.wanderTimer.elapsed = 0;
                this.scene.wanderTimer.paused = false;
                this.setTarget(this.x);
                break;
            case (randNumber < 100): // idle no turn ( 75 to 100)
                this.params.isMoving = false;
                this.scene.wanderTimer.elapsed = 0;
                this.scene.wanderTimer.paused = false;
                this.setTarget(this.x);
        }

        // when scare level is 75%+, kid starts with more erratic wandering
        // STILL IN TESTING
        if(this.params.scareLevelCurr >= this.params.scareLevelHigh) {
            console.log("kid is very scared");
            this.scene.wanderTimer.delay = Math.floor((Math.random() * 1500) + 700);
        }
        else {
            this.scene.wanderTimer.delay = Math.floor((Math.random() * 5000) + 2000); //selects delay randomly in a range
        }
    }

    // checks if object is perceivable by kid
    scaredBy(obj, scareAmount, powerAmount) {
        //check visual scares
        console.log(obj.cooldown);
        let scared = false;
        if(obj.params.visual && !obj.cooldown) {
            let side = (this.x - obj.x > 0) ? "left":"right"; // which side of the kid the object is on
            if(side === this.params.direction) {
                this.params.scareLevelCurr += scareAmount;
                //console.log("scared by: " + obj.params.name);
                this.scene.ghost.paranormalStrengthCurr += powerAmount;
                scared = true;
            }
        }
        //check auditory scares
        if(obj.params.auditory && this.getCenter().distance(obj.getCenter()) <= obj.params.range && !obj.cooldown) {
            this.params.scareLevelCurr += scareAmount;
            this.scene.ghost.paranormalStrengthCurr += powerAmount;
            scared = true;
            //console.log("scared by: " + obj.params.name);
        }
        
        // make the scared emote visible
        if(scared){
            this.scaredEmote.setAlpha(1);
            this.scaredEmoteTiemr = this.scene.time.addEvent({
                delay: 200,
                callback: () => {this.scaredEmote.alpha -= .05},
                callbackScope: this,
                repeat: 20,
            });
        }

        // if scareLevelCurr exceeds the max then set it to the max
        if(this.params.scareLevelCurr > this.params.scareLevelMax){
            this.params.scareLevelCurr = this.params.scareLevelMax;
        }

        // if paranormalStrengthCurr exceeds the max then set it to the max
        if(this.scene.ghost.paranormalStrengthCurr > this.scene.ghost.paranormalStrengthMax){
            this.scene.ghost.paranormalStrengthCurr = this.scene.ghost.paranormalStrengthMax;
        }

        // run away after .5 seconds
        if(scared && !this.params.isScared) { // if just scared
            this.scene.wanderTimer.paused = true;
            this.params.isScared = true;
            this.params.isMoving = false;
            this.runAwayTimer = this.scene.time.addEvent({
                delay: 500,
                callback: () => {
                    this.params.direction = (this.x - obj.x > 0) ? "right":"left"; // which way to run away from it
                    if(this.params.direction == "right") {
                        this.params.distance = this.params.walkAreaRBound - this.x - this.width / 2;
                        this.scene.wanderTimer.paused = true;
                        this.params.speed = 4;
                        //console.log("right");
                    }
                    if(this.params.direction == "left") {
                        this.params.distance = this.x - this.width / 2 - this.params.walkAreaLBound;
                        this.scene.wanderTimer.paused = true;
                        this.params.speed = 4;
                        //console.log("left");
                    }
                    this.setFlipX(this.params.direction == "left");
                    this.params.isMoving = true;
                    this.params.exiting = false;
                },
                callbackScope: this,
            });
        }
    }

    // sets up animation for entering new level
    enterLevel() {
        let currLevel = game.levelParams.renderedLevels[game.levelParams.currLevelIndex];

        // set position with left side against entrance coordinates
        this.x = currLevel.params.x0 + currLevel.params.entrance.x + this.width;
        this.y = currLevel.params.y0 + currLevel.background.height - 2 * currLevel.params.borderWidth - 65;

        // set initial crop of 0% visible
        this.params.showPercent = 0;
        this.setCrop(0, 0, this.params.showPercent, this.height);
        this.alpha = 1;

        // stop wander movement (so kid doesn't walk off level if in movement already)
        this.params.isMoving = false;

        // wait 1 seconds before entering level
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {this.enterNextLevel.paused = false;},
            callbackScope: this,
        });

        // slide enter into level from stairway
        this.enterNextLevel = this.scene.time.addEvent({
            delay: 10,
            callback: () => {
                if(this.params.showPercent < 100) {
                    this.params.showPercent += 1;
                    this.setCrop(0, 0, (this.params.showPercent / 100) * this.width, this.height);
                    this.x -= this.width / 100;
                }
                else {
                    this.scene.tweens.add({
                        targets: this,
                        x: game.levelParams.currLevel.params.x0 + game.levelParams.currLevel.params.entrance.x - 30,
                        y: currLevel.params.y0 + currLevel.background.height - 2 * currLevel.params.borderWidth,
                        ease: 'Linear',
                        duration: 1000,
                        repeat: 0,
                        onComplete: () => {
                            this.isCropped = false;
                            game.levelParams.changingLevel = false;
                            this.params.exiting = false;
                            this.scene.wanderTimer.paused = false;
                            game.levelParams.changingLevel = false;
                            this.body.collisionFilter.mask = 57; // turn on world bounds collision
                        }
                    });
                }
            },
            callbackScope: this,
            repeat: 100,
            paused: true,
        });
    }

    // change target in idle state
    setTarget(target) {
        this._state.currState.target = target;
    }

    // calculate walkable area
    walkableAreaUpdate() {
        // shorthand for current active level
        let currLevel = game.levelParams.renderedLevels[game.levelParams.currLevelIndex];

        this.params.walkAreaLBound = currLevel.params.x0 + currLevel.params.borderWidth; // left wall of level
        this.params.walkAreaRBound = this.params.walkAreaLBound + currLevel.background.width - 2 * currLevel.params.borderWidth; // right wall of level
        Phaser.Actions.Call(currLevel.moveGroup, (obj) => {
            if(obj.y + obj.scale * obj.height / 2 >= this.y - this.height / 2) { // on the correct y plane
                if(obj.x > this.params.walkAreaLBound && obj.x < this.x) { // closer than current left bound
                    this.params.walkAreaLBound = obj.body.bounds.max.x;
                }
                else if(obj.x < this.params.walkAreaRBound && obj.x > this.x) { // closer than current right bound
                    this.params.walkAreaRBound = obj.body.bounds.min.x;
                }
            }
        });

        // add safety buffer to walkable area + kid width
        this.params.walkAreaLBound += 5 + this.width / 2;
        this.params.walkAreaRBound -= 5 + this.width / 2;
    }

    // test if viable path to exit
    canExit() {
        // shorthand for current active level
        let currLevel = game.levelParams.renderedLevels[game.levelParams.currLevelIndex];

        let exitLeft = Math.ceil(currLevel.params.x0 + (currLevel.params.exit.x - currLevel.params.exit.width / 2));
        let exitRight = Math.floor(currLevel.params.x0 + (currLevel.params.exit.x + currLevel.params.exit.width / 2));
        if(exitLeft >= this.params.walkAreaLBound && exitLeft <= this.params.walkAreaRBound && 
                this.params.walkAreaRBound - exitLeft > this.width / 2 + 3) {
            return true;
        }
        else if(exitRight <= this.params.walkAreaRBound && exitRight >= this.params.walkAreaLBound &&
                exitRight - this.params.walkAreaLBound > this.width / 2 + 3) {
            return true;
        }
        return false;
    }

    // update decreasing scare level
    updateScareLevel() {
        if(this.params.scareLevelCurr > 0){
            this.params.scareLevelCurr -=0.02;
        }
    }

    // check if fully overlapping exit
    atExit() {
        // shorthand for current active level
        let currLevel = game.levelParams.renderedLevels[game.levelParams.currLevelIndex];

        if(this.x - this.width / 2 > currLevel.params.x0 + (currLevel.params.exit.x - currLevel.params.exit.width / 2) &&
                this.x + this.width / 2 < currLevel.params.x0 + (currLevel.params.exit.x + currLevel.params.exit.width / 2)) { // if completely overlapping with exit
            return true;
        }
        return false;
    }

    // handle idle state
    idleUpdate() {
        // update decreasing scare level
        this.kid.updateScareLevel();

        // set speed
        let speed = this.kid.params.scareLevelCurr > this.kid.params.scareLevelHigh ? this.speed.highScare : this.speed.base;
        this.kid.shiverTimer.paused = this.kid.params.scareLevelCurr > this.kid.params.scareLevelHigh ? false : true;

        // update walkable area
        this.kid.walkableAreaUpdate();

        // check that current path is still within bounds, otherwise stop moving and restart wander timer
        if(this.target > this.kid.params.walkAreaRBound || this.target < this.kid.params.walkAreaLBound) {
            this.kid.scene.wanderTimer.elapsed = 0;
            this.kid.scene.wanderTimer.paused = false;
            this.kid.params.isMoving = false;
            this.target = this.kid.x;
        }

        // if kid outside walkable area, reset target to closest walkable point
        if(this.kid.x > this.kid.params.walkAreaRBound || this.kid.x < this.kid.params.walkAreaLBound) {
            this.target = this.kid.x > this.kid.params.walkAreaRBound ? this.kid.params.walkAreaRBound - 1 : this.kid.params.walkAreaLBound;
            this.kid.params.isMoving = true;
            this.kid.scene.wanderTimer.paused = true;
        }

        // either move or stop depending on relative position to goal point
        if(this.kid.params.isMoving) {
            let stopped = false;
            if(this.kid.x == this.target) { // exactly at point
                stopped = true;
            }
            else if((this.kid.params.direction == "left" && this.kid.x < this.target) ||  // if past point to left
                    (this.kid.params.direction == "right" && this.kid.x > this.target)) { // if past point to right
                this.target = this.kid.x;
                stopped = true;
            }
            else { // set frame movement (using enum to apply direction)
                this.kid.x += speed * (this.kid.params.direction == "left" ? -1 : 1);
            }

            if(stopped) { // set up timer for next move
                this.kid.scene.wanderTimer.elapsed = 0;
                this.kid.scene.wanderTimer.paused = false;
                this.kid.params.isMoving = false;
            }
        }

        // test if must change states to exit
        if(this.kid.canExit()) {
            this.kid.params.isMoving = false;
            this.kid.scene.wanderTimer.paused = true;

            // if facing away from exit, wait 1 second before turning to exit
            if(this.turnExitTimer === undefined && this.kid.params.direction != (this.kid.x - game.levelParams.currLevel.params.exit.x > 0 ? "left" : "right")) {
                console.log("making exit turn timer");
                this.turnExitTimer = this.kid.scene.time.addEvent({
                    delay: 500,
                    callback: () => {
                        if(this.kid.canExit()) { // only exit if can exit
                            this.kid._state.setState("exiting");
                        }
                        else {
                            this.kid.scene.wanderTimer.paused = false;
                        }
                        this.turnExitTimer = undefined;
                    },
                    callbackScope: this,
                    loop: false,
                });
            }
            else if (this.turnExitTimer === undefined) {
                this.kid._state.setState("exiting");
            }
        }

        // set scaredEmote position
        this.kid.scaredEmote.setPosition(this.kid.x-(this.kid.width/4)-10, this.kid.y-(this.kid.height/4));
    }

    idleSwitchTo() {
        if(this.kid.scene.wanderTimer != undefined) {
            this.kid.scene.wanderTimer.paused = false;
        }

        this.target = this.kid.x;
        
        console.log("switched to idle");
    }

    // handle scared state
    scaredUpdate() {
        return;
    }

    scaredSwitchTo() {
        console.log("switched to scared");
    }

    // handle exiting state
    exitingUpdate() {
        this.kid.updateScareLevel();
        this.kid.walkableAreaUpdate();

        // check if overlapping exit enough to leave level
        if(this.kid.atExit()) {
            this.kid.scene.nextLevel(this.kid.scene.count % 3 + 1);
            ++this.kid.scene.count;
            this.kid.params.isMoving = false;
            this.kid.scaredEmote.setAlpha(0); //reset scared emote since kid is exiting
            console.log("leaving level");
            this.kid._state.setState("idle");
        }

        // move toward exit, if exit still accessable
        if(this.kid.canExit()) {
            this.kid.x += this.speed * (this.kid.params.direction == "left" ? -1 : 1);
        }
        else { // if no viable path, return to idle state
            this.kid._state.setState("idle");
        }

        // if stuck in limbo, cry for help and hope for the best
        if(this.kid.params.direction != (this.kid.x - game.levelParams.currLevel.params.exit.x > 0 ? "left" : "right")) {
            console.log("halp plz");
            this.kid._state.setState("idle");
        }
    }

    exitingSwitchTo() {
        this.kid.scene.wanderTimer.paused = true;
        this.kid.params.isMoving = true;
        this.kid.params.direction = (this.kid.x - game.levelParams.currLevel.params.exit.x > 0 ? "left" : "right");
        this.kid.setFlipX(this.kid.params.direction == "left");
        this.kid.setTarget(game.levelParams.currLevel.params.exit.x + game.levelParams.currLevel.params.x0);

        console.log("switched to exiting");
    }

    // handle changing level
    changingLevelUpdate() {
        return;
    }

    changingLevelSwitchTo() {
        console.log("switched to changing level");
    }
}