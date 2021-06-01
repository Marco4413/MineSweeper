
import { wCanvas, Color } from "./wCanvas/wcanvas.js";
import { Game, GameDrawStyle } from "./Game.js";

const BACKGROUND_COLOR = new Color("black");
const GAME_STYLE = new GameDrawStyle(
    [ new Color("green"), new Color("yellow"), new Color("orange") ],
    true,
    new Color("red"),
    new Color("white")
);

/**
 * @type {Game}
 */
let game;

/**
 * @param {wCanvas} canvas
 */
function setup(canvas) {
    game = new Game(10, 10, 0.1);
    game._floodFill(0, 0, 0);
    canvas.startLoop();
}

/**
 * @param {wCanvas} canvas
 * @param {Number} deltaTime
 */
function draw(canvas, deltaTime) {
    canvas.background(BACKGROUND_COLOR);
    game.draw(canvas, deltaTime, 0, 0, 32, GAME_STYLE);
}

window.addEventListener("load", () => {
    const canvas = new wCanvas({
        "onSetup": setup,
        "onDraw" : draw
    });
});
