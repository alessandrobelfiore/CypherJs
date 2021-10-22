const N_MASK = 0b1000;
const E_MASK = 0b0100;
const S_MASK = 0b0010;
const W_MASK = 0b0001;

class SquarePattern {
    constructor(n, e, s, w) {
        this.map = n * N_MASK + e * E_MASK + s * S_MASK + w * W_MASK;
        this._maxConnect = n + e + s + w;
        this._connected = 0;
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
    
    updatemaxConnect() {
        this._maxConnect = ((this.map & N_MASK) >> 3) + ((this.map & E_MASK) >> 2) + 
        ((this.map & S_MASK) >> 1) + (this.map & W_MASK);
    }

    rotateCW() {
        this.map = this.map >> 1 | ((this.map & W_MASK) << 3);
    }

    rotateCCW() {
        this.map = (this.map << 1 | ((this.map & N_MASK) >> 3)) & 0b1111;
    }

    static toJSON(sq) {
        return sq.map;
    }

    static fromJSON(data) {
        var sq = new SquarePattern(0, 0, 0, 0);
        sq.map = data;
        return sq;
    }
}

module.exports = SquarePattern;