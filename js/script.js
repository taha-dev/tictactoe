var gameTable = [0,1,2,3,4,5,6,7,8];
var counter = 0;
var gameState = true;
var isAi = true;
function gameLoad() 
{
    if(localStorage.getItem('Opponent') == 'true')
    {
        console.log(localStorage.getItem('Opponent'));
        isAi = true;
    }
    else
    {
        isAi = false;
    }
}
function changeColor(color_name, id) 
{
    for(var i = 0; i < 9; i++)
    {
        if(i == id)
        {
            document.getElementById(i).style.color = color_name;
        }
    }    
}
function markMove(id) 
{
    if(gameState)
    {
    if (typeof gameTable[id] == 'number')
    {
        changeColor('orange', id);
        setMark(id, "O");
        if (!checkPattern("O") && !checkTie())
        {
            var ind  = computerMove();
            changeColor('purple', ind);
            setMark(ind, "X");
        }
        console.log(counter);
        counter = 0;
    }
    else
    {
        alert("Already marked!");
    }
}
}
function setMark(squareId, player) {
    gameTable[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkPattern(player);
    if (gameWon) gameOver(gameWon, player);
}
function checkPattern(player) 
{
    var p1 = 0, p2 = 1, p3 = 2;
    for(var i = 0; i < 3; i++)
    {
        if(gameTable[p1] == player && gameTable[p2] == player && gameTable[p3] == player)
        {
            return [p1, p2, p3];
        }
        p1 += 3;
        p2 += 3;
        p3 += 3;
    }
    p1 = 0, p2 = 3, p3 = 6;
    for(var i = 0; i < 3; i++)
    {
        if (gameTable[p1] == player && gameTable[p2] == player && gameTable[p3] == player) {
            return [p1, p2, p3];
        }
        p1 ++;
        p2 ++;
        p3 ++;
    }
    if ((gameTable[0] == player && gameTable[4] == player && gameTable[8] == player))
    {
        return [0, 4, 8];
    }
    if ((gameTable[2] == player && gameTable[4] == player && gameTable[6] == player)) {
        return [2, 4, 6];
    }
    return false;
}

function gameOver(gameWon, player) {
    var color = "";
    if(player == "O")
    {
        color = 'green';
        gameState = false;
        declareWinner("You Win!");
    }
    else if(player == "X")
    {
        color = 'red';
        gameState = false;
        declareWinner("You lose!");
    }
    for (var i = 0; i < 3; i++) 
    {
        document.getElementById(gameWon[i].toString()).style.backgroundColor = color;
    }
}

function declareWinner(result) {
    setTimeout(() => { alert(result) }, 500)
}

function remainingMoves() {
    var temp = [];
    for(var i = 0; i < 9; i++)
    {
        if(typeof gameTable[i] == 'number')
        {
            temp.push(i);
        }
    }
    return temp;
}
function randomMove() 
{
    var temp = remainingMoves();
    return temp[0];
}
function computerMove() {
    if(isAi)
    {
        console.log('isAi');
        return minimax(gameTable, "X").index;
    }
    else
    {
        console.log(typeof isAi);
        return randomMove();
    }
}

function checkTie() {
    if (remainingMoves().length == 0) {
        gameState = false;
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

function minimax(gtable, player) {
    var remMoves = remainingMoves();
    counter++;
    if (checkPattern("O")) {
        return { hvalue: -1 };
    } else if (checkPattern("X")) {
        return { hvalue: 1 };
    } else if (remMoves.length === 0) {
        return { hvalue: 0 };
    }
    var patterns = [];
    for (var i = 0; i < remMoves.length; i++) {
        var move = {};
        move.index = gtable[remMoves[i]];
        gtable[remMoves[i]] = player;

        if (player == "X") {
            var result = minimax(gtable, "O");
            move.hvalue = result.hvalue;
        } else {
            var result = minimax(gtable, "X");
            move.hvalue = result.hvalue;
        }

        gtable[remMoves[i]] = move.index;

        patterns.push(move);
    }

    var bestMove;
    if (player === "X") {
        var expHvalue = -Infinity;
        for (var i = 0; i < patterns.length; i++) {
            if (patterns[i].hvalue > expHvalue) {
                expHvalue = patterns[i].hvalue;
                bestMove = i;
            }
        }
    } else {
        var expHvalue = Infinity;
        for (var i = 0; i < patterns.length; i++) {
            if (patterns[i].hvalue < expHvalue) {
                expHvalue = patterns[i].hvalue;
                bestMove = i;
            }
        }
    }

    return patterns[bestMove];
}