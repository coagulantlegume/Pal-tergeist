/*
    SUPERSTAR
    5/4/2020
    Collaborators:
       - Alec Wolf
       - Daniel Liao
       - Nathan Huynh
    Creative Tilt:
        We used timed key presses to represent poses which are being struck at different points
    across a runway that the character walks which is similar to beatmap games but in a way
    we haven't seen before in an endless runner. For our color scheme we decided to stick to
    a clean, minimalist aesthetic with pops of bold colors on a grayscale backdrop. As far as
    programming techniques, we tried to organize our code in a way that we could manipulate
    large parts of the layout and mechanics on the fly from game settings in this main.js file.
    For example the number of lanes, width of the runway, position of the runway, and x position
    of the player can be changed in the settings and propegate to the rest of the game.
*/
let config = {
    type: Phaser.CANVAS,
    width: 1280,
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
    scrollSpeed: 0,
    runwayWidth: 345,
    numLanes: 4,
    spawnRate: 0,
    poseDist: 0,
    distanceCounter: 0,
    runwaytopY: 102,
    playerXpos: 215,
    stages: {
        currentStage: 1,
        // Stage 1
        scrollSpeed1: 300,
        spawnRate1: 2000,
        poseDist1: 1.5,
        duration1: 20000,
        // Stage 2
        scrollSpeed2: 400,
        spawnRate2: 700,
        poseDist2: 2.,
        duration2: 20000,
        // Stage 3
        scrollSpeed3: 550,
        spawnRate3: 500,
        poseDist3: 2.5,
        duration3: 20000,
        // Stage 4
        scrollSpeed4: 700,
        spawnRate4: 300,
        poseDist4: 3,
        duration4: 20000,
    },
}

// reserve keyboard vars
let Up, Down, poseKeys, keySpace, keyEnter;                     