// PauseMenu prefab
class PauseMenu {
    constructor(scene) {
        this.scene = scene;
        this.isOpen = false;
        let centerX = game.config.width / 2;
        let centerY = game.config.height / 2;
        let buffer  = 100;

        this.menuButton = this.scene.add.sprite(centerX, centerY - buffer, 'menuButton').setName('menuButton').setAlpha(0).setDepth(5);
        this.restartButton = this.scene.add.sprite(centerX, centerY, 'restartButton').setName('restartButton').setAlpha(0).setDepth(5);
        this.resumeButton = this.scene.add.sprite(centerX, centerY + buffer, 'resumeButton').setName('resumeButton').setAlpha(0).setDepth(5);

        // menu button
        this.menuButton.on('pointerdown', () => {
            game.levelParams.renderedLevels = [];
            this.scene.scene.start("menuScene");
        });
        this.menuButton.on('pointerover', () => {
            this.menuButton.setTexture(this.menuButton.name+'Hover');
        });
        this.menuButton.on('pointerout', () => {
            this.menuButton.setTexture(this.menuButton.name);
        });
        this.menuButton.disableInteractive();

        // restart button
        
        this.restartButton.on('pointerdown', () => {
            this.close();
            game.levelParams.currLevel.reset();
        });
        this.restartButton.on('pointerover', () => {
            this.restartButton.setTexture(this.restartButton.name+'Hover');
        });
        this.restartButton.on('pointerout', () => {
            this.restartButton.setTexture(this.restartButton.name);
        });
        this.restartButton.disableInteractive();

        // resume button
        this.resumeButton.on('pointerdown', () => {
            this.close();
        });
        this.resumeButton.on('pointerover', () => {
            this.resumeButton.setTexture(this.resumeButton.name+'Hover');
        });
        this.resumeButton.on('pointerout', () => {
            this.resumeButton.setTexture(this.resumeButton.name);
        });
        this.resumeButton.disableInteractive();
    }

    open() {
        this.isOpen = true;
        this.scene.matter.world.enabled = false;

        this.scene.tweens.add({
            targets: this.scene.blackScreen,
            alpha: { from: 0, to: .5},
            ease: 'Linear',
            duration: 150,
            repeat: 0,
            yoyo: false,
            onComplete: () => { 
                // turn off other listeners if not changing scenes
                if(!game.levelParams.changingLevel) {
                    Phaser.Actions.Call(game.levelParams.currLevel.scareGroup, (obj) => {
                        obj.disableInteractive();
                    });
                    Phaser.Actions.Call(game.levelParams.currLevel.moveGroup, (obj) => {
                        obj.disableInteractive();
                    });
                }

                // menu button
                this.menuButton.setInteractive().setAlpha(1);

                // restart button
                this.restartButton.setInteractive().setAlpha(1);

                // resume button
                this.resumeButton.setInteractive().setAlpha(1);

                this.scene.isPaused = true;
            }
        });
    }

    close() {
        this.scene.tweens.add({
            targets: this.scene.blackScreen,
            alpha: { from: .5, to: 0},
            ease: 'Linear',
            duration: 150,
            repeat: 0,
            yoyo: false,
            onComplete: () => { 
                this.isOpen = false;
                this.scene.matter.world.enabled = true;

                // turn on other listeners if not changing scenes
                if(!game.levelParams.changingLevel) {
                    Phaser.Actions.Call(game.levelParams.currLevel.scareGroup, (obj) => {
                        obj.setInteractive();
                    });
                    Phaser.Actions.Call(game.levelParams.currLevel.moveGroup, (obj) => {
                        obj.setInteractive();
                    });
                }
            
                // menu button
                this.menuButton.disableInteractive().setAlpha(0);
            
                // restart button
                this.restartButton.disableInteractive().setAlpha(0);
            
                // resume button
                this.resumeButton.disableInteractive().setAlpha(0);
            
                this.scene.isPaused = false;
            }
        });
    }
}