//import initSeed as initSeed from '/modules'


var express = require('express');
var expressWs = require('express-ws');
var game = require('./CreateSeed.js');

var app = express();
var ws = expressWs(app);

/* 
STATES =
    WAITING_TO_JOIN,
    PRESS_PLAY
    READY_PLAYER_1
    READY_PLAYER_2
    RUNNING
    NOTIFYING
    CLOSED
 */
class instance {
    constructor(matchId, seed, mode, diff, s1){
        this._matchId = matchId;
        this._seed = seed;
        this._state;
        this._mode = mode;
        this._diff = diff;
        this._socket1 = s1;
        this._socket2;
        this._timer;
        this._winner;
        if (mode == 'NORMAL') {
            this._state = 'RUNNING';
        }
        else if (mode == 'DUEL') {
            this._state = 'WAITING_TO_JOIN';
        }
    }
    get matchId() {
        return this._matchId;
    }
    get state() {
        return this._state;
    }
    get serverTime() {
        return this._serverTime;
    }
    get diff() {
        return this._diff;
    }
    get seed() {
        return this._seed;
    }
    get socket1() {
        return this._socket1;
    }
    get socket2() {
        return this._socket2;
    }
    get mode() {
        return this._mode;
    }
    get timer() {
        return this._timer;
    }
    get winner() {
        return this._winner
    }

    set winner(v) {
        this._winner = v;
    }
    set timer(v) {
        this._timer = v;
    }
    set state(v) {
        this._state = v;
    }
    set diff(v) {
        this._diff = diff;
    }
    set socket1(v) {
        this._socket1 = v;
    }
    set socket2(v) {
        this._socket2 = v;
    }
}
//array di partite
var matches = [];

//numero di match giocati
var count = 0;

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

app.ws('/socket', function(ws, req) {
    ws.on('message', function(msg) {
        let parsedMsg = JSON.parse(msg);
        let matchId;
        let clientId;
        let match;
        let seed;
        switch (parsedMsg.command) {
            case 'CREATE':
                let diff = parsedMsg.difficulty;
                let mode = parsedMsg.mode;
                ws.isAlive = true;
                seed = game.initSeed(diff);
                matches.push(new instance(count, seed, mode, diff, ws));
                ws.send(JSON.stringify({
                    command: 'SEND_SEED',
                    clientId: 1,
                    matchId: count,
                    pattern: seed
                }));
                console.log('SERVER RECEIVED CREATE, MATCHID: ' + count);
                console.log(ws.readyState);
                count ++;
                break;
            case 'JOIN':
                matchId = parsedMsg.matchId;
                //trova partita con matchId corrispondente
                // out of border
                if (matchId >= matches.length) {
                    ws.send(JSON.stringify({
                        command: 'ERROR',
                        text: 'MATCH NOT EXISTING, CREATE A NEW ONE!'
                    }));
                    break;
                }
                match = matches[matchId];
                // se qualcuno è già entrato nella partita ignora
                if (match.state != 'WAITING_TO_JOIN' && match.state != 'READY_PLAYER_1') {
                    ws.send(JSON.stringify({
                        command: 'ERROR',
                        text: 'LINK EXPIRED, TRY AGAIN!'
                    }));
                    break;}
                seed = match.seed;
                ws.isAlive = true;
                match.socket2 = ws;
                if (match.state == 'READY_PLAYER_1') match.state = 'READY_PLAYER_1';
                else match.state = 'PRESS_PLAY';
                ws.send(JSON.stringify({
                    command: 'SEND_SEED',
                    clientId: 2,
                    difficulty: match.diff,
                    matchId: matchId,
                    pattern: seed
                }));
                console.log('SERVER RECEIVED JOIN, MATCHID: ' + matchId 
                + ' CURRRENT STATE: ' + match.state);
                break;
            case 'NOTIFY':
                //salva il timer della partita e rispedisce notify
                matchId = parsedMsg.matchId;
                clientId = parsedMsg.clientId;
                match = matches[matchId];
                let timer = parsedMsg.timer;
                if (match.mode == 'NORMAL') {
                    match.state = 'CLOSED';
                    match.timer = timer;
                    match.winner = clientId;
                    ws.send(JSON.stringify({
                        command: 'RESULT',
                        clientId: 1,
                        matchId: matchId,
                        timer: match.timer,
                        winner: match.winner
                        }));
                    console.log('SERVER RECEIVED NOTIFY, MATCHID: ' + matchId
                    + ' CLOSED');
                    break;
                }
                else if (match.mode == 'DUEL') {
                    //se è la prima NOTIFY aggiorno timer e avverto l'altro client
                    if (match.timer == undefined ) {
                        match.state = 'NOTIFYING';
                        match.timer = timer;
                        match.winner = clientId;
                        if (clientId == 1) {
                            //se l'altro client è vivo, NOTIFY
                            if (match.socket2.readyState == 1) {
                                match.socket2.send(JSON.stringify({
                                    command: 'NOTIFY',
                                    clientId: 2,
                                    matchId: matchId,
                                    timer: match.timer
                                }));
                            }
                            // se ha già abbandonato, mando result
                            else {
                                match.socket1.send(JSON.stringify({
                                    command: 'RESULT',
                                    clientId: 1,
                                    matchId: matchId,
                                    timer: match.timer,
                                    winner: match.winner
                                }));
                                match.state = 'CLOSED';
                                console.log('SERVER SENDING RESULT, MATCHID: ' + matchId
                                + ' WINNER: ' + match.winner + ' TIME: ' + match.timer
                                + ' CURRENT STATE: ' + match.state);
                            }}
                        else {
                            //se l'altro client è vivo, NOTIFY
                            if (match.socket1.readyState == 1) {
                                match.socket1.send(JSON.stringify({
                                    command: 'NOTIFY',
                                    clientId: 1,
                                    matchId: matchId,
                                    timer: match.timer
                                }));}
                            // se ha già abbandonato mando result
                            else {
                                match.socket2.send(JSON.stringify({
                                    command: 'RESULT',
                                    clientId: 2,
                                    matchId: matchId,
                                    timer: match.timer,
                                    winner: match.winner
                                }));
                                match.state = 'CLOSED';
                                console.log('SERVER SENDING RESULT, MATCHID: ' + matchId
                                + ' WINNER: ' + match.winner + ' TIME: ' + match.timer
                                + ' CURRENT STATE: ' + match.state);
                            }}
                    console.log('SERVER RECEIVED NOTIFY, MATCHID: ' + matchId
                    + ' TIMER: ' + match.timer + ' CURRENT STATE: ' + match.state);
                    }
                    //seconda NOTIFY, ma vincente 
                    else if (timer < match.timer) {
                        match.state = 'CLOSED';
                        match.timer = timer;
                        match.winner = clientId;
                        match.socket1.send(JSON.stringify({
                            command: 'RESULT',
                            clientId: 1,
                            matchId: matchId,
                            timer: match.timer,
                            winner: match.winner
                            }));
                        match.socket2.send(JSON.stringify({
                            command: 'RESULT',
                            clientId: 2,
                            matchId: matchId,
                            timer: match.timer,
                            winner: match.winner
                            }));
                    console.log('SERVER SENDING RESULT, MATCHID: ' + matchId
                    + ' WINNER: ' + match.winner + ' TIME: ' + match.timer
                    + ' CURRENT STATE: ' + match.state);
                    }
                    //seconda NOTIFY, ma perdente
                    else if (timer >= match.timer) {
                        match.state = 'CLOSED';
                        match.socket1.send(JSON.stringify({
                            command: 'RESULT',
                            clientId: 1,
                            matchId: matchId,
                            timer: match.timer,
                            winner: match.winner
                            }));
                        match.socket2.send(JSON.stringify({
                            command: 'RESULT',
                            clientId: 2,
                            matchId: matchId,
                            timer: match.timer,
                            winner: match.winner
                            }));
                    console.log('SERVER SENDING RESULT, MATCHID: ' + matchId
                    + ' WINNER: ' + match.winner + ' TIME: ' + match.timer
                    + ' CURRENT STATE: ' + match.state);      
                    }
                }
                break;
            case 'READY':
                //switcha state fino a che non sono pronti, manda START
                matchId = parsedMsg.matchId;
                clientId = parsedMsg.clientId;
                match = matches[matchId];
                if (clientId === 1) {
                    if (match.state === 'READY_PLAYER_2') {
                        match.state = 'RUNNING';
                        //manda start
                        match.socket1.send(JSON.stringify({
                            command: 'START',
                            clientId: 1,
                            matchId: matchId
                        }));
                        match.socket2.send(JSON.stringify({
                            command: 'START',
                            clientId: 2,
                            matchId: matchId
                        }));
                    }
                    else match.state = 'READY_PLAYER_1';
                }
                if (clientId === 2) {
                    if (match.state === 'READY_PLAYER_1') {
                        match.state = 'RUNNING';
                        //manda start
                        match.socket1.send(JSON.stringify({
                            command: 'START',
                            clientId: 1,
                            matchId: matchId
                        }));
                        match.socket2.send(JSON.stringify({
                            command: 'START',
                            clientId: 2,
                            matchId: matchId
                        }));
                    }
                    else match.state = 'READY_PLAYER_2';
                }
                console.log('SERVER RECEIVED READY, MATCHID: ' + matchId + ' CURRENT STATE: '
                + match.state);
                break;
            case 'GIVE_UP':
                matchId = parsedMsg.matchId;
                clientId = parsedMsg.clientId;
                match = matches[matchId];
                match.state = 'CLOSED';
                match.socket1.send(JSON.stringify({
                    command: 'RESULT',
                    clientId: 1,
                    matchId: matchId,
                    timer: match.timer,
                    winner: match.winner
                    }));
                match.socket2.send(JSON.stringify({
                    command: 'RESULT',
                    clientId: 2,
                    matchId: matchId,
                    timer: match.timer,
                    winner: match.winner
                    }));
                console.log('SERVER RECEIVED GIVE_UP, MATCHID: ' + matchId + ' PLAYER: '
                + clientId + ' CURRENT STATE: ' + match.state);
                console.log('SERVER SENDING RESULT, MATCHID: ' + matchId
                    + ' WINNER: ' + match.winner + ' TIME: ' + match.timer
                    + ' CURRENT STATE: ' + match.state);
                break;
            default:
                console.log('SERVER RECEIVED INVALID MESSAGE');
                break;
        }
    })
});


app.use(function(req, res, next) {
    res.status(404).send('PAGE NOT FOUND');
});

app.listen(3000, function() {
    console.log('Server listening on port 3000!');
});

/*
{
    command: 'SEND_SEED',
    clientId: ,
    matchId: ,
    pattern: 
}
{
    command: 'NOTIFY',
    matchid: 'ID',
    clientId: ,
    timer: 
}
{
    command: 'ERROR',
    text:
}
{
    command: 'START',
    clientId: ,
    matchId:
}
*/