'use strict'

const BOMB = 'BOMB';
const FLAG = 'FLAG';

const BOMB_IMG = '<img src="img/bomb.png" />';
const FLAG_IMG = '<img src="img/flag.png" />';

var gMinesCount
var gBoard
var gBombsNegsCount

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2
};

console.log(gLevel.SIZE);

function init() {
    gBoard = buildBoard()
    renderBoard(gBoard)

    console.log(gBoard);
}

function buildBoard() {

    var board = createMat(gLevel.SIZE)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = {
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    placeRandomMine(board)
    placeRandomMine(board)

    return board;
}


function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var cellid = getClassId({ i: i, j: j })
            strHTML += `<td id="cell ${cellid}" onclick="cellClicked(this)" >`;

            //Swich case ?
            if (currCell.isMine) {
                strHTML += BOMB_IMG
            }

            if (!currCell.isMine) {
                gBombsNegsCount = getMinesNegsCount(gBoard, i, j)
                if (gBombsNegsCount)
                    strHTML += gBombsNegsCount
            }

            strHTML += '</td>';
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
    updatecellMinesCount(gBoard)

}


function updatecellMinesCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            cell.minesAroundCount = getMinesNegsCount(gBoard, i, j)
        }
    }
}


function cellClicked(elCell, i, j) {
    if (elCell.innerText) { // solve 0!!!
        elCell.style.color = 'white'
        elCell.style.backgroundColor = 'rgb(185, 181, 181)'
    }


    // console.log(gBoard)
}


function cellMarked(elCell) {
    //Called on right click to mark a cell (suspected to be a mine) hide the context menu on right click
}

function checkGameOver() {
    //Game ends when all mines are marked, and all the other cells are shown
}

function expandShown(board, elCell, i, j) {
    // When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.
}

function placeRandomMine(board) {
    var pos = getRandomLocMine(board)
    if (!pos) return
    board[pos.i][pos.j].isMine = true;
    return pos
}

function renderCell(location, value) {

}


function getMinesNegsCount(mat, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var currCell = mat[i][j];
            if (currCell.isMine) count++;
        }
    }
    return count;
}


function getClassId(location) {
    var cellId = 'cell-' + location.i + '-' + location.j;
    return cellId;
}


function getRandomLocMine(board) {
    
    var randomsLoc = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            if (!cell.isMine)
                // var MineCell = {
                //     minesAroundCount: null,
                //     isShown: false,
                //     isMine: true,
                //     isMarked: false
                // }
            randomsLoc.push({ i: i, j: j })
        }
    }
    if (randomsLoc.length) return randomsLoc[getRandomIntInclusive(0, randomsLoc.length - 1)];
    return null
}


function handleKey(event) {

}

