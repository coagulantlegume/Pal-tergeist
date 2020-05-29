// Kid prefab
class Kid extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene.matter.world, x, y, texture, frame);

        this.setDepth(2);

        this.params = {
            walkAreaLBound: undefined,  // left (min) y value of walkable area
            walkAreaRBound: undefined,  // right (max) y value of walkable area
            direction: "right",         // direction kid is walking in
            isMoving: false,            // whether kid is currently walking or standing still
            distance: 0,                // distance to travel
            speed: 1.5,
            exiting: false,             // if kid currently walking to exit (calculated path)
            scareLevelMax: 100,
            scareLevelHigh: 75,
            scareLevelCurr: 25,
            shiverAmount: .75,          // the distance in each direction that the kid shivers in
            showPercent: 100,           // the percentage of the sprite visible(from left side)
        }

        // make static (so it can be drawn outside of world area)
        this.setStatic(true);

        // set collision group and mask 
        this.setCollisionGroup(this.scene.kidCollision);
        this.setCollidesWith([this.scene.moveCollision]);

        // set center
        this.setOrigin(0.5, 0.5);

        // add walkable area debug rectangle
        //this.walkAreaRect = this.scene.add.rectangle(this.scene,0,0,0,0,0xFACADE);
        //this.walkAreaRect.alpha = 0.5;
        //this.walkAreaRect.setOrigin(0, 0.5);
        //this.walkAreaRect.setDepth(3);
        
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
    }

    update(delta) {
        // calculate the slowly decreasing scare level
        if(this.params.scareLevelCurr > 0){
            this.params.scareLevelCurr -=0.02;
        }

        let currLevel = game.levelParams.renderedLevels[game.levelParams.currLevelIndex];

        // calculate walkable area
        this.params.walkAreaLBound = currLevel.params.x0 + currLevel.params.borderWidth; // left wall of level
        this.params.walkAreaRBound = this.params.walkAreaLBound + currLevel.background.width - 2 * currLevel.params.borderWidth; // right wall of level
        Phaser.Actions.Call(currLevel.moveGroup, (obj) => {
            if(obj.y + obj.scale * obj.height / 2 >= this.y - this.height / 2) { // on the correct y plane
                if(obj.x > this.params.walkAreaLBound && obj.x < this.x) { // closer than current left bound
                    this.params.walkAreaLBound = obj.x + (obj.width * obj.scale) / 2;
                }
                else if(obj.x < this.params.walkAreaRBound && obj.x > this.x) { // closer than current right bound
                    this.params.walkAreaRBound = obj.x - (obj.width * obj.scale) / 2;
                }
            }
        });

        // add safety buffer to walkable area
        this.params.walkAreaLBound += 5;
        this.params.walkAreaRBound -= 5;

        // draw debug walkable area rectangle
        //this.walkAreaRect.setPosition(this.params.walkAreaLBound, this.y - this.height / 2);
        //this.walkAreaRect.setSize((this.params.walkAreaRBound - this.params.walkAreaLBound), this.height);

        // test for exit condition
        if(!game.levelParams.changingLevel) {
            let exitLeft = Math.ceil(currLevel.params.x0 + (currLevel.params.exit.x - currLevel.params.exit.width / 2));
            let exitRight = Math.floor(currLevel.params.x0 + (currLevel.params.exit.x + currLevel.params.exit.width / 2));
            if(exitLeft >= this.params.walkAreaLBound && exitLeft <= this.params.walkAreaRBound && 
               this.params.walkAreaRBound -exitLeft > this.width) {
                game.levelParams.complete = true;
            }
            else if(exitRight <= this.params.walkAreaRBound && exitRight >= this.params.walkAreaLBound &&
                    exitRight - this.params.walkAreaLBound > this.width) {
                game.levelParams.complete = true;
            }
            else {
                if(this.params.exiting) { // if kid is on previous exit path, but no longer viable exit
                    this.moveKid();
                }
                game.levelParams.complete = false;
                this.params.exiting = false;
            }
        }

        // if barrier moved, readjust distance and cancel exiting and complete 
        if(this.params.direction == "right") {
            this.params.distance = Math.min(this.params.distance, this.params.walkAreaRBound - this.x - this.width / 2);
        }
        else if(this.direction == "left") {
            this.params.distance = Math.min(this.params.distance, this.x - this.width / 2 - this.params.walkAreaLBound);
        }
        
        // if just stopped moving, reset timer
        if(this.params.distance <= 0 && this.params.isMoving == true && !this.params.exiting) { // end of calculated walk distance (or within 1 pixel)
            this.scene.wanderTimer.paused = false; // take another move immediately
            this.params.isMoving = false;
        }
        
        if(game.levelParams.complete) {
            // get rid of toggle UI
            //if(this.scene.ghost.isPossessing){
            //    this.scene.ghost.target.makeToggleInvis();
            //}
            
            if(!this.params.exiting) { // level complete but path not yet set)
                this.params.distance = currLevel.params.exit.x + currLevel.params.x0 - this.x;
                if(this.params.distance > 0) { // exit to right of kid
                    this.setFlipX(false);
                    this.params.direction = "right";
                    this.params.exiting = true;
                }
                else { // exit to left of kid
                    this.setFlipX(true);
                    this.params.direction = "left";
                    this.params.distance = -this.params.distance;
                    this.params.exiting = true;
                }
                this.params.isMoving = true;
                this.params.exiting = true;
                this.scene.wanderTimer.paused = true;
                this.params.speed = 3;
            }
            else if(this.x - this.width / 2 > currLevel.params.x0 + (currLevel.params.exit.x - currLevel.params.exit.width / 2) &&
                    this.x + this.width / 2 < currLevel.params.x0 + (currLevel.params.exit.x + currLevel.params.exit.width / 2)) { // if completely overlapping with exit
                this.scene.nextLevel(this.scene.count % 3 + 1);
                ++this.scene.count;
                this.params.isMoving = false;
                this.scaredEmote.setAlpha(0); //reset scared emote since kid is exiting
            }
        }

        // calculate movement TODO: lerp
        if(this.params.isMoving) {
            if(this.params.direction == "right") {
                this.x += this.params.speed * (delta / 40);
                this.params.distance -= this.params.speed * (delta / 40); 
            }
            else {
                this.x -= this.params.speed * (delta / 40);
                this.params.distance -= this.params.speed * (delta / 40); 
            }
        }
        // set scaredEmote position
        this.scaredEmote.setPosition(this.x-(this.width/4)-10, this.y-(this.height/4));

        // set high scare effects
        if(!this.params.exiting) {
            if(this.params.scareLevelCurr >= this.params.scareLevelHigh) {
                this.shiverTimer.paused = false;
                this.params.speed = 2.5;
            }
            else {
                this.shiverTimer.paused = true;
                this.params.speed = 1;
            }
        }
    }

    // kid wandering around randomly
    moveKid() {
        let randNumber;
        if(this.params.scareLevelCurr >= this.params.scareLevelHigh) {
            randNumber = Math.floor((Math.random() * 3) + 1);
        }
        else {
            randNumber = Math.floor((Math.random() * 5) + 1);
        }
        switch(randNumber) {
            case 1: // move right
                this.scene.wanderTimer.paused = true;
                this.params.direction = "right";
                this.setFlipX(false);
                this.params.isMoving = true;
                // calculate random location between kid and right bound
                this.params.distance = Math.random() * (this.params.walkAreaRBound - this.x - this.width / 2);
                break;
            case 2: // move left
                this.scene.wanderTimer.paused = true;
                this.params.direction = "left";
                this.setFlipX(true);
                this.params.isMoving = true;
                // calculate random location between kid and left bound
                this.params.distance = Math.random() * (this.x - this.width / 2 - this.params.walkAreaLBound);
                break;
            case 3: // idle turn
                this.params.direction = (this.params.direction == "left") ? "right" : "left";
                this.setFlip(this.params.direction == "left");
                this.params.isMoving = false;
                this.scene.wanderTimer.elapsed = 0;
                this.scene.wanderTimer.paused = false;
                break;
            case 4: // idle no turn
                this.params.isMoving = false;
                this.scene.wanderTimer.elapsed = 0;
                this.scene.wanderTimer.paused = false;
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
    }

    // sets up animation for entering new level
    enterLevel() {
        let currLevel = game.levelParams.renderedLevels[game.levelParams.currLevelIndex];
        this.x = currLevel.params.entrance.x + this.width / 2;
        this.y = currLevel.params.y0 + currLevel.background.height - 2 * currLevel.params.borderWidth;
        this.params.showPercent = 0;
        this.setCrop(0, 0, this.params.showPercent, this.height);
        this.alpha = 1;

        this.enterNextLevel = this.scene.time.addEvent({
            delay: 10,
            callback: () => {
                if(this.params.showPercent < 100) {
                    this.params.showPercent += 1;
                    this.setCrop(0, 0, this.params.showPercent * this.width, this.height);
                    this.x -= 1;
                }
                else {
                    this.isCropped = false;
                    game.levelParams.changingLevel = false;
                    this.kid.params.exiting = false;
                    this.wanderTimer.paused = false;
                }
            },
            repeat: 99
        });
    }

    // TODO: runFrom({Object}, distance) function for when scare amount is
    // above a given threshhold, with distance -1 for running out of level
    // if level failed.
}