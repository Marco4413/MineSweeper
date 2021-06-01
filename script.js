
import { wCanvas, Color, UMath, Font } from "./wCanvas/wcanvas.js";
import { Game, GameDrawStyle, MARK_CELL_SHOW, MARK_CELL_SUSPICIOUS } from "./Game.js";

/*     SETTINGS    */
const BACKGROUND_COLOR = new Color("black");
const GAME_STYLE = new GameDrawStyle(
    BACKGROUND_COLOR,
    [ new Color("green"), new Color("yellow"), new Color("orange") ],
      new Color("green"),
      new Color("red"  ),
      new Color("white"),
      new Color("white")
);

const STROKE_WEIGHT = 0.5;
const TEXT_FONT = new Font("Consolas");
const TEXT_STROKE_COLOR = new Color("white");
const TEXT_FILL_COLOR   = new Color("purple");
const TEXT_SCALE_FACTOR = 1 / 5;

const RESTART_KEY = "r";

const BOMB_CHANCE = 0.263;
const GAME_MIN_COLS = 10;
const GAME_MAX_COLS = 20;
const GAME_MIN_ROWS = 10;
const GAME_MAX_ROWS = 20;

const GAME_POS = new UMath.Vec2(0, 0);
const CELL_MARGIN = 0.2;
/* END OF SETTINGS */

/**
 * @type {Game}
 */
let game;
let cellSize = 1;

function canvasPosToGrid(x, y) {
    return new UMath.Vec2(
        Math.floor((x - GAME_POS.x) / cellSize),
        Math.floor((y - GAME_POS.y) / cellSize)
    );
}

function newGame() {
    const cols = Math.round(
        UMath.map(
            Math.random(), 0, 1,
            GAME_MIN_COLS, GAME_MAX_COLS
        )
    );
    
    const rows = Math.round(
        UMath.map(
            Math.random(), 0, 1,
            GAME_MIN_ROWS, GAME_MAX_ROWS
        )
    );

    game = new Game(cols, rows, BOMB_CHANCE);
}

/**
 * @param {wCanvas} canvas
 */
function setup(canvas) {
    newGame();
    canvas.startLoop();
}

/**
 * @param {wCanvas} canvas
 * @param {Number} deltaTime
 */
function draw(canvas, deltaTime) {
    canvas.background(BACKGROUND_COLOR);
    if (game === undefined) return;

    // Recalculating sizes
    cellSize = Math.max(
        Math.min(
            canvas.canvas.width  / game.COLS,
            canvas.canvas.height / game.ROWS
        ), 1
    );

    GAME_POS.x = (canvas.canvas.width  - cellSize * game.COLS) / 2;
    GAME_POS.y = (canvas.canvas.height - cellSize * game.ROWS) / 2;

    // Setting correct drawing style
    canvas.fill(TEXT_FILL_COLOR);
    canvas.stroke(TEXT_STROKE_COLOR);
    canvas.strokeWeight(STROKE_WEIGHT);
    canvas.textFont(TEXT_FONT);
    canvas.textSize(Math.min(canvas.canvas.width, canvas.canvas.height) * TEXT_SCALE_FACTOR);

    // Drawing the game
    game.draw(canvas, deltaTime, GAME_POS.x, GAME_POS.y, cellSize, CELL_MARGIN, false, GAME_STYLE);

    // Printing to the screen whether or not the user won
    const textConfig = { "noFill": false, "noStroke": false, "alignment": { "horizontal": "center", "vertical": "center" } };
    if (game.hasWon()) {
        canvas.text("YOU WON!", canvas.canvas.width / 2, canvas.canvas.height / 2, textConfig);
    } else if (game.hasLost()) {
        canvas.text("YOU LOST.", canvas.canvas.width / 2, canvas.canvas.height / 2, textConfig);
    }
}

window.addEventListener("load", () => {
    const canvas = new wCanvas({
        "onSetup": setup,
        "onDraw" : draw
    });
});

window.addEventListener("click", ev => {
    const pos = canvasPosToGrid(ev.x, ev.y);
    if (ev.shiftKey) {
        game.markCell(pos.x, pos.y, MARK_CELL_SUSPICIOUS);
    } else game.markCell(pos.x, pos.y, MARK_CELL_SHOW);
});

window.addEventListener("keypress", ev => {
    if (ev.key === RESTART_KEY) newGame();
});
