/*
Background tiles: 48px x 48px
View frame: 16 tiles high x whatever wide (proportionally)
Mario animations: 100px x 100px
Background img: 1366 x 768
*/

// Files
let BACKGROUND, FONT
let P_STILL, P_LEFT, P_RIGHT;
let BOX, COIN, OUCH;
let LEVEL;
// Screen viewing variables
let VIEW_X = 2;         // Starting block location of viewport
let VIEW_Y = 18;        // Starting block location of viewport
let VIEW_W = 8;         // Will be updated based on screen dimensions to reflect BLOCK_W
let VIEW_H = 16;        // Will be updated based on screen dimensions to reflect BLOCK_H
let BLOCK_W = 48;       // Pixel width per block
let BLOCK_H = 48;       // Pixel height per block
// Player
let PLAYING = false;
let X = 28 ;
let Y = 0;
let DIRECTION = "still";
let P_MODE = "still";

function preload() { // Load all the media files
    BACKGROUND = loadImage('assets/items/bg_grasslands.png');
    FONT = loadFont('assets/Roboto-Light.ttf');
    BOX = loadImage("assets/items/box.png");
    COIN = loadImage("assets/items/coinGold.png");
    OUCH = loadImage("assets/items/dirtCaveBottom.png");
    P_STILL = loadImage("assets/player/p1_stand.png")
    P_LEFT = loadImage("assets/player/p1_walk.gif")
    P_RIGHT = loadImage("assets/player/p1_walk.gif")
    LEVEL = loadStrings("levels.txt");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    BACKGROUND.resize((windowHeight/windowWidth)*768, windowHeight);
    VIEW_W = windowWidth/BLOCK_W;
    VIEW_H = windowHeight/BLOCK_H;
    console.log("Screen resolution is ",windowWidth,"x",windowHeight,".");
    console.log("Block size is ",BLOCK_W,"x",BLOCK_H,".");
    console.log("Blocks in a view port are ",VIEW_W," wide, ",VIEW_H," high.");

    X = windowWidth/2 - P_STILL.width/2;
    Y = windowHeight - 2*BLOCK_H - P_STILL.height;
    frameRate(25);
}

function is_collision(im1,x1,y1, im2,x2,y2) {
    if ((x1+im1.width < x2) || (x1 > x2+im2.width) || (y1+im1.height < y2) || (y1 > y2+im2.height)) {
        return false; // there is no collision
    } else {
        return true; // there is a collision
    }
}

function play_game() { // 1/25th of a second
    console.log("Playing game",X,Y,"VIEW_X",VIEW_X,"VIEW_Y",VIEW_Y,"VIEW_W",VIEW_W,"VIEW_H",VIEW_H,"BLOCK_W",BLOCK_W,"LEVEL.length",LEVEL.length,"LEVEL[0].length",LEVEL[0].length);
    // Draw scene
    image(BACKGROUND, 0,0);
    //console.log("Viewport range is horizontal ",VIEW_X," to ",VIEW_X+VIEW_W," vertical ",VIEW_Y," to ",VIEW_Y+VIEW_H)
    for (let y=VIEW_Y; y<(VIEW_Y+VIEW_H); y++) {
        for (let x=VIEW_X; x<(VIEW_X+VIEW_W); x++) {
            let block = 'W';
            if (y >= 0 && x >= 0 && y < LEVEL.length && x < LEVEL[y].length) {
                block = LEVEL[y][x];
            }
            //console.log("Drawing ".block," at ",x,y,(x-VIEW_X)*BLOCK_W, y*BLOCK_H)
            switch (block) {
                case '#': 
                    image(BOX, (x-VIEW_X)*BLOCK_W, (y-VIEW_Y)*BLOCK_H, BLOCK_W, BLOCK_H);
                    break;
                case 'W': 
                    image(BOX, (x-VIEW_X)*BLOCK_W, (y-VIEW_Y)*BLOCK_H, BLOCK_W, BLOCK_H);
                    break;
                case 'o': 
                    image(COIN, (x-VIEW_X)*BLOCK_W, (y-VIEW_Y)*BLOCK_H, BLOCK_W, BLOCK_H);
                    break;
                case '|': 
                    image(OUCH, (x-VIEW_X)*BLOCK_W, (y-VIEW_Y)*BLOCK_H, BLOCK_W, BLOCK_H);
                    break;
            }                    
        }
    }
    // Player sprite
    if (P_MODE == "left") {
        image(P_STILL, X, Y);
    } else if (P_MODE == "right") {
        image(P_STILL, X, Y);
    } else {
        image(P_STILL, X, Y);
    }
}

function keyPressed() {
    switch (keyCode) {
        case (UP_ARROW): VIEW_Y--; break;
        case (DOWN_ARROW): VIEW_Y++; break;
        case (LEFT_ARROW): VIEW_X--; break;
        case (RIGHT_ARROW): VIEW_X++; break;
    }
}

function intro_screen() {
    image(BACKGROUND, 0,0);
    textAlign(CENTER, CENTER);
    textSize(40);
    fill(255);
    text('My amazing game', windowWidth/2, windowHeight/3);
    text('Click to start', windowWidth/2, windowHeight*5/6);
    if (mouseIsPressed) {
        PLAYING = true;
        //fullscreen(true);
    }
}

function draw() { // main game loop
    if (PLAYING) {
        play_game();
    } else {
        intro_screen();
    }
}