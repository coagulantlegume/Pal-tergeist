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

		// console.log(ghostBob);
	}
	
	// displays percent value of loading
    updateBar(percentage) {

		// the updating loading bar
        this.newGraphics.clear();
        this.newGraphics.fillStyle(0x3ed7fd, 1);
        this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(550, 285, percentage*390, 40));
                
        percentage = percentage * 100;
        this.loadingText.setText("Loading: " + percentage.toFixed(2) + "%");
        // console.log("P:" + percentage);
        
    }

    complete() {
		// console.log("COMPLETE!");
		this.scene.start("menuScene");
	}

}