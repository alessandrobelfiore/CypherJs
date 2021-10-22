var SquarePattern = require('./SquarePattern.js');

module.exports = {
    initSeed: initSeed
}

function initSeed(diff) {
    let rows, columns;
    if (diff === 1) {
        rows = 4;
        columns = 4;
    }
    else if (diff === 2) {
        rows = 5;
        columns = 5;
    }
    else if (diff === 3) {
        rows = 8;
        columns = 8;
    }
    let squares = initiateGrid(rows, columns);
    randomizePattern(squares);
    return squares.map(row => row.map(SquarePattern.toJSON))
}

function initiateGrid(rows, columns) {
    let squares = [];
    for (let i = 0; i < rows; i++) {
        squares[i] = [];
        for (let j = 0; j < columns; j++) {
            if (i === 0 && j === 0)
                squares[i][j] = new SquarePattern(0, 1, 1, 0);
            else if (i === 0 && j === columns - 1)
                squares[i][j] = new SquarePattern(0, 0, 1, 1);
            else if (i === 0)
                squares[i][j] = new SquarePattern(0, 1, 1, 1);
            else if (i === rows - 1 && j === 0)
                squares[i][j] = new SquarePattern(1, 1, 0, 0);
            else if (i === rows - 1 && j === columns - 1)
                squares[i][j] = new SquarePattern(1, 0, 0, 1);
            else if (i === rows - 1)
                squares[i][j] = new SquarePattern(1, 1, 0, 1);
            else if (j === 0)
                squares[i][j] = new SquarePattern(1, 1, 1, 0);
            else if (j === columns - 1)
                squares[i][j] = new SquarePattern(1, 0, 1, 1);
            else
                squares[i][j] = new SquarePattern(1, 1, 1, 1);
        }
    }
    return squares;
}

function getNeighbour(squares, i, j, direction){
    if (direction === 'n') {
        squares[i - 1][j].s = 0;
        //squares[i - 1][j].maxConnect --;
    }
    else if (direction === 'w') {
        squares[i][j - 1].e = 0;
        //squares[i][j - 1].maxConnect --;
    }
    else if (direction === 's') {
        squares[i + 1][j].n = 0;
        //squares[i + 1][j].maxConnect --;
    }
    else if (direction === 'e') {
        squares[i][j + 1].w = 0;
        //squares[i][j + 1].maxConnect --;
    }
}
//randomizes sticks pattern
function randomizeSquare(squares, i, j, square) {
    let count = square.n + square.e + square.s + square.w;
    
    if (count <= 1)
        return;
    if (square.n === 1) 
        if (Math.random() >= 0.8) {
            squares[i][j].n = 0;
            //squares[i][j].maxConnect --;
            count--;
            getNeighbour(squares, i, j, 'n');
        }
    if (count <= 1)
        return;
    if (square.w === 1)
        if (Math.random() >= 0.8) {
            squares[i][j].w = 0;
            //squares[i][j].maxConnect --;
            count--;
            getNeighbour(squares, i, j, 'w');
        }
    if (count <= 1)
        return;
    if (square.s === 1)
        if (Math.random() >= 0.7) {
            squares[i][j].s = 0;
            //squares[i][j].maxConnect --;
            count--;
            getNeighbour(squares, i, j, 's');
        }
    if (count <= 1)
        return;
    if (square.e === 1)
        if (Math.random() >= 0.7) {
            squares[i][j].e = 0;
            //squares[i][j].maxConnect --;
            count--;
            getNeighbour(squares, i, j, 'e');
        }
    //square.maxConnect = count;
    //squares[i][j].updatemaxConnect();
    //console.log(squares[i][j].maxConnect);
}
//randomize Pattern function
function randomizePattern(squares) {
    squares.map((row, i) => row.map((square, j) => randomizeSquare(squares, i, j, square)));
    /*  for (var i = 0; i < squares.length; i++) {
        for(var j = 0; j < squares[i].length; j++) {
            randomizeSquare(squares, i, j, squares[i][j]);
        }
    }  */

    shufflePattern(squares);
}
//rotates the pattern
function shufflePattern(squares) {
    for (let i = 0; i < squares.length; i++) {
        for (let j = 0; j < squares[i].length; j++) {
            for (let k = 0; k < Math.round(Math.random() * 3); k++)  {
                squares[i][j].rotateCW();
            }
        }
    }
}