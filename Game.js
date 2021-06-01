
import { wCanvas, Color, UMath } from "./wCanvas/wcanvas.js";
import { Cell } from "./Cell.js";

export const CELL_RADIUS = 1;

const _FF_NEIGHBOURS_OFFSETS = [
    new UMath.Vec2(-1,  1),
    new UMath.Vec2( 0,  1),
    new UMath.Vec2( 1,  1),
    new UMath.Vec2( 1,  0),
    new UMath.Vec2( 1, -1),
    new UMath.Vec2( 0, -1),
    new UMath.Vec2(-1, -1),
    new UMath.Vec2( 0,  1)
];

export class GameDrawStyle {

    constructor(
        valuesColors,
        showZeroes,
        bombColor,
        gridColor
    ) {
        this.VALUES_COLORS = valuesColors;
        this.SHOW_ZEROES = showZeroes;
        this.BOMB_COLOR = bombColor;
        this.GRID_COLOR = gridColor;
    }

}

export class Game {

    /**
     * @param {Number} cols
     * @param {Number} rows
     * @param {Number} bombChance
     */
    constructor(cols, rows, bombChance) {
        this.COLS = cols;
        this.ROWS = rows;

        /**
         * @type {Cell[]}
         */
        this._cells = [ ];

        /**
         * @type {Cell[]}
         */
        this._bombs = [ ];

        this._populateGrid(bombChance);
        this._calculateCellValues();
    }

    /**
     * @param {Number} bombChance
     */
    _populateGrid(bombChance) {
        this._cells = [ ];
        this._bombs = [ ];

        for (let y = 0; y < this.ROWS; y++) {
            for (let x = 0; x < this.COLS; x++) {
                const isBomb = (Math.random() <= bombChance);
                const cell = new Cell(x, y, isBomb, 0, true);

                this._cells.push(cell);
                if (isBomb) this._bombs.push(cell);
            }
        }
    }

    _calculateCellValues() {
        for (let i = 0; i < this._bombs.length; i++) {
            const bomb = this._bombs[i];

            for (let y = -CELL_RADIUS; y <= CELL_RADIUS; y++) {
                for (let x = -CELL_RADIUS; x <= CELL_RADIUS; x++) {
                    if (y === 0 && x === 0) continue;

                    const cell = this.getCell(bomb.X + x, bomb.Y + y);
                    if (cell === undefined || cell.isBomb()) continue;

                    cell.setValue(cell.getValue() + 1);
                }
            }
        }
    }

    /**
     * @param {Number} startX
     * @param {Number} startY
     * @param {Number} targetValue
     */
    _floodFill(startX, startY, targetValue) {
        const processing = [ ];
        {
            const startingCell = this.getCell(startX, startY);
            if (startingCell !== undefined) processing.push(startingCell);
        }

        while (processing.length > 0) {
            const cell = processing.shift();
            if (!cell.isHidden()) continue;

            cell.setHidden(false);
            if (cell.isBomb() || cell.getValue() !== targetValue) continue;

            for (let i = 0; i < _FF_NEIGHBOURS_OFFSETS.length; i++) {
                const offset = _FF_NEIGHBOURS_OFFSETS[i];
                const neighbourCell = this.getCell(cell.X + offset.x, cell.Y + offset.y);
                if (neighbourCell !== undefined) processing.push(neighbourCell);
            }
        }
    }

    /**
     * @param {wCanvas} canvas
     * @param {Number} deltaTime
     * @param {Number} x
     * @param {Number} y
     * @param {Number} cellSize
     * @param {GameDrawStyle} drawStyle
     */
    draw(canvas, deltaTime, x, y, cellSize, drawStyle) {
        canvas.save();
        canvas.stroke(drawStyle.GRID_COLOR);

        const textSettings = { "noStroke": true, "alignment": { "horizontal": "center", "vertical": "center" } };

        const halfSize = cellSize / 2;
        for (let i = 0; i < this._cells.length; i++) {
            const cell = this._cells[i];
            
            const canvasX = x + cell.X * cellSize;
            const canvasY = y + cell.Y * cellSize;
            canvas.rect(canvasX, canvasY, cellSize, cellSize, { "noFill": true });
            if (cell.isHidden()) continue;

            const cellValue = cell.getValue();
            const isBomb = cell.isBomb();

            if (isBomb) {
                canvas.fill(drawStyle.BOMB_COLOR);
                canvas.text("Bomb", canvasX + halfSize, canvasY + halfSize, textSettings);
            } else if (drawStyle.SHOW_ZEROES || cellValue !== 0) {
                const color = drawStyle.VALUES_COLORS[ Math.min(cellValue, drawStyle.VALUES_COLORS.length - 1) ];
                canvas.fill(color);
                canvas.text(cellValue, canvasX + halfSize, canvasY + halfSize, textSettings);
            }
        }

        canvas.restore();
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @returns {Cell|undefined}
     */
    getCell(x, y) {
        if (x < 0 || x >= this.COLS || y < 0 || y >= this.ROWS) return undefined;
        const i = y * this.COLS + x;
        return this._cells[i];
    }

}