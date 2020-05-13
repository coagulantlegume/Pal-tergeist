/*
    
*/
let config = {
    type: Phaser.CANVAS,
    width: 1500,
    height: 700,
    scene: [Play],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true, // show bounding boxes
        }
    }
};

let game = new Phaser.Game(config);

// define game settings
game.settings = {
    // top of highest currently drawn level
    ceiling: config.height,
};
game.levelParams = {
    // dynamic array of all currently rendered levels
    renderedLevels: [],
    currLevel: 0,
};

// TODO: reserve keyboard vars
let keyLevelUp;