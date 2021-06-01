
import { wCanvas, Color } from "./wCanvas/wcanvas.js";

const BACKGROUND_COLOR = new Color("black");

/**
 * @param {wCanvas} canvas
 */
function setup(canvas) {
    canvas.startLoop();
}

/**
 * @param {wCanvas} canvas
 * @param {Number} deltaTime
 */
function draw(canvas, deltaTime) {
    canvas.background(BACKGROUND_COLOR);
}

window.addEventListener("load", () => {
    const canvas = new wCanvas({
        "onSetup": setup,
        "onDraw" : draw
    });
});
