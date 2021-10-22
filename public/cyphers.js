/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

function main() {
    var canvas = document.getElementById('gamearea');
    var timer = document.getElementById('timer');
    var volumeIcon = document.getElementById('volume');
    var volumeOffIcon = document.getElementById('volumeOff');
    var settingsIcon = document.getElementById('settings');
    var music = document.getElementById('music');
    var GS = new GameState(canvas);
    const urlParams = new URLSearchParams(window.location.search);
    let linkId = urlParams.get('matchid');
    var hover = false;
    var custom = 'REMOVE';
    var clickAudio = new Audio('click.mp3');

    function toTime1String(ms) {
        return (new Date(ms)).toISOString().match(/\d\d:(\d\d:\d\d.\d\d)/)[1];
    }
    var ctx = canvas.getContext('2d');
    var bzz = document.getElementById('bzzSprite');
    var bzz2 = document.getElementById('bzz2Sprite');
    var light_off = document.getElementById('red_offSprite');
    var light_on = document.getElementById('red_onSprite');
    var back = document.getElementById('backButton');

/*     bzz.src = 'public/bzz.png';
    var bzz2 = new Image();
    bzz2.src = '/public/bzz2.png'; */

    //draw grid
    function redraw(startTime) {
        const elapsedTime = Date.now();
        const fps = GS.fps;
        if (elapsedTime - startTime < (1000 / fps)) {
            requestAnimationFrame(() => redraw(startTime));
            return;
        }
        switch (GS.tab) {
            case 'game':
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < GS.rows; i++) {
                    for(let j = 0; j < GS.columns; j++) {
                        ctx.save();
        
                        ctx.lineWidth = 4;
                        ctx.beginPath();
                        ctx.translate(j * GS.squareside, i * GS.squareside);
                        ctx.moveTo(0, 0);
                        ctx.lineTo(GS.squareside, 0);
                        ctx.lineTo(GS.squareside, GS.squareside);
                        ctx.lineTo(0, GS.squareside);
                        ctx.lineTo(0, 0);
                        ctx.stroke();
        
                        ctx.restore(); 
                    }}
                drawPattern();
                break;
            case 'mainMenu':
                drawMenu();
                break;
            case 'options':
                drawOptions();
                break;
            case 'animations':
                drawAnimationsMenu();
                break;
            case 'graphics':
                drawGraphicsMenu();
                break;
            case 'sound':
                drawSoundMenu();
                break;
            case 'custom':
                drawCustomMode();
                break;
            case 'customMenu':
                drawCustomMenu();
                break;
            case 'selectMode':
                drawSelectMode();
                break;
            case 'difficultyMenu':
                drawDifficultyMenu();
                break;
            case 'highscoresMenu':
                drawHighscoresMenu();
                break;
            case 'highscores':
                drawHighscoresTab();
                break;
            case 'readyCheck':
                drawReadyCheck();
                break;
            case 'resultScreen':
                drawResultScreen(GS.winner, GS.winnerTime);
                break;
            case 'pressToContinue':
                drawPressToContinue();
                break;
            default:
                break;
        }
        requestAnimationFrame(() => redraw(Date.now()))
    }   
    //draw sticks pattern 
    function drawPattern() {
        for (let i = 0; i < GS.rows; i++) {
            for(let j = 0; j < GS.columns; j++) {
                ctx.save();

                //ctx.lineCap = 'round';
                //ctx.strokeStyle = 'red';
                ctx.translate(j * GS.squareside, i * GS.squareside);
                drawSticks(GS.squares[i][j], GS.squareside, i, j);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                //ctx.arc(0, 0, GS.squareside / 20, 0, Math.PI * 2, false);
                // manca 0      #ff3300  #991f00
                // manca 1      #ff5c33
                // mancano 2    #ff8566
                // mancano 3    #ffad99
                if (GS.squares[i][j].connected == GS.squares[i][j].maxConnect) {
                    ctx.imageSmoothingQuality = "high";
                    ctx.drawImage(light_on, -GS.squareside / 18, -GS.squareside / 18, GS.squareside / 9, GS.squareside / 9);
                }
                else {
                    ctx.imageSmoothingQuality = "high";
                    ctx.drawImage(light_off, -GS.squareside / 18, -GS.squareside / 18, GS.squareside / 9, GS.squareside / 9);
                }
                ctx.closePath();
                ctx.restore();
            }
        }
    }

    //drawSticks function
    function drawSticks(square, squareside, i, j) {
        //ctx.strokeStyle = '#428e92';
        ctx.strokeStyle = 'grey';
        //cicla colori?
        ctx.lineWidth = 2;
        ctx.beginPath();
        let stick = squareside / 2;
        let l1 = GS.squareside / 12;

        ctx.translate(stick, stick);
        ctx.moveTo(0, 0);
        let now = Date.now();
        if (square._isMoving && (now - square._startTime < GS.duration)) {
            angle = (square._startAngle) * (1 - (SquarePattern.easing((now - square._startTime) / GS.duration)));
            ctx.save();
            ctx.rotate(-angle);
            if (square.n === 1) {
                ctx.lineTo(0, - stick);
                ctx.moveTo(0, 0);
            }
            if (square.w === 1) {
                ctx.lineTo(- stick, 0);
                ctx.moveTo(0, 0);
            }
            if (square.s === 1) {
                ctx.lineTo(0, stick);
                ctx.moveTo(0, 0);
            }
            if (square.e === 1) {
                ctx.lineTo(stick, 0);
                ctx.moveTo(0, 0);
            }
            ctx.restore();
        } else {
            square._isMoving = false;
            if (square.n === 1) {
                ctx.lineTo(0, - stick);
                ctx.moveTo(0, 0);
                if (GS.isConnected(i, j, "n")) {
                    drawBzzFlow(ctx, bzz, "n", -(l1 / 2), -stick, l1, stick);}
            }
            if (square.w === 1) {
                ctx.lineTo(- stick, 0);
                ctx.moveTo(0, 0);
                if (GS.isConnected(i, j, "w")) {
                    drawBzzFlow(ctx, bzz2, "w", -stick, -(l1 / 2), stick, l1);}
            }
            if (square.s === 1) {
                ctx.lineTo(0, stick);
                ctx.moveTo(0, 0);
                if (GS.isConnected(i, j, "s")) {
                    drawBzzFlow(ctx, bzz, "s", -(l1 / 2), 0, l1, stick);}
            }
            if (square.e === 1) {
                ctx.lineTo(stick, 0);
                ctx.moveTo(0, 0);
                if (GS.isConnected(i, j, "e")) {
                    drawBzzFlow(ctx, bzz2, "e", 0, -(l1 / 2), stick, l1);}
            }
        }
        ctx.closePath();
        ctx.stroke(); 
    }

    //mousemove listeners
    canvas.addEventListener('mousemove', function (event) {
        let rect = event.target.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        
        let l = canvas.width / 7;
        switch(GS.tab) {
            case 'game':
                break;
            case 'mainMenu':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    if (hover != 'NEW GAME') {
                        hover = 'NEW GAME';
                    }}
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 6 * l) {
                    if (hover != 'HIGHSCORES') {
                        hover = 'HIGHSCORES';
                    }}
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    if (hover != 'OPTIONS') {
                        hover = 'OPTIONS';
                    }}
                else {
                    if (hover != 'NONE') {
                        hover = 'NONE';
                    }}
                break;
            case 'options':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    if (hover != 'ANIMATIONS') {
                        hover = 'ANIMATIONS';
                    }}
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 6 * l) {
                    if (hover != 'GRAPHICS') {
                        hover = 'GRAPHICS';
                    }}
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    if (hover != 'SOUNDS') {
                        hover = 'SOUNDS';
                    }}
                else {
                    if (hover != 'NONE') {
                        hover = 'NONE';
                    }}
                break;
            case 'animations':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    if (hover != 'NORMAL') {
                        hover = 'NORMAL';
                    }}
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 6 * l) {
                    if (hover != 'FAST') {
                        hover = 'FAST';
                    }}
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    if (hover != 'DISABLED') {
                        hover = 'DISABLED';
                    }}
                else {
                    if (hover != 'NONE') {
                        hover = 'NONE';
                    }}
                break;
            case 'graphics':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    if (hover != '30 FPS') {
                        hover = '30 FPS';
                    }}
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 6 * l) {
                    if (hover != '60 FPS') {
                        hover = '60 FPS';
                    }}
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    if (hover != 'ANTIALIASING') {
                        hover = 'ANTIALIASING';
                    }}
                else {
                    if (hover != 'NONE') {
                        hover = 'NONE';
                    }}
                break;
            case 'sound':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    if (hover != 'MUSIC') {
                        hover = 'MUSIC';
                    }}
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 6 * l) {
                    if (hover != 'CLICKS') {
                        hover = 'CLICKS';
                    }}
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    if (hover != 'SILENT MODE') {
                        hover = 'SILENT MODE';
                    }}
                else {
                    if (hover != 'NONE') {
                        hover = 'NONE';
                    }}
                break;
            case 'customMenu':
                if (l <= y && y <= 2 * l && l <= x && x <= 3.5 * l) {
                    if (hover != 'LESS COLUMNS') {
                        hover = 'LESS COLUMNS';
                    }}
                else if (l <= y && y <= 2 * l && 3.5 * l <= x && x <= 6 * l) {
                    if (hover != 'MORE COLUMNS') {
                        hover = 'MORE COLUMNS';
                    }}
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 3.5 * l) {
                    if (hover != 'LESS ROWS') {
                        hover = 'LESS ROWS';
                    }}
                else if (3 * l <= y && y <= 4 * l && 3.5 * l <= x && x <= 6 * l) {
                    if (hover != 'MORE ROWS') {
                        hover = 'MORE ROWS';
                    }}
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    if (hover != 'CONFIRM') {
                        hover = 'CONFIRM';
                    }}
                else {
                    if (hover != 'NONE') {
                        hover = 'NONE';
                    }}
                break;  
            case 'selectMode':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    if (hover != 'NORMAL') {
                        hover = 'NORMAL';
                    }}
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 6 * l) {
                    if (hover != 'DUEL') {
                        hover = 'DUEL';
                    }}
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    if (hover != 'CUSTOM') {
                        hover = 'CUSTOM';
                    }}
                else {
                    if (hover != 'NONE') {
                        hover = 'NONE';
                    }}
                break;
            case 'difficultyMenu':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    if (hover != 'NORMAL') {
                        hover = 'NORMAL';
                    }}
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 6 * l) {
                    if (hover != 'HIGH') {
                        hover = 'HIGH';
                    }}
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    if (hover != 'EXTREME') {
                        hover = 'EXTREME';
                    }}
                else {
                    if (hover != 'NONE') {
                        hover = 'NONE';
                    }}
                break;
            case 'highscoresMenu':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    if (hover != 'NORMAL') {
                        hover = 'NORMAL';
                    }}
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 6 * l) {
                    if (hover != 'HIGH') {
                        hover = 'HIGH';
                    }}
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    if (hover != 'EXTREME') {
                        hover = 'EXTREME';
                    }}
                else {
                    if (hover != 'NONE') {
                        hover = 'NONE';
                    }}
                break;
            case 'highscores':
                break;
            case 'readyCheck':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    if (hover != 'READY!') {
                        hover = 'READY!';       
                    }}
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    if (hover != 'COPY TO CLIPBOARD') {
                        hover = 'COPY TO CLIPBOARD';
                    }}
                else {
                    if (hover != 'NONE') {
                        hover = 'NONE';
                    }}
                break;
            case 'pressToContinue':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    if (hover != 'PRESSTOCONTINUE') {
                        hover = 'PRESSTOCONTINUE';
                    }}
                else {
                    if (hover != 'NONE') {
                        hover = 'NONE';
                    }}
                break;
            case 'resultScreen':
                if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    if (hover != 'PLAY AGAIN') {
                        hover = 'PLAY AGAIN';
                    }}
                else {
                    if (hover != 'NONE') {
                        hover = 'NONE';
                    }}   
                break;
            default:
                break;
        }
    });
    //mouseclick listeners
    canvas.addEventListener('dblclick', function(event) {
        event.preventDefault();
        }
    );
    canvas.addEventListener('click', function(event) {
        event.preventDefault();
        let rect = event.target.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        
        let l = canvas.width / 7;
        switch(GS.tab) {
            case 'game':
                GS.clicks ++;
                if (GS.sounds === 'NO MUSIC') {
                    clickAudio.pause();
                    clickAudio.currentTime = 0;
                    clickAudio.play();
                }
                let j = Math.floor(x / GS.squareside);
                let i = Math.floor(y / GS.squareside);
                GS.squares[i][j].rotateCW(GS.duration);
                GS.updateLights(i, j);
                GS.updateLights(i - 1, j);
                GS.updateLights(i + 1, j);
                GS.updateLights(i, j - 1);
                GS.updateLights(i, j + 1);  

                seSeiForteSali();
                break;
            case 'customMenu':
                if (l <= y && y <= 2 * l && l <= x && x <= 3.5 * l) {
                    if (GS._columns > 2) {
                        GS._columns --;
                        console.log(GS._columns)
                    }
                }  
                else if (l <= y && y <= 2 * l && 3.5 * l <= x && x <= 6 * l) {
                    if (GS._columns < 11) {
                        GS._columns ++;
                        console.log(GS._columns)
                    }
                }
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 3.5 * l) {
                    if (GS._rows > 2) {
                        GS._rows --;
                        console.log(GS._rows)
                    }
                }
                else if (3 * l <= y && y <= 4 * l && 3.5 * l <= x && x <= 6 * l) {
                    if (GS._rows < 11) {
                        GS._rows ++;
                        console.log(GS._rows)
                    }
                }
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    GS.squares = initiateGrid(GS._rows, GS._columns);
                    GS.difficulty = 'custom';
                    for (let i = 0; i < GS._rows; i++) {
                        for(let j = 0; j < GS._columns; j++) {
                            GS.updateLights(i, j);
                            GS.squares[i][j].updatemaxConnect();
                    }}
                    GS.tab = 'custom';
                    GS.copied = 'false'; 
                }   
                else if (6 * l <= y && y <= 7 * l && 6 * l <= x && x <= 7 * l) {
                    GS.tab = 'selectMode';
                }
                break;
            case 'custom':
                if (custom === 'ROTATE') {
                    let j = Math.floor(x / GS.squareside);
                    let i = Math.floor(y / GS.squareside);
                    
                    let jj = Math.floor(x / (GS.squareside / 9)) % 9;
                    let ii = Math.floor(y / (GS.squareside / 9)) % 9;
                    if (jj === 4 && ii === 4) {
                        custom = 'REMOVE';
                    }
                    else {
                        GS.squares[i][j].rotateCW(GS.duration);
                        GS.updateLights(i, j);
                        GS.updateLights(i - 1, j);
                        GS.updateLights(i + 1, j);
                        GS.updateLights(i, j - 1);
                        GS.updateLights(i, j + 1); 
                    }
                }
                else if (custom === 'REMOVE') {
                    let direction = '';
                    let j = Math.floor(x / GS.squareside);
                    let i = Math.floor(y / GS.squareside);
                    
                    let jj = Math.floor(x / (GS.squareside / 9)) % 9;
                    let ii = Math.floor(y / (GS.squareside / 9)) % 9;
                    let deleted = false;
                    if (jj === 4 && ii === 4) {
                        custom = 'ROTATE';
                    } 
                    else {
                        let r1 = y - (i * GS.squareside) <= x - (j * GS.squareside);
                        let r2 = - y + (i + 1) * GS.squareside <= x - (j * GS.squareside);
                        if (r1 && r2) {
                            direction = 'e';
                            if (GS.squares[i][j].e === 0) {
                                GS.squares[i][j].e = 1;
                            }
                            else {
                                GS.squares[i][j].e = 0;
                                deleted = true;
                            }
                        }
                        else if (!r1 && !r2) {
                            direction = 'w';
                            if (GS.squares[i][j].w === 0) {
                                GS.squares[i][j].w = 1;
                            }
                            else {
                                GS.squares[i][j].w = 0;
                                deleted = true;
                            }
                        }
                        else if (!r1 && r2) {
                            direction = 's';
                                if (GS.squares[i][j].s === 0) {
                                    GS.squares[i][j].s = 1;
                                }
                                else {
                                    GS.squares[i][j].s = 0;
                                    deleted = true;
                                }   
                        }
                        else if (r1 && !r2) {
                            direction = 'n';
                            if (GS.squares[i][j].n === 0){
                                GS.squares[i][j].n = 1;
                            }
                            else{
                                GS.squares[i][j].n = 0;
                                deleted = true;
                            }
                        }
                    }
                    // racchiundere in una funzione ? TODO
/*                     if (jj === 4) {
                        if (ii <= 3) {
                            direction = 'n';
                            if (GS.squares[i][j].n === 0){
                                GS.squares[i][j].n = 1;
                            }
                            else{
                                GS.squares[i][j].n = 0;
                                deleted = true;
                            }
                        }
                        else if (ii >= 5) {
                            direction = 's';
                            if (GS.squares[i][j].s === 0) {
                                GS.squares[i][j].s = 1;
                            }
                            else {
                                GS.squares[i][j].s = 0;
                                deleted = true;
                            }   
                        }
                        else if (ii === 4) {
                            custom = 'ROTATE';
                        }
                    }
                    else if (jj <= 3) {
                        direction = 'w';
                        if (GS.squares[i][j].w === 0) {
                            GS.squares[i][j].w = 1;
                        }
                        else {
                            GS.squares[i][j].w = 0;
                            deleted = true;
                        }
                    }
                    else if (jj >= 5) {
                        direction = 'e';
                        if (GS.squares[i][j].e === 0) {
                            GS.squares[i][j].e = 1;
                        }
                        else {
                            GS.squares[i][j].e = 0;
                            deleted = true;
                        }
                    } */
                    if (deleted) {
                        try {
                            let flag = getNeighbour(GS.squares, i, j, direction);
                            if (flag === false) {
                                switch(direction) {
                                    case 'n':
                                        GS.squares[i][j].n = 1;
                                        break;
                                    case 's': 
                                        GS.squares[i][j].s = 1;
                                        break;
                                    case 'w':
                                        GS.squares[i][j].w = 1; 
                                        break;
                                    case 'e': 
                                        GS.squares[i][j].e = 1;
                                        break;
                                } 
                            }
                        }
                        catch (TypeError) {
                            switch(direction) {
                                case 'n':
                                    GS.squares[i][j].n = 1;
                                    break;
                                case 's': 
                                    GS.squares[i][j].s = 1;
                                    break;
                                case 'w':
                                    GS.squares[i][j].w = 1; 
                                    break;
                                case 'e': 
                                    GS.squares[i][j].e = 1;
                                    break;
                            }
                            console.log('auch');
                        }
                    }
                    else {
                        try {
                            let flag = getNeighbourAdd(GS.squares, i, j, direction);
                            if (flag === false) {
                                switch(direction) {
                                    case 'n':
                                        GS.squares[i][j].n = 0;
                                        break;
                                    case 's': 
                                        GS.squares[i][j].s = 0;
                                        break;
                                    case 'w':
                                        GS.squares[i][j].w = 0; 
                                        break;
                                    case 'e': 
                                        GS.squares[i][j].e = 0;
                                        break;
                                } 
                            }
                        }
                        catch (TypeError) {
                            switch(direction) {
                                case 'n':
                                    GS.squares[i][j].n = 0;
                                    break;
                                case 's': 
                                    GS.squares[i][j].s = 0;
                                    break;
                                case 'w':
                                    GS.squares[i][j].w = 0; 
                                    break;
                                case 'e': 
                                    GS.squares[i][j].e = 0;
                                    break;
                            }
                            console.log('auch');
                        }
                    }
                    GS.updateLights(i, j);
                    GS.updateLights(i - 1, j);
                    GS.updateLights(i + 1, j);
                    GS.updateLights(i, j - 1);
                    GS.updateLights(i, j + 1);
                    
                    GS.squares[i][j].updatemaxConnect();
                }
                break;
            case 'mainMenu':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    GS.tab = 'selectMode';
                }
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 6 * l) {
                    GS.tab = 'highscoresMenu';
                }
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    GS.tab = 'options';
                }
                break;
            case 'options':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    GS.tab = 'animations';
                }
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 6 * l) {
                    GS.tab = 'graphics';
                }
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    GS.tab = 'sound';
                }
                else if (6 * l <= y && y <= 7 * l && 6 * l <= x && x <= 7 * l) {
                    GS.tab = 'mainMenu';
                }
                break;
            case 'animations':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    GS.duration = 600;
                }
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 6 * l) {
                    GS.duration = 220;
                }
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    GS.duration = 1;
                }
                else if (6 * l <= y && y <= 7 * l && 6 * l <= x && x <= 7 * l) {
                    GS.tab = 'options';
                }
                break;
            case 'sound':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    GS.sounds = 'NO MUSIC';
                }
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 6 * l) {
                    GS.sounds = 'NO CLICKS';
                }
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    GS.sounds = 'SILENT MODE';
                }
                else if (6 * l <= y && y <= 7 * l && 6 * l <= x && x <= 7 * l) {
                    GS.tab = 'options';
                }
                break;
            case 'graphics':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    GS.fps = 30;
                }
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 6 * l) {
                    GS.fps = 60;
                }
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    if (GS.graphics === 'ANTIALIASING ON')
                        GS.graphics = 'ANTIALIASING OFF';
                    else
                        GS.graphics = 'ANTIALIASING ON';
                }
                else if (6 * l <= y && y <= 7 * l && 6 * l <= x && x <= 7 * l) {
                    GS.tab = 'options';
                }
                break;
            case 'selectMode':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    GS.mode = 'NORMAL';
                    GS.copied = 'false';
                    GS.tab = 'difficultyMenu';
                }
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 6 * l) {
                    GS.mode = 'DUEL';
                    GS.copied = 'false';
                    GS.tab = 'difficultyMenu';
                }
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    GS.mode = 'CUSTOM';
                    GS.tab = 'customMenu';
                    GS.copied = 'false';
                    GS._columns = 4;
                    GS._rows = 4;

/*                     GS.squares = initiateGrid(5, 5);
                    GS.difficulty = 2;
                    for (let i = 0; i < GS.rows; i++) {
                        for(let j = 0; j < GS.columns; j++) {
                            GS.updateLights(i, j);
                            GS.squares[i][j].updatemaxConnect();
                    }}
                    GS.tab = 'custom';
                    GS.copied = 'false'; */
                }
                else if (6 * l <= y && y <= 7 * l && 6 * l <= x && x <= 7 * l) {
                    GS.tab = 'mainMenu';
                }
                break;
            case 'difficultyMenu':
                GS.clicks = 0;
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    setGameDiff(1);
                }
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 6 * l) {
                    setGameDiff(2);
                }
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    setGameDiff(3);
                }
                else if (6 * l <= y && y <= 7 * l && 6 * l <= x && x <= 7 * l) {
                    GS.tab = 'selectMode';
                }
                break;
            case 'highscores':
                if (6 * l <= y && y <= 7 * l && 6 * l <= x && x <= 7 * l) {
                    GS.tab = 'highscoresMenu';
                }
                break;
            case 'highscoresMenu':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    GS.show = 'NORMAL';
                    GS.tab = 'highscores';
                }
                else if (3 * l <= y && y <= 4 * l && l <= x && x <= 6 * l) {
                    GS.show = 'HIGH';
                    GS.tab = 'highscores';
                }
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    GS.show = 'EXTREME'
                    GS.tab = 'highscores';
                }
                else if (6 * l <= y && y <= 7 * l && 6 * l <= x && x <= 7 * l) {
                    GS.tab = 'mainMenu';
                }
                break;
            case 'readyCheck':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    sendReady();
                }
                else if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    copyToClip();
                }
                break;
            case 'pressToContinue':
                if (l <= y && y <= 2 * l && l <= x && x <= 6 * l) {
                    GS.tab = 'resultScreen';
                }
                break;
            case 'resultScreen':
                if (5 * l <= y && y <= 6 * l && l <= x && x <= 6 * l) {
                    GS.tab = 'selectMode';
                }   
                break;
            default:
                break;
        }
    });

    canvas.addEventListener('contextmenu', event => {
        event.preventDefault();
    });
    
    //check win conditions function
    function seSeiForteSali() {
        for (var i = 0; i < GS.rows; i++) {
            for (var j = 0; j < GS.columns; j++) {
/* 
                if (i === 0 && GS.squares[i][j].n) return;
                if (j === 0 && GS.squares[i][j].w) return;
                if (i === GS.rows - 1 && GS.squares[i][j].s) return;
                if (j === GS.columns - 1 && GS.squares[i][j].e) return;
                if (i !== 0 && GS.squares[i][j].n && !GS.squares[i - 1][j].s) return;
                if (j !== 0 && GS.squares[i][j].w && !GS.squares[i][j - 1].e) return;
                if (i !== GS.rows - 1 && GS.squares[i][j].s && !GS.squares[i + 1][j].n) return;
                if (j !== GS.columns - 1 && GS.squares[i][j].e && !GS.squares[i][j + 1].w) return; */

                if (GS.squares[i][j].connected != GS.squares[i][j].maxConnect) return;
            }
        }
        GS.stopTimer();
        //send NOTIFY
        ws.send(JSON.stringify({
            command: "NOTIFY",
            matchId: GS.matchId,
            clientId: GS.clientId,
            timer: GS.elapsedTime
        }));
        if (GS.mode == 'NORMAL') {
            GS.winner = GS.clientId;
            GS.winnerTime = GS.elapsedTime;
            GS.tab = "pressToContinue";
            //GS.tab = 'resultScreen';
            GS.state = 'CLOSED';
        }
        else if (GS.mode == 'DUEL') {
            GS.state = 'WAITING_FOR_RESULT';
        }
        switch (GS.difficulty) {
            case 1:
                GS.updateHighscores(GS.elapsedTime, 'NORMAL');
                break;
            case 2:
                GS.updateHighscores(GS.elapsedTime, 'HIGH');
                break;
            case 3:
                GS.updateHighscores(GS.elapsedTime, 'EXTREME');
                break;
        }
    } 

    var musicTime = 0;
    volumeOffIcon.onclick = function(e){
        GS.sounds = 'SILENT MODE';
 /*        music.pause();
        musicTime = music.currentTime;
        music.currentTime = 0; */
    };

    volumeIcon.onclick = function(e) {
        GS.sounds = 'NO CLICKS';
/*         music.currentTime = musicTime;
        music.play(); */
    };

    settingsIcon.onclick = function(e){
        GS.tab = 'mainMenu'
    };
   
    //draws main menu on canvas
    function drawMenu() {

        GS.stopTimer();
        
        ctx.save();
        timer.textContent = 'CYPHER';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let l = canvas.width / 7;
        let c  = (5 * l) / 16;
        ctx.font = c + 'px Roboto'
        //ctx.font = ' 25px Roboto';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = hover == 'NEW GAME' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('NEW GAME', canvas.width / 2, 1.5 * l);

        ctx.fillStyle = hover == 'HIGHSCORES' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, 3 * l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('HIGHSCORES', canvas.width / 2, 3.5 * l);

        ctx.fillStyle = hover == 'OPTIONS' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, 5 * l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('OPTIONS', canvas.width / 2, 5.5 * l);

        ctx.restore();
    }
    //draws options menu
    function drawOptions() {
        ctx.save();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let l = canvas.width / 7;
        let c  = (5 * l) / 16;
        ctx.font = c + 'px Roboto'
        //ctx.font = ' 25px Roboto';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = hover == 'ANIMATIONS' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('ANIMATIONS', canvas.width / 2, 1.5 * l);

        ctx.fillStyle = hover == 'GRAPHICS' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, 3 * l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('GRAPHICS', canvas.width / 2, 3.5 * l);

        ctx.fillStyle = hover == 'SOUNDS' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, 5 * l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('SOUNDS', canvas.width / 2, 5.5 * l);
        ctx.drawImage(back, 6 * l, 6 * l, l, l);

        ctx.restore();
    }

    function drawAnimationsMenu() {
        ctx.save();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let l = canvas.width / 7;
        let c  = (5 * l) / 16;
        ctx.font = c + 'px Roboto'
        //ctx.font = ' 25px Roboto';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = hover == 'NORMAL' ? '#4f5b62' : '#263238';
        if (GS.duration === 600) {
            ctx.fillStyle = '#000a12';}
        drawMaterialRect(l, l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('NORMAL', canvas.width / 2, 1.5 * l);

        ctx.fillStyle = hover == 'FAST' ? '#4f5b62' : '#263238';
        if (GS.duration === 220) {
            ctx.fillStyle = '#000a12';}
        drawMaterialRect(l, 3 * l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('FAST', canvas.width / 2, 3.5 * l);

        ctx.fillStyle = hover == 'DISABLED' ? '#4f5b62' : '#263238';
        if (GS.duration === 1) {
            ctx.fillStyle = '#000a12';}
        drawMaterialRect(l, 5 * l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('DISABLED', canvas.width / 2, 5.5 * l);
        ctx.drawImage(back, 6 * l, 6 * l, l, l);

        ctx.restore();
    }

    function drawGraphicsMenu() {
        ctx.save();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let l = canvas.width / 7;
        let c  = (5 * l) / 16;
        ctx.font = c + 'px Roboto'
        //ctx.font = ' 25px Roboto';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = hover == '30 FPS' ? '#4f5b62' : '#263238';
        if (GS.fps === 30) {
            ctx.fillStyle = '#000a12';}
        drawMaterialRect(l, l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('30 FPS', canvas.width / 2, 1.5 * l);

        ctx.fillStyle = hover == '60 FPS' ? '#4f5b62' : '#263238';
        if (GS.fps === 60) {
            ctx.fillStyle = '#000a12';}
        drawMaterialRect(l, 3 * l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('60 FPS', canvas.width / 2, 3.5 * l);

        ctx.fillStyle = hover == 'ANTIALIASING' ? '#4f5b62' : '#263238';
        if (GS.graphics === 'ANTIALIASING ON') {
            ctx.fillStyle = '#000a12';}
        drawMaterialRect(l, 5 * l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('ANTIALIASING', canvas.width / 2, 5.5 * l);
        ctx.drawImage(back, 6 * l, 6 * l, l, l);

        ctx.restore();
    }

    function drawSoundMenu() {
        ctx.save();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let l = canvas.width / 7;
        let c  = (5 * l) / 16;
        ctx.font = c + 'px Roboto'
        //ctx.font = ' 25px Roboto';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = hover == 'NO MUSIC' ? '#4f5b62' : '#263238';
        if (GS.sounds === "NO MUSIC") {
            ctx.fillStyle = '#000a12';}
        drawMaterialRect(l, l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('NO MUSIC', canvas.width / 2, 1.5 * l);

        ctx.fillStyle = hover == 'NO CLICKS' ? '#4f5b62' : '#263238';
        if (GS.sounds === "NO CLICKS") {
            ctx.fillStyle = '#000a12';}
        drawMaterialRect(l, 3 * l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('NO CLICKS', canvas.width / 2, 3.5 * l);

        ctx.fillStyle = hover == 'SILENT MODE' ? '#4f5b62' : '#263238';
        if (GS.sounds === "SILENT MODE") {
            ctx.fillStyle = '#000a12';}
        drawMaterialRect(l, 5 * l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('SILENT MODE', canvas.width / 2, 5.5 * l);
        ctx.drawImage(back, 6 * l, 6 * l, l, l);

        ctx.restore();
    }

    //draws difficulty menu 
    function drawDifficultyMenu() {
        ctx.save();

        timer.textContent = 'Select the difficulty to play!';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let l = canvas.width / 7;
        let c  = (5 * l) / 16;
        ctx.font = c + 'px Roboto'
        //ctx.font = '25px Roboto';

        ctx.fillStyle = hover == 'NORMAL' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, l, 5 * l, l);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('NORMAL', canvas.width / 2, 1.5 * l);

        ctx.fillStyle = hover == 'HIGH' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, 3 * l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('HIGH', canvas.width / 2, 3.5 * l);

        ctx.fillStyle = hover == 'EXTREME' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, 5 * l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('EXTREME', canvas.width / 2, 5.5 * l);
        ctx.drawImage(back, 6 * l, 6 * l, l, l);

        ctx.restore();
    }
    //sets difficulty from 1 to 3
    function setGameDiff(diff) {
        GS.difficulty = diff;
        ws.send(JSON.stringify({
            command: "CREATE",
            mode: GS.mode,
            difficulty: diff
        }));
    }
    //draw highscores
    function drawHighscoresTab() {
        ctx.save();

        let l = canvas.width / 7;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let c  = (5 * l) / 16;
        ctx.font = 'bold ' + c + 'px Roboto'
        //ctx.font = 'bold 25px Roboto';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#263238';
        drawMaterialRect(l / 2, l, 6 * l, l);
        drawMaterialRect(l, l * 2.5, 5 * l, 4 * l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('HIGHSCORES', canvas.width / 2, 1.5 * l);

        //scrive i 4 highscores
        
        c = ((5 * l) / 16) - 5;
        ctx.font = c + 'px Roboto';
        //ctx.font = '20px Roboto';
        switch(GS.show) {
            case 'NORMAL':
                for (let i = 0; i < 4 ; i++) {
                    if ( i >= GS.highscores1.length )
                        ctx.fillText((i + 1) + '.   00:00.00',
                        canvas.width / 2, (i + 3) * l);
                    else 
                    ctx.fillText((i + 1) + '.    ' + toTime1String(GS.highscores1[i]),
                    canvas.width / 2, (i + 3) * l);
                }
                break;
            case 'HIGH':
                for (let i = 0; i < 4 ; i++) {
                    if ( i >= GS.highscores2.length )
                        ctx.fillText((i + 1) + '.   00:00.00',
                        canvas.width / 2, (i + 3) * l);
                    else 
                    ctx.fillText((i + 1) + '.    ' + toTime1String(GS.highscores2[i]),
                    canvas.width / 2, (i + 3) * l);
                }
                break;
            case 'EXTREME':
                for (let i = 0; i < 4 ; i++) {
                    if ( i >= GS.highscores3.length )
                        ctx.fillText((i + 1) + '.   00:00.00',
                        canvas.width / 2, (i + 3) * l);
                    else 
                    ctx.fillText((i + 1) + '.    ' + toTime1String(GS.highscores3[i]),
                    canvas.width / 2, (i + 3) * l);
                }
                break;
        }
        ctx.drawImage(back, 6 * l, 6 * l, l, l);
        ctx.restore();
    }

    function drawHighscoresMenu() {
        ctx.save();

        timer.textContent = 'Select the difficulty to view';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let l = canvas.width / 7;
        let c  = (5 * l) / 16;
        ctx.font = c + 'px Roboto';
        //ctx.font = '25px Roboto';

        ctx.fillStyle = hover == 'NORMAL' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, l, 5 * l, l);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('NORMAL', canvas.width / 2, 1.5 * l);

        ctx.fillStyle = hover == 'HIGH' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, 3 * l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('HIGH', canvas.width / 2, 3.5 * l);

        ctx.fillStyle = hover == 'EXTREME' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, 5 * l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('EXTREME', canvas.width / 2, 5.5 * l);
        ctx.drawImage(back, 6 * l, 6 * l, l, l);

        ctx.restore();
    }
    function drawReadyCheck() {
        ctx.save();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let l = canvas.width / 7;
        let c  = (5 * l) / 16;
        ctx.font = c + 'px Roboto';
        //ctx.font = ' 25px Roboto';

        ctx.fillStyle = hover == 'READY!' ? '#4f5b62' : '#263238';
        if (GS.state == 'READY_PLAYER_1' || GS.state == 'READY_PLAYER_2') {
            ctx.fillStyle = '#000a12';
        }
        drawMaterialRect(l, l, 5 * l, l);
        console.log(GS.state);
        console.log(GS.tab);
        ctx.stroke();
        ctx.fill();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('READY!', canvas.width / 2, 1.5 * l)
        ctx.fillStyle = 'black';

        //se sono l'host
        if (GS.clientId == 1) {
            ctx.beginPath();
            ctx.fillText('Send this link to invite to your game!', canvas.width / 2, 3.5 * l);
            ctx.fillText('http:/' + GS.hostname + '/?matchid=' + GS.matchId,
                canvas.width / 2, (3.5 * l) + 40);
            
            ctx.fillStyle = hover == 'COPY TO CLIPBOARD' ? '#4f5b62' : '#263238';
            drawMaterialRect(l, 5 * l, 5 * l, l);
            ctx.fillStyle = '#ffffff';
            if (GS.copied == 'false') { 
                ctx.fillText('COPY TO CLIPBOARD', canvas.width / 2, 5.5 * l);}
            else if (GS.copied == 'true') {
                ctx.fillText('LINK COPIED', canvas.width / 2, 5.5 * l);}
        }
        ctx.restore();
    }

    function drawCustomMode() {
        ctx.save();

        if (custom === 'REMOVE')
            timer.textContent = 'Click on the red dots to switch to Rotate Mode!';
        else timer.textContent = 'Click on the red dots to switch to Remove Mode!';
        // insert columns e rows TODO
        ctx.clearRect(0, 0, canvas.width, canvas.height);
       
        for (let i = 0; i < GS.rows; i++) {
            for(let j = 0; j < GS.columns; j++) {
                ctx.save();

                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.translate(j * GS.squareside, i * GS.squareside);
                ctx.moveTo(0, 0);
                ctx.lineTo(GS.squareside, 0);
                ctx.lineTo(GS.squareside, GS.squareside);
                ctx.lineTo(0, GS.squareside);
                ctx.lineTo(0, 0);
                ctx.stroke();

                ctx.restore(); 
            }}
        drawPattern();
        // function getNeighbour(squares, i, j, direction)
        ctx.restore();
    }
    function drawSelectMode() {
        ctx.save();

        timer.textContent = 'Select Mode';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let l = canvas.width / 7;
        let c  = (5 * l) / 16;
        ctx.font = c + 'px Roboto'
        //ctx.font = '25px Roboto';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        

        ctx.fillStyle = hover == 'NORMAL' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('SINGLE PLAYER', canvas.width / 2, 1.5 * l)

        ctx.fillStyle = hover == 'DUEL' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, 3 * l, 5 * l, l)
        ctx.fillStyle = '#ffffff';
        ctx.fillText('DUEL', canvas.width / 2, 3.5 * l);

        ctx.fillStyle = hover == 'CUSTOM' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, 5 * l, 5 * l, l)
        ctx.fillStyle = '#ffffff';
        ctx.fillText('CUSTOM', canvas.width / 2, 5.5 * l);
        ctx.drawImage(back, 6 * l, 6 * l, l, l);

        ctx.restore();
    }

    function drawCustomMenu() {
        ctx.save();

        timer.textContent = 'Select rows and columns number';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let l = canvas.width / 7;
        let c  = (3.5 * l) / 16;
        ctx.font = c + 'px Roboto'
        //ctx.font = '20px Roboto';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = hover == 'LESS COLUMNS' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, l, 2.5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('LESS COLUMNS', (2.5 * l) / 2 + l, 1.5 * l)

        ctx.fillStyle = hover == 'MORE COLUMNS' ? '#4f5b62' : '#263238';
        drawMaterialRect(3.5 * l, l, 2.5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('MORE COLUMNS', (2.5 * l) / 2 + (3.5 * l), 1.5 * l);

        ctx.fillStyle = hover == 'LESS ROWS' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, 3 * l, 2.5 * l, l)
        ctx.fillStyle = '#ffffff';
        ctx.fillText('LESS ROWS', (2.5 * l) / 2 + l, 3.5 * l);
        ctx.fillStyle = hover == 'MORE ROWS' ? '#4f5b62' : '#263238';
        drawMaterialRect(3.5 * l, 3 * l, 2.5 * l, l)
        ctx.fillStyle = '#ffffff';
        ctx.fillText('MORE ROWS', (2.5 * l) / 2 + (3.5 * l), 3.5 * l);

        c  = (5 * l) / 16;
        ctx.font = c + 'px Roboto';
        ctx.fillStyle = 'black';
        ctx.fillText(GS._rows, canvas.width / 2, 4.5 * l);

        ctx.fillStyle = 'black';
        ctx.fillText(GS._columns, canvas.width / 2, 2.5 * l);

        ctx.font = c + 'px Roboto'
        //ctx.font = '25px Roboto';
        ctx.fillStyle = hover == 'CONFIRM' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, 5 * l, 5 * l, l)
        ctx.fillStyle = '#ffffff';
        ctx.fillText('CONFIRM!', canvas.width / 2, 5.5 * l);
        ctx.drawImage(back, 6 * l, 6 * l, l, l);

        ctx.restore();
        
    }


    function drawResultScreen(winner, time) {
        ctx.save();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let l = canvas.width / 7;
        let c  = (5 * l) / 16;
        ctx.font = 'bold ' + c + 'px Roboto'
        //ctx.font = 'bold 30px Roboto';
/*         ctx.shadowColor = 'black';
        ctx.shadowOffsetX = 6;
        ctx.shadowOffsetY = 8;
        ctx.shadowBlur = 30; */
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#263238';
        drawMaterialRect(l - (l / 2) , l, (6 * l), l);
        ctx.fillStyle = '#ffffff';
        //io sono il vincitore
        if (winner == GS.clientId) {
            ctx.fillText('YOU WIN !', canvas.width / 2, 1.5 * l);
        }
        else {
            ctx.fillText('PLAYER 2 WINS', canvas.width / 2, 1.5 * l);
        }
        c  = (5 * l) / 16;
        ctx.font = c + 'px Roboto'
        //ctx.font = '25px Roboto';
        ctx.fillStyle = '#263238';
        drawMaterialRect(l, (3 * l) - 40, 5 * l, l + 80);
        ctx.fillStyle = '#ffffff';
        ctx.fillText("TIME: " + toTime1String(time), canvas.width / 2, (3.5 * l) - 40);
        ctx.fillText("CLICKS: " + GS.clicks, canvas.width / 2, (3.5 * l));
        let difficulty;
        switch(GS.difficulty) {
            case 1: difficulty = "NORMAL";
                break;
            case 2: difficulty = "HIGH";
                break;
            case 3: difficulty = "EXTREME";
                break;
            default: break;
        }
        ctx.fillText("DIFFICULTY: " + difficulty, canvas.width / 2, (3.5 * l) + 40);

        ctx.fillStyle = hover == 'PLAY AGAIN' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, 5 * l, 5 * l, l);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('PLAY AGAIN', canvas.width / 2, 5.5 * l);
        
        ctx.restore();
    }

    function drawPressToContinue() {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < GS.rows; i++) {
            for(let j = 0; j < GS.columns; j++) {
                ctx.save();
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.translate(j * GS.squareside, i * GS.squareside);
                ctx.moveTo(0, 0);
                ctx.lineTo(GS.squareside, 0);
                ctx.lineTo(GS.squareside, GS.squareside);
                ctx.lineTo(0, GS.squareside);
                ctx.lineTo(0, 0);
                ctx.stroke();
                ctx.restore(); 
        }}
        drawPattern();
        let l = canvas.width / 7;
        let c  = (5 * l) / 16;
        ctx.font = 'bold ' + c + 'px Roboto'
        //ctx.font = 'bold 25px Roboto';
        ctx.fillStyle = hover == 'PRESSTOCONTINUE' ? '#4f5b62' : '#263238';
        drawMaterialRect(l, l, 5 * l, l);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Press to continue!', canvas.width / 2, 1.5 * l);

        ctx.restore();
    }
    
    function sendReady() {
        ws.send(JSON.stringify({
            command: 'READY',
            matchId: GS.matchId,
            clientId: GS.clientId
        }));
        if (GS.clientId == 1){
            GS.state = 'READY_PLAYER_1';
        }
        else GS.state = 'READY_PLAYER_2'
    }

    var ws = new WebSocket('ws://localhost:3000/socket');
    //var ws = new WebSocket('ws:/' + GS.hostname + '/socket');
    //var ws = new WebSocket('ws://10.101.54.121:3000/socket'); //pisa
    //var ws = new WebSocket('ws://192.168.1.137:3000/socket'); //casa
    //var ws = new WebSocket('ws://192.168.0.103:3000/socket'); //casa ct

    ws.addEventListener('message', function(event) {
        let parsedMsg = JSON.parse(event.data);
        switch (parsedMsg.command) {
            case 'SEND_SEED':
                GS.squares = parsedMsg.pattern.map(row => row.map(SquarePattern.fromJSON));
                GS.clientId = parsedMsg.clientId;
                GS.matchId = parsedMsg.matchId;
                GS.difficulty = parsedMsg.difficulty;
                for (let i = 0; i < GS.rows; i++) {
                    for(let j = 0; j < GS.columns; j++) {
                        GS.updateLights(i, j);
                        GS.squares[i][j].updatemaxConnect();
                    }}
                if (GS.mode == 'NORMAL') {
                    GS.state = 'PLAYING';
                    GS.tab = 'game';
                    GS.startTimer(timer);
                }
                else if (GS.mode == 'DUEL') {
                    //console.log('DUEL IS ON');
                    GS.state = 'WAITING';
                    if (GS.clientId == 2) {
                        GS.tab = 'readyCheck';
                    }
                    else {
                        GS.tab = 'readyCheck';
                    }}
                break;
            case 'NOTIFY':
                console.log("NOTIFIED")
                GS.clientId = parsedMsg.clientId;
                GS.matchId = parsedMsg.matchId;
                //se se sono in stato 'PLAYING' mando GIVE_UP
                if (GS.state == 'PLAYING') {
                    GS.state = 'WAITING_FOR_RESULT';
                    GS.tab = 'pressToContinue';
                    //cambiare schermata
                    GS.stopTimer();
                    ws.send(JSON.stringify({
                        command: 'GIVE_UP',
                        matchId: GS.matchId,
                        clientId: GS.clientId
                    }));
                    break;
                }
                //se sono in stato WAITING_FOR_RESULT non faccio nulla
                else if (GS.state == 'WAITING_FOR_RESULT') {
                    break;
                }
                break;
            case 'START':
                GS.clientId = parsedMsg.clientId;
                GS.matchId = parsedMsg.matchId;
                GS.state = 'PLAYING';
                GS.tab = 'game';
                GS.startTimer(timer);
                break;
            case 'RESULT':
                GS.state = 'CLOSED';
                GS.winnerTime = parsedMsg.timer;
                GS.winner = parsedMsg.winner;
                GS.tab = "pressToContinue";
                //GS.tab = 'resultScreen';
                break;
            case 'ERROR':
                alert(parsedMsg.text);
                break; 
        }
    });

    ws.addEventListener('open', () => {
        if (linkId) {
            ws.send(JSON.stringify({
                command: 'JOIN',
                matchId: linkId,
                clientId: 2
            }));
            GS.mode = 'DUEL';
        }
    });

    function drawMaterialRect(x, y, width, height) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + 4, y);
        ctx.lineTo(x + width - 4, y);
        ctx.arc(x + width - 4, y + 4, 4, - (Math.PI / 2), 0, false);
        ctx.lineTo(x + width, y + height - 4);
        ctx.arc(x + width - 4, y + height - 4, 4, 0, Math.PI / 2, false);
        ctx.lineTo(x + 4, y + height);
        ctx.arc(x + 4, y + height - 4, 4, Math.PI / 2, Math.PI, false);
        ctx.lineTo(x, y + 4);
        ctx.arc(x + 4, y + 4, 4, Math.PI, (Math.PI / 2) * 3, false);
        ctx.shadowColor = 'black';
        ctx.shadowOffsetX = 6;
        ctx.shadowOffsetY = 8;
        ctx.shadowBlur = 30;
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }

    function drawBzzFlow(ctx, bzz, nwes, x3, y3, x4, y4) {
        
        if (nwes === "n" || nwes === "s") {
            switch (Math.floor(Date.now() % 4)) {
                case 1:
                    if (GS.graphics == 'ANTIALIASING ON')
                        ctx.imageSmoothingQuality = "medium";
                    ctx.drawImage(bzz, 0, 0, 128, 512, x3, y3, x4, y4);
                    break;
                case 2:
                if (GS.graphics == 'ANTIALIASING ON')
                        ctx.imageSmoothingQuality = "medium";
                    ctx.drawImage(bzz, 128, 0, 128, 512, x3, y3, x4, y4);
                    break;
                case 3:
                if (GS.graphics == 'ANTIALIASING ON')
                        ctx.imageSmoothingQuality = "medium";
                    ctx.drawImage(bzz, 256, 0, 128, 512, x3, y3, x4, y4);
                    break;
                case 0:
                if (GS.graphics == 'ANTIALIASING ON')
                        ctx.imageSmoothingQuality = "medium";
                    ctx.drawImage(bzz, 384, 0, 128, 512, x3, y3, x4, y4);
                    break;
                default:
                    break;
            }
        }
        if (nwes === "w" || nwes === "e") {
            switch (Math.floor(Date.now() % 4)) {
                case 1:
                if (GS.graphics == 'ANTIALIASING ON')
                        ctx.imageSmoothingQuality = "medium";
                    ctx.drawImage(bzz, 0, 0, 512, 128, x3, y3, x4, y4);
                    break;
                case 2:
                if (GS.graphics == 'ANTIALIASING ON')
                        ctx.imageSmoothingQuality = "medium";
                    ctx.drawImage(bzz, 0, 128, 512, 128, x3, y3, x4, y4);
                    break;
                case 3:
                if (GS.graphics == 'ANTIALIASING ON')
                        ctx.imageSmoothingQuality = "medium";
                    ctx.drawImage(bzz, 0, 256, 512, 128, x3, y3, x4, y4);
                    break;
                case 0:
                if (GS.graphics == 'ANTIALIASING ON')
                        ctx.imageSmoothingQuality = "medium";
                    ctx.drawImage(bzz, 0, 384, 512, 128, x3, y3, x4, y4);
                    break;
                default:
                    break;
            }
        }
    }

    function copyToClip() {
        var copyText = document.getElementById('myInput');
/*         copyText.value = 'http://192.168.0.103:3000/' + '?matchid=' + GS.matchId;
        //copyText.focus();
        copyText.select();
        

        if (document.execCommand("copy")) {
            GS.copied = 'true';
            alert("Copied the text: " + copyText.value);
        } */
        //alert(window.isSecureContext);
        let string = 'http:/' + GS.hostname + '/?matchid=' + GS.matchId;
        navigator.clipboard.writeText(string).then(function(){
            GS.copied = 'true';
        }, function () {
            alert('NOT PERMITTED TO WRITE CLIPBOARD');
        });
    }
    requestAnimationFrame(() => redraw(Date.now()));

}
//var parsed = JSON.parse();
//var squares = parsed.pattern.map(row => row.map(SquarePattern.fromJSON));
/*
{
    command: "CREATE",
    mode: "SINGLE",
    difficulty: 1
}
{
    command: "JOIN",
    matchid: "ID"
}
{
    command: "NOTIFY",
    matchid: "ID" ,
    clientId: 
}
{
    command: "READY",
    matchId: "ID",
    clientId: "ID"
}
*/


 /*         //ctx.lineCap = 'round';
                //ctx.strokeStyle = 'red';
                ctx.translate(j * GS.squareside, i * GS.squareside);
                drawSticks(GS.squares[i][j], GS.squareside);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                //ctx.arc(0, 0, GS.squareside / 20, 0, Math.PI * 2, false);
                // manca 0      #ff3300  #991f00
                // manca 1      #ff5c33
                // mancano 2    #ff8566
                // mancano 3    #ffad99
                // cambiare con icona lights TODO
                if (GS.squares[i][j].maxConnect == 0) {
                    ctx.drawImage(light_off, 0, 0, 275, 275, -GS.squareside / 20, -GS.squareside / 20, GS.squareside / 10, GS.squareside / 10);
                    ctx.fillStyle = '#000000';
                }
                else if (GS.squares[i][j].connected == GS.squares[i][j].maxConnect) {
                    ctx.drawImage(light_on, 0, 0, 275, 275, -GS.squareside / 20, -GS.squareside / 20, GS.squareside / 10, GS.squareside / 10);
                    //ctx.fillStyle = '#991f00';
                }
                else if (GS.squares[i][j].connected == GS.squares[i][j].maxConnect - 1 && 
                    GS.squares[i][j].maxConnect >= 2) {
                    ctx.drawImage(light_off, 0, 0, 275, 275, -GS.squareside / 20, -GS.squareside / 20, GS.squareside / 10, GS.squareside / 10);
                    //ctx.fillStyle = '#ff5c33';
                }
                else if (GS.squares[i][j].connected == GS.squares[i][j].maxConnect - 2 &&
                    GS.squares[i][j].maxConnect >= 3) {
                    ctx.drawImage(light_off, 0, 0, 275, 275, -GS.squareside / 20, -GS.squareside / 20, GS.squareside / 10, GS.squareside / 10);
                    //ctx.fillStyle = '#ff8566';
                }
                else if (GS.squares[i][j].connected == GS.squares[i][j].maxConnect - 3 &&
                    GS.squares[i][j].maxConnect == 4) {
                    ctx.drawImage(light_off, 0, 0, 275, 275, -GS.squareside / 20, -GS.squareside / 20, GS.squareside / 10, GS.squareside / 10);
                    //ctx.fillStyle = '#ffad99';
                } 
                //ctx.fill();
                ctx.closePath();

                ctx.restore(); */