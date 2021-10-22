/* eslint-disable no-unused-vars */

// eslint-disable-next-line no-unused-vars
function toTimeString(ms) {
    return (new Date(ms)).toISOString().match(/\d\d:(\d\d:\d\d).\d\d/)[0];
}
class GameState {
    constructor(canvas) {
        this._canvas = canvas;
        this._squareside;
        this.highscores1 = [];
        this.highscores2 = [];
        this.highscores3 = [];
        this._squares = [];
        this._difficulty = 1;
        this._rows = 4;
        this._columns = 4;
        this._mode = 'normal'; // 'normal' - 'duel' - 'custom'
        this._matchId = 0;
        this._clientId = 0;
        this._winnerTime = 0;
        this._state;
        this._winner;
        this._elapsedTime = 0;  // time used in the current game
        this._startTime;
        this._timerId;
        this._copied = 'false'; // boolean to check if copyToClipboard is enabled
        this.tab = 'mainMenu';
        this.padding = 36 + 60;
        this.clicks = 0;    // n of clicks on the current game
        this.duration = 600;    // duration of the rotate animation //220
        this.fps = 30;
        this.graphics = 'ANTIALIASING OFF';
        this.sounds = 'NO MUSIC';   // sounds to reproduce
        this.show = 'NORMAL';  //current difficulty to show highscores
        // this.hostname = '/192.168.1.137:3000';
        this.hostname = '/10.101.0.111:3000'; //unipi
        // 

        //this._animationList = lista di coppie di indici //ANIMATION

        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight - this.padding;
        if (this.windowWidth >= this.windowHeight) {
            this._canvas.height = this.windowHeight;
            this._canvas.width = this.windowHeight;
            this._squareside = this.windowHeight / this._rows;
        }
        else {
            this._canvas.height = this.windowWidth;
            this._canvas.width = this.windowWidth;
            this._squareside = this.windowWidth / this._columns;
        } 
/*         this._canvas.height = window.innerWidth - 8;
        this._canvas.width = window.innerWidth - 8;
        this._squareside = this._canvas.width / this._rows; */
    }
    get rows() {
        return this._rows;
    }
    get columns() {
        return this._columns;
    }
    get squareside() {
        return this._squareside;
    }
    get squares() {
        return this._squares;
    }
    get difficulty() {
        return this._difficulty;
    }
    get mode() {
        return this._mode;
    }
    get winnerTime() {
        return this._winnerTime;
    }
    get matchId() {
        return this._matchId;
    }
    get clientId() {
        return this._clientId;
    }
    get state() {
        return this._state;
    }
    get winner() {
        return this._winner;
    }
    get elapsedTime() {
        return this._elapsedTime;
    }
    get copied() {
        return this._copied;
    }

    updateHighscores(v, s) {
        switch(s) {
            case 'NORMAL':
                this.highscores1.push(v);
                this.highscores1.sort();
                this.highscores1 = this.highscores1.slice(0, 4);
                break;
            case 'HIGH':
                this.highscores2.push(v);
                this.highscores2.sort();
                this.highscores2 = this.highscores2.slice(0, 4);
                break;
            case 'EXTREME':
                this.highscores3.push(v);
                this.highscores3.sort();
                this.highscores3 = this.highscores3.slice(0, 4);
                break;
        }
    }

    updateLights(i, j) {
        //se esiste
        if (0 <= i && i <= (this._rows - 1) && 0 <= j && j <= (this._columns - 1)) {
            this._squares[i][j].connected = 0;
            if (this._squares[i][j].n == 1) {
                if (i != 0) {
                    if (this._squares[i - 1][j].s == 1)
                        this._squares[i][j].connected ++;
                }
            }
            if (this._squares[i][j].e == 1) {
                if (j != (this._columns - 1)) {
                    if (this._squares[i][j + 1].w == 1)
                        this._squares[i][j].connected ++;
                }
            }
            if (this._squares[i][j].s == 1) {
                if (i != (this._rows - 1)) {
                    if (this._squares[i + 1][j].n == 1)
                        this._squares[i][j].connected ++;
                } 
            }
            if (this._squares[i][j].w == 1) {
                if (j != 0) {
                    if (this._squares[i][j - 1].e == 1)
                        this._squares[i][j].connected ++;
                }
            }
        }
    }

    isConnected(i, j, nwes) {
        if (this._squares[i][j]._isMoving) return false;
        if (0 <= i && i <= (this._rows - 1) && 0 <= j && j <= (this._columns - 1)) {
            switch(nwes) {
                case "n":
                    if (i != 0) {
                        return (!this._squares[i - 1][j]._isMoving && this._squares[i - 1][j].s === 1);
                    }
                    return false;
                case "s":
                    if (i != (this._rows - 1)) { 
                        return (!this._squares[i + 1][j]._isMoving && this._squares[i + 1][j].n === 1);
                    }
                    return false;
                case "e":
                    if (j != (this._columns - 1)) {
                        return (!this._squares[i][j + 1]._isMoving && this._squares[i][j + 1].w === 1);
                    }
                    return false;
                case "w":
                    if (j != 0) {
                        return (!this._squares[i][j - 1]._isMoving && this._squares[i][j - 1].e === 1);
                    }
                    return false;
                default: return false;
            }
        }
        return false;
    }
    startTimer(timer) {
        this._startTime = Date.now();
        this._elapsedTime = 0;
        this._timerId = setInterval(() => {
            timer.textContent = 'Time elapsed ' + toTimeString(this._elapsedTime);
            this._elapsedTime = Date.now() - this._startTime;
        }, 10);
    }
    stopTimer() {
        clearInterval(this._timerId);
    }
    rotate(i, j) {
        // list add animation(i,j)
        // se non è già in movimento aggiunge, altrimenti aggiorna (angolo attuale -> angolo finale) 
        this._squares[i][j].isMoving = true; //ANIMATION
    }
    updateAnimationList() {
        if (this._animationList.length != 0) {
            for(i = 0; i < animationList.length; i++) {
                // controllare che l'animazione non sia finita
                animationList[i].update(Date.now());
            }
        }
    }
    set squares(v) {
        this._squares = v;
    }
    set mode(v) {
        this._mode = v;
    }
    set clientId(v) {
        this._clientId = v;
    }
    set matchId(v) {
        this._matchId = v;
    }
    set winnerTime(v) {
        this._winnerTime = v;
    }
    set state(v) {
        this._state = v;
    }
    set winner(v) {
        this._winner = v;
    }
    set elapsedTime(v) {
        this._elapsedTime = v;
    }
    set copied(v) {
        this._copied = v;
    }
    set difficulty(v) {
        if (v === 1) {
            this._difficulty = 1;
            this._rows = 4;
            this._columns = 4;
        }
        else if (v === 2) {
            this._difficulty = 2;
            this._rows = 5;
            this._columns = 5;
        }
        else if (v === 3) {
            this._difficulty = 3;
            this._rows = 8;
            this._columns = 8;
        }
        else if (v === 'custom') {
            this._difficulty = 'custom';
        }
/*         if (this.windowWidth >= this.windowHeight) {
            this._canvas.height = this.windowHeight;
            this._canvas.width = this.windowHeight;
            //this._squareside = this.windowHeight / this._rows;
        }
        else {
            this._canvas.height = this.windowWidth;
            this._canvas.width = this.windowWidth;
            //this._squareside = this.windowWidth / this._columns;
        } */
        if (this._columns >= this._rows) {
            this._squareside = this._canvas.height / this._columns;
        }
        else {this._squareside = this._canvas.height / this._rows;}
    }

}