
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

}
