
import { Cell } from "./Cell.js";
import { UMath } from "./wCanvas/wcanvas.js";

export class AnimatedCell extends Cell {

    /**
     * @param {Nubmer} x
     * @param {Number} y
     * @param {Boolean} isBomb
     * @param {Number} value
     * @param {Boolean} isHidden
     */
     constructor(x, y, isBomb, value, isHidden) {
        super(x, y, isBomb, value, isHidden);

        this._animationTime = 0.126;
        this._elapsedAnimationTime = 0;
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
        if (!this.isHidden())
            this._elapsedAnimationTime = UMath.constrain(this._elapsedAnimationTime + deltaTime, 0, this._animationTime);
    
        super.draw(
            canvas, deltaTime,
            x, y, cellSize,
            cellMargin, showZero, drawStyle
        );
    }

    /**
     * @param {wCanvas} canvas
     * @param {Number} x
     * @param {Number} y
     * @param {Number} size
     * @param {Color} color
     */
     _drawCellRect(canvas, x, y, size, color) {
        const actualSize = size * (this._elapsedAnimationTime / this._animationTime);
        canvas.fill(color);
        canvas.rect(x, y, actualSize, actualSize, { "alignment": { "horizontal": "center", "vertical": "center" } });
    }

    /**
     * @param {Boolean} hidden
     */
    setHidden(hidden) {
        super.setHidden(hidden);
        if (this.isHidden())
            this._elapsedAnimationTime = 0;
    }

}
