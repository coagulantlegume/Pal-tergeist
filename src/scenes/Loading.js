class Loading extends Phaser.Scene {

	constructor() {
		super("loadScreen");
	}

	preload() {
		this.load.image('ghostLoad', './assets/textures/ghost.png');

		// center alignments for canvas
		let centerX = game.config.width/2;
		let centerY = game.config.height/2;

		// makes loading bar ui
		this.graphics = this.add.graphics();
		this.newGraphics = this.add.graphics();
		var progressBar = new Phaser.Geom.Rectangle(545, 280, 400, 50);
		var progressBarFill = new Phaser.Geom.Rectangle(550, 285, 290, 40);

		this.graphics.fillStyle(0xffffff, 1);
		this.graphics.fillRectShape(progressBar);

		this.newGraphics.fillStyle(0x3ed7fd, 1);
		this.newGraphics.fillRectShape(progressBarFill);

		var loadingText = this.add.text(630,340,"Loading: ", { fontFamily: 'Comic Sans MS', fontSize: '32px', fill: '#FFF' });

		// the more images you load, the longer the load time
		this.load.image('background', 'images/tut/background.png');
		for(var i = 0;i<20;i++) {
			this.load.image('background_' + i, 'images/tut/background.png');
		}

		this.load.on('progress', this.updateBar, {newGraphics:this.newGraphics,loadingText:loadingText});
		this.load.on('complete', this.complete, {scene:this.scene});

		//==ASSETS==
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
        this.load.json('lightCollision', './assets/textures/lights_collision.json');
        
        this.load.image('tub', './assets/textures/tub.png');
        this.load.image('tubHover', './assets/textures/tubHover.png');
        this.load.json('tubCollision', './assets/textures/tub.xml.json');
        
        this.load.image('box', './assets/textures/box.png');
        this.load.image('boxHover', './assets/textures/boxHover.png');
        
        this.load.image('cabinet', './assets/textures/cabinet.png');
        this.load.image('cabinetHover', './assets/textures/cabinetHover.png');
        
        this.load.image('lamp', './assets/textures/lamp.png');
        this.load.image('lampHover', './assets/textures/lampHover.png');
        this.load.json('lampCollision', './assets/textures/lamp_collision.json');
        
        
        this.load.image('mirror', './assets/textures/mirror.png');
        this.load.image('mirrorHover', './assets/textures/mirrorHover.png');
        
        this.load.image('shelf', './assets/textures/shelf.png');
        this.load.image('shelfHover', './assets/textures/shelf.png');
        
        this.load.image('balloon', './assets/textures/balloon.png');
        this.load.image('balloonHover', './assets/textures/balloonHover.png');
        this.load.json('balloonCollision', './assets/textures/balloon_collision.json');
        

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
        this.load.json('kidCollision', './assets/textures/kid_collision.json');
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
	
	create(){
		// center alignments for canvas
		let centerX = game.config.width/2;
		let centerY = game.config.height/2;

		var ghost = this.add.image(centerX, centerY, 'ghostLoad');

		var ghostBob = this.tweens.add({
			targets: ghost,
			y: '-=50',
			ease: 'Sine.easeInOut',
			duration: 2000,
			yoyo: true,
			repeat: 100
		});

		console.log(ghostBob);
	}
	
	// displays percent value of loading
    updateBar(percentage) {

		// the updating loading bar
        this.newGraphics.clear();
        this.newGraphics.fillStyle(0x3ed7fd, 1);
        this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(550, 285, percentage*390, 40));
                
        percentage = percentage * 100;
        this.loadingText.setText("Loading: " + percentage.toFixed(2) + "%");
        //console.log("P:" + percentage);
        
    }

    complete() {
		//console.log("COMPLETE!");
		this.scene.start("menuScene");
	}

}