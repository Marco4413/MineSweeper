
import { Color, wCanvas } from "./wCanvas/wcanvas.js";
import { GameDrawStyle } from "./Game.js";

export class Cell {

    /**
     * @param {Nubmer} x
     * @param {Number} y
     * @param {Boolean} isBomb
     * @param {Number} value
     * @param {Boolean} isHidden
     */
    constructor(x, y, isBomb, value, isHidden) {
        this.X = x;
        this.Y = y;
        this._isBomb = isBomb;
        this._isSuspicious = false;
        this._value = value;
        this._isHidden = isHidden;
    }

    isBomb() {
        return this._isBomb;
    }

    /**
     * @param {Boolean} suspicious
     */
    setSuspicious(suspicious) {
        this._isSuspicious = suspicious;
    }

    isSuspicious() {
        return this._isSuspicious;
    }

    /**
     * @param {Boolean} hidden
     */
    setHidden(hidden) {
        this._isHidden = hidden;
    }

    isHidden() {
        return this._isHidden;
    }

    /**
     * @param {Number} value
     */
    setValue(value) {
        this._value = value;
    }

    getValue() {
        return this._value === undefined ? 0 : this._value;
    }

    /**
     * @param {wCanvas} canvas
     * @param {Number} deltaTime
     * @param {Number} x
     * @param {Number} y
     * @param {Number} cellSize
     * @param {Number} cellMargin
     * @param {Number} showZero
     * @param {GameDrawStyle} drawStyle
     */
    draw(canvas, deltaTime, x, y, cellSize, cellMargin, showZero, drawStyle) {
        const canvasX = x + this.X * cellSize + cellSize / 2;
        const canvasY = y + this.Y * cellSize + cellSize / 2;
        this._drawCellValue(canvas, canvasX, canvasY, cellSize, cellMargin, showZero, drawStyle);
    }

    /**
     * @param {wCanvas} canvas
     * @param {Number} x
     * @param {Number} y
     * @param {Number} size
     * @param {Number} margin
     * @param {Boolean} showZero
     * @param {GameDrawStyle} drawStyle
     */
    _drawCellValue(canvas, x, y, size, margin, showZero, drawStyle) {
        canvas.stroke(drawStyle.GRID_COLOR);
        canvas.textSize(size - (size * margin * 2));
        
        const textSettings = { "noStroke": true, "alignment": { "horizontal": "center", "vertical": "center" } };
        this._drawCellRect(canvas, x, y, size, drawStyle.BACKGROUND_COLOR);
        
        if (this.isSuspicious()) {
            canvas.fill(drawStyle.SUSPICIOUS_COLOR);
            canvas.text("🏁", x, y, textSettings);
            return;
        } else if (this.isHidden()) return;

        const cellValue = this.getValue();

        if (this.isBomb()) {
            canvas.fill(drawStyle.BOMB_COLOR);
            canvas.text("💣", x, y, textSettings);
        } else if (showZero || cellValue !== 0) {
            const color = drawStyle.VALUES_COLORS[ Math.min(cellValue, drawStyle.VALUES_COLORS.length - 1) ];
            canvas.fill(color);
            canvas.text(cellValue, x, y, textSettings);
        } else this._drawCellRect(canvas, x, y, size, drawStyle.ZERO_BACKGROUND_COLOR);
    }

    /**
     * @param {wCanvas} canvas
     * @param {Number} x
     * @param {Number} y
     * @param {Number} size
     * @param {Color} color
     */
    _drawCellRect(canvas, x, y, size, color) {
        canvas.fill(color);
        canvas.rect(x, y, size, size, { "alignment": { "horizontal": "center", "vertical": "center" } });
    }

}
