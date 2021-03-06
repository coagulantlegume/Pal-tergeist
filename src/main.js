/*
    Pal-tergeist
    Contributors:
        Alec Wolf: programming level management, structuring code, physics implementation, event management, and kid ‘AI’
        Daniel Liao: artist, programming, UI, level design
        Nathan Huynh: audio producer, title/credits, programming, UI
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
    scene: [Loading, Cutscene, Intro, Play, Outro, Menu, Credit],
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 4,
            },
            debug: false, // show bounding boxes
        }
    }
};

let game = new Phaser.Game(config);

// define game settings
game.settings = {
    // top of highest currently drawn level
    ceiling: config.height,
    wanderSpeed: 30, // walking speed when kid wanders around
};
game.levelParams = {
    // dynamic array of all currently rendered levels
    renderedLevels: [],
    currLevel: 0,
    currLevelIndex: -1,
    numLevels: 3,
};

// reserve keyboard vars
let keyLevelUp, keyToggle, keyRight, keyLeft, keyUp, keyDown, keyEscape;

let keySpace, keyReset;

//Used to see if we play the intro cutscene before game starts
let played = false;
let fromCutscene = false;