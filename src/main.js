/*
    
*/

"use strict";

let config = {
    type: Phaser.CANVAS,
    width: 1500,
    height: 700,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Loading, Intro, Play, Outro, Menu, Credit],
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 4,
            },
            debug: true, // show bounding boxes
        }
    }
};

let game = new Phaser.Game(config);

// define game settings
game.settings = {
    // top of highest currently drawn level
    ceiling: config.height,
    wanderSpeed: 30, // walking speed when kid wanders around
    breakpointFriendly: false,
};
game.levelParams = {
    // dynamic array of all currently rendered levels
    renderedLevels: [],
    currLevel: 0,
    currLevelIndex: -1,
};

// reserve keyboard vars
let keyLevelUp, keyToggle, keyRight, keyLeft, keyUp, keyDown;

let keySpace, keyReset;