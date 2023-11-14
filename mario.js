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
const DEBUG = true;
const PLAYER_OFFSET_X = 3;         // Left edge of view port relative to player
const PLAYER_OFFSET_Y = 11;        // Top edge of view port relative to player
const PIXELS_PER_BLOCK_W = 48;       // Pixel width per block
const PIXELS_PER_BLOCK_H = 48;       // Pixel height per block
const BLOCKS_PER_LEVEL_H = 41;    // Number of blocks in the level - height
const BLOCKS_PER_LEVEL_W = 162;   // Number of blocks in the level - width
// Update once we know the screen dimensions
let BLOCKS_PER_SCREEN_W = 8;         // Number of blocks per view screen - width
let BLOCKS_PER_SCREEN_H = 16;        // Number of blocks per view screen - height
// Player
let PLAYING = false;                // Has the game started ?
let SPRITE_X = -1;                  // Pixel location to draw the player sprite - x               
let SPRITE_Y = -1;                  // Pixel location to draw the player sprite - y
let PLAYER_X = 2;                   // Block location of the player - x
let PLAYER_Y = 13;                  // Block location of the player - y
let PLAYER_ACTION = 0; // 0 = still, +1 = left, +2 = right, +4 = jump
let PLAYER_JUMP = 0;
let POINTS = 0;

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
    frameRate(10);
    createCanvas(windowWidth, windowHeight);
    BACKGROUND.resize((windowHeight/windowWidth)*768, windowHeight);
    // Update these global variables
    BLOCKS_PER_SCREEN_W = windowWidth/PIXELS_PER_BLOCK_W;
    BLOCKS_PER_SCREEN_H = windowHeight/PIXELS_PER_BLOCK_H;
    SPRITE_X = (PLAYER_OFFSET_X+1)*PIXELS_PER_BLOCK_W - 0.5*PIXELS_PER_BLOCK_W - 0.5*P_STILL.width;
    SPRITE_Y = (PLAYER_OFFSET_Y+1)*PIXELS_PER_BLOCK_H - P_STILL.height;

    console.log("Screen resolution is ",windowWidth,"x",windowHeight,".");
    console.log("Block size is ",PIXELS_PER_BLOCK_W,"x",PIXELS_PER_BLOCK_H,".");
    console.log("Blocks in a view port are ",BLOCKS_PER_SCREEN_W," wide, ",BLOCKS_PER_SCREEN_H," high.");
}

function is_collision(im1,x1,y1, im2,x2,y2) {
    if ((x1+im1.width < x2) || (x1 > x2+im2.width) || (y1+im1.height < y2) || (y1 > y2+im2.height)) {
        return false; // there is no collision
    } else {
        return true; // there is a collision
    }
}

function play_game() { // 1/25th of a second
    // Respond to player input
    if (mousePressed) {
        PLAYER_ACTION = 0; // default, do nothing
        for (let i=0; i<touches.length; i++) {
            //console.log("PLAYER_XY",PLAYER_X,PLAYER_Y);
            if (touches[i].x < windowWidth/3) { // left third
                PLAYER_ACTION = 1;
                if ((PLAYER_X > 0) && ((LEVEL[PLAYER_Y][PLAYER_X-1] != "#") && (LEVEL[PLAYER_Y][PLAYER_X-1] != "W"))) {
                    PLAYER_X -= 1;
                }
            } else if (touches[i].x > windowWidth*2/3) { // right third
                PLAYER_ACTION = 2;
                if ((PLAYER_X < BLOCKS_PER_LEVEL_W) && ((LEVEL[PLAYER_Y][PLAYER_X+1] != "#") && (LEVEL[PLAYER_Y][PLAYER_X+1] != "W"))) {
                    PLAYER_X += 1;
                }
            } else { // middle third
                // If we are standing on solid ground, jump
                if ((PLAYER_Y == BLOCKS_PER_LEVEL_H) || (LEVEL[PLAYER_Y+1][PLAYER_X] == "#")) {
                    PLAYER_JUMP = 10;
                }
            }    
        }
    }

    // Are we jumping or falling?
    if (PLAYER_JUMP > 0) { // Jumping
        PLAYER_Y -= 1;
        PLAYER_JUMP -= 1;
    } else if (PLAYER_Y+1 < BLOCKS_PER_LEVEL_H && LEVEL[PLAYER_Y+1][PLAYER_X] != "#") { // Falling
        PLAYER_Y += 1;
    }

    // Collect coins
    if (LEVEL[PLAYER_Y][PLAYER_X] == 'o') {
        LEVEL[PLAYER_Y][PLAYER_X] = '.';
        POINTS += 10;
    } else if (PLAYER_Y>1 && LEVEL[PLAYER_Y-1][PLAYER_X] == 'o') {
        LEVEL[PLAYER_Y-1][PLAYER_X] = '.';
        POINTS += 10;
    }

    // Draw scene
    image(BACKGROUND, 0,0);

    console.log("Current block: X ",PLAYER_X," Y ",PLAYER_Y," Value ",LEVEL[PLAYER_Y][PLAYER_X]);

    let left_edge_block = PLAYER_X - PLAYER_OFFSET_X;
    let top_edge_block = PLAYER_Y - PLAYER_OFFSET_Y; 
    // Iterate over all the blocks in the view port
    for (let y=0; y<BLOCKS_PER_SCREEN_H; y++) {
        for (let x=0; x<BLOCKS_PER_SCREEN_W; x++) {
            // What block to draw at this x,y block?
            let block = 'W'; // default to a "wall" block in case we are asking for a block outside of bounds
            // If we are requesting a location within the level
            if (top_edge_block+y >= 0 && left_edge_block+x >= 0 && top_edge_block+y < BLOCKS_PER_LEVEL_H && left_edge_block+x < BLOCKS_PER_LEVEL_W) {
                block = LEVEL[top_edge_block+y][left_edge_block+x];
            }
            //console.log("Drawing ".block," at ",x,y,(x-VIEW_X)*BLOCK_W, y*BLOCK_H)
            switch (block) {
                case '#': 
                    image(BOX, x*PIXELS_PER_BLOCK_W, y*PIXELS_PER_BLOCK_H, PIXELS_PER_BLOCK_W, PIXELS_PER_BLOCK_H);
                    break;
                case 'W': 
                    image(BOX, x*PIXELS_PER_BLOCK_W, y*PIXELS_PER_BLOCK_H, PIXELS_PER_BLOCK_W, PIXELS_PER_BLOCK_H);
                    break;
                case 'o': 
                    image(COIN, x*PIXELS_PER_BLOCK_W, y*PIXELS_PER_BLOCK_H, PIXELS_PER_BLOCK_W, PIXELS_PER_BLOCK_H);
                    break;
                case '|': 
                    image(OUCH, x*PIXELS_PER_BLOCK_W, y*PIXELS_PER_BLOCK_H, PIXELS_PER_BLOCK_W, PIXELS_PER_BLOCK_H);
                    break;
            }                    
        }
    }

    // Player sprite
    if (PLAYER_ACTION % 10 == 1) { // left
        image(P_LEFT, SPRITE_X, SPRITE_Y);
    } else if (PLAYER_ACTION % 10 == 2) { // right
        image(P_RIGHT, SPRITE_X, SPRITE_Y);
    } else {
        image(P_STILL, SPRITE_X, SPRITE_Y);
    }

    // Highlight the hot spot block
    if (DEBUG) {
        noFill();
        strokeWeight(4);
        stroke('red');
        rect(PLAYER_OFFSET_X*PIXELS_PER_BLOCK_W, PLAYER_OFFSET_Y*PIXELS_PER_BLOCK_H, PIXELS_PER_BLOCK_W, PIXELS_PER_BLOCK_H);    
    }
}

function keyPressed() {
    switch (keyCode) {
        case (UP_ARROW): PLAYER_Y--; break;
        case (DOWN_ARROW): PLAYER_Y++; break;
        case (LEFT_ARROW): PLAYER_X--; break;
        case (RIGHT_ARROW): PLAYER_X++; break;
    }
}

function mousePressed() {
    if (touches) { console.log(touches); } else { console.log('no touch');}
    console.log("mouseXY",mouseX,mouseY);
    // If the game has not yet started
}

function intro_screen() {
    image(BACKGROUND, 0,0);
    textAlign(CENTER, CENTER);
    textSize(40);
    fill(255);
    text('My amazing game', windowWidth/2, windowHeight/3);
    text('Click to start', windowWidth/2, windowHeight*5/6);
}

function draw() { // main game loop
    if (PLAYING) {
        play_game();
    } else {
        intro_screen();
        if (mousePressed) {
            PLAYING = true;
        }
    }
}