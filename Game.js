
import { wCanvas, Color, UMath } from "./wCanvas/wcanvas.js";
import { Cell } from "./Cell.js";
import { AnimatedCell } from "./AnimatedCell.js";

export const CELL_RADIUS = 1;
export const MARK_CELL_SHOW = 0;
export const MARK_CELL_SUSPICIOUS = 1;

const _FF_NEIGHBOURS_OFFSETS = [
    new UMath.Vec2(-1,  1),
    new UMath.Vec2( 0,  1),
    new UMath.Vec2( 1,  1),
    new UMath.Vec2( 1,  0),
    new UMath.Vec2( 1, -1),
    new UMath.Vec2( 0, -1),
    new UMath.Vec2(-1, -1),
    new UMath.Vec2(-1,  0)
];

export class GameDrawStyle {

    constructor(
        backgroundColor,
        valuesColors,
        zeroBackground,
        bombColor,
        suspiciousColor,
        gridColor
    ) {
        this.BACKGROUND_COLOR = backgroundColor;
        this.VALUES_COLORS = valuesColors;
        this.ZERO_BACKGROUND_COLOR = zeroBackground;
        this.BOMB_COLOR = bombColor;
        this.SUSPICIOUS_COLOR = suspiciousColor;
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

        /**
         * @type {Cell[]}
         */
        this._marked = [ ];

        this._playerLost = false;

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
                const cell = new AnimatedCell(x, y, isBomb, 0, true);

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
            if (cell.isBomb()) {
                this._playerLost = true;
                continue;
            } else if (cell.getValue() !== targetValue) continue;

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
    draw(canvas, deltaTime, x, y, cellSize, cellMargin, showZeroes, drawStyle) {
        canvas.save();
        for (let i = 0; i < this._cells.length; i++)
            this._cells[i].draw(canvas, deltaTime, x, y, cellSize, cellMargin, showZeroes, drawStyle);
        canvas.stroke(drawStyle.GRID_COLOR);
        canvas.rect(x, y, cellSize * this.COLS, cellSize * this.ROWS, { "noFill": true });
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

    /**
     * @param {Number} x
     * @param {Number} y
     * @param {Number} action
     */
    markCell(x, y, action) {
        if (this.isGameOver()) return;

        const cell = this.getCell(x, y);
        if (cell === undefined) return;

        switch (action) {
            case MARK_CELL_SHOW: {
                const isMarked = this._marked.findIndex(c => c === cell) >= 0;
                if (!isMarked) this._floodFill(x, y, 0);
                break;
            }
            case MARK_CELL_SUSPICIOUS: {
                if (!cell.isHidden()) break;

                const indexToRemove = this._marked.findIndex(c => c === cell);
                if (indexToRemove >= 0) {
                    cell.setSuspicious(false);
                    this._marked.splice(indexToRemove, 1);
                } else {
                    cell.setSuspicious(true);
                    this._marked.push(cell);
                }
                break;
            }
        }
    }

    /**
     * @returns {Boolean}
     */
    hasWon() {
        if (this._playerLost || this._marked.length !== this._bombs.length) return false;
        for (let i = 0; i < this._marked.length; i++)
            if (!this._marked[i].isBomb()) return false;
        return true;
    }

    /**
     * @returns {Boolean}
     */
    hasLost() {
        return this._playerLost;
    }

    isGameOver() {
        return this.hasLost() || this.hasWon();
    }

}
