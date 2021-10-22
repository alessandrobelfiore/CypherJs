const N_MASK = 0b1000;
const E_MASK = 0b0100;
const S_MASK = 0b0010;
const W_MASK = 0b0001;

// eslint-disable-next-line no-unused-vars
class SquarePattern {
    constructor(n, e, s, w) {
        this.map = n * N_MASK + e * E_MASK + s * S_MASK + w * W_MASK;
        this._maxConnect = n + e + s + w;
        this._connected = 0;
        this._isMoving = false;
        this._startAngle = 0; 
        this._startTime = 0;
    }

    get n() {
        return (this.map & N_MASK) >> 3;
    }
    get e() {
        return (this.map & E_MASK) >> 2;
    }
    get s() {
        return (this.map & S_MASK) >> 1;
    }
    get w() {
        return this.map & W_MASK;
    }
    get connected() {
        return this._connected;
    }
    get maxConnect() {
        return this._maxConnect;
    }

    set n(v) {
        this.map = this.map ^ (-v ^ this.map) & N_MASK;
    }
    set e(v) {
        this.map = this.map ^ (-v ^ this.map) & E_MASK;
    }
    set s(v) {
        this.map = this.map ^ (-v ^ this.map) & S_MASK;
    }
    set w(v) {
        this.map = this.map ^ (-v ^ this.map) & W_MASK;
    }
    set connected(v) {
        this._connected = v;
    }
    set maxConnect(v) {
        this._maxConnect = v;
    }

/*     isMoving() {
        return this._isMoving;
    } */
    updatemaxConnect() {
        this._maxConnect = ((this.map & N_MASK) >> 3) + ((this.map & E_MASK) >> 2) + 
        ((this.map & S_MASK) >> 1) + (this.map & W_MASK);
    }
    rotateCW(duration) {
        if (this._isMoving) {
            let now = Date.now()
            let angle = (this._startAngle) * (1 - (SquarePattern.easing((now - this._startTime) / duration)));
            this._startAngle = Math.PI / 2 + angle;
            this._startTime = now;
        } else {
            this._isMoving = true;
            this._startAngle = Math.PI /2;
            this._startTime = Date.now();
        }
        this.map = this.map >> 1 | ((this.map & W_MASK) << 3);
    }

    rotateCCW() {
        this.map = (this.map << 1 | ((this.map & N_MASK) >> 3)) & 0b1111;
    }

    static easing(t) {
        if (t < 0.5)
            return  (4 * t * t * t )
        else 
            return ((t - 1) * (2 * t - 2) * (2 * t - 2) + 1)
    }

    static toJSON(sq) {
        return this.map;
    }

    static fromJSON(data) {
        var sq = new SquarePattern(0, 0, 0, 0);
        sq.map = data;
        return sq;
    }
}