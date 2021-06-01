
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

const CELL_MARGIN = 0.2;
/* END OF SETTINGS */

/**
 * @type {Game}
 */
let game;

const GAME_POS = new UMath.Vec2(0, 0);
let cellSize = 1;

let isMobile = false;

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

    // Code taken from http://detectmobilebrowsers.com/
    isMobile = (function(a){return(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))})(navigator.userAgent||navigator.vendor||window.opera);
});


window.addEventListener("touchend", ev => {
    if (!isMobile) return;
    if (game.isGameOver()) newGame();
});

window.addEventListener("click", ev => {
    const pos = canvasPosToGrid(ev.x, ev.y);
    if (isMobile || ev.shiftKey) {
        game.markCell(pos.x, pos.y, MARK_CELL_SUSPICIOUS);
    } else game.markCell(pos.x, pos.y, MARK_CELL_SHOW);
});

window.addEventListener("dblclick", ev => {
    const pos = canvasPosToGrid(ev.x, ev.y);
    if (isMobile) {
        game.markCell(pos.x, pos.y, MARK_CELL_SHOW);
    } else game.markCell(pos.x, pos.y, MARK_CELL_SUSPICIOUS);
});

window.addEventListener("keypress", ev => {
    if (isMobile) return;
    if (ev.key === RESTART_KEY) newGame();
});
