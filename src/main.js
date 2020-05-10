/*
    
*/
let config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    scene: [Menu, Guide, Play, Gameover],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false, // show bounding boxes
        }
    }
};

let game = new Phaser.Game(config);

// define game settings
game.settings = {
    // TODO: add game settings, current level
};

// TODO: reserve keyboard vars                  