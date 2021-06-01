
import { wCanvas, Color, UMath } from "./wCanvas/wcanvas.js";
import { Game, GameDrawStyle, MARK_CELL_SHOW, MARK_CELL_SUSPICIOUS } from "./Game.js";

const BACKGROUND_COLOR = new Color("black");
const GAME_STYLE = new GameDrawStyle(
    [ new Color("green"), new Color("yellow"), new Color("orange") ],
    true,
    new Color("red"),
    new Color("white"),
    new Color("white")
);

const GAME_POS = new UMath.Vec2(0, 0);
const CELL_SIZE = 64;
const CELL_MARGIN = 0.2;

/**
 * @type {Game}
 */
let game;

function canvasPosToGrid(x, y) {
    return new UMath.Vec2(
        Math.floor((x - GAME_POS.x) / CELL_SIZE),
        Math.floor((y - GAME_POS.y) / CELL_SIZE)
    );
}

/**
 * @param {wCanvas} canvas
 */
function setup(canvas) {
    game = new Game(10, 10, 0.1);
    canvas.startLoop();
}

/**
 * @param {wCanvas} canvas
 * @param {Number} deltaTime
 */
function draw(canvas, deltaTime) {
    canvas.background(BACKGROUND_COLOR);
    game.draw(canvas, deltaTime, GAME_POS.x, GAME_POS.y, CELL_SIZE, CELL_MARGIN, GAME_STYLE);
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

    if (game.hasWon()) console.log("PLAYER HAS WON!");
});
