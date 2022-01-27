'use strict'

const BOMB = 'BOMB';
const FLAG = 'FLAG';

const BOMB_IMG = '<img class="bomb" src="img/bomb.png" />';
const FLAG_IMG = '<img src="img/flag.png" />';


var gMinesCount
var gBoard
var gBombsNegsCount // have to be global?
var gTimerId = null
var gBoardSize = 16

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

function init() {
    clearInterval(gTimerId)
    gTimerId = null
    var elDiv = document.querySelector('.timer')
    elDiv.innerText = '0'
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard(board) {
    gBoardSize = Math.sqrt(gBoardSize)

    var board = createMat(gBoardSize)

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

    switch (gBoardSize) {
        case 4:
            for (var i = 1; i < 3; i++) {
                placeRandomMine(board)
            }
            break;
        case 8:
            for (var i = 1; i < 13; i++) {
                placeRandomMine(board)
            }
            break;
        case 16:
            for (var i = 1; i < 31; i++) {
                placeRandomMine(board)
            }
            break;
    }
    return board;
}


function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var cellId = getClassId({ i: i, j: j })
            strHTML += `<td id="${cellId}" onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j});return false;">`;

            if (currCell.isMine) {
                strHTML += BOMB_IMG

            }
            if (!currCell.isMine) {
                gBombsNegsCount = getMinesNegsCount(gBoard, i, j)
                // if (gBombsNegsCount) // remove if- dont show 0 when clicked
                strHTML += gBombsNegsCount
            }
            strHTML += '</td>';
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;

    updateCellMinesCount(gBoard)// need to be here?
}

function startGame(size) {
    gBoardSize = size
    init()
}
// update the modal when cell is shown - V
// TODO: make cell with 0 mines negs change color but dont show 0


function cellClicked(elCell, i, j) {
    if (!gTimerId) startTimer()
    // gBoard[i][j].minesAroundCount 
    if (!gBoard[i][j].isMarked) {
        elCell.style.color = 'white'
        elCell.style.backgroundColor = 'rgb(185, 181, 181)'
        if (gBoard[i][j].isMine) {
            elCell.getElementsByTagName("img")[0].style.display = 'block'
        }
        gBoard[i][j].isShown = true
    }
    checkGameOver()
}

function mineClicked() {
    //TODO if mine is clicked game over and show all mines

}

function cellMarked(elCell, i, j) {
    var pos = { i: i, j: j }

    if (gBoard[i][j].isShown) return
    if (!gBoard[i][j].isShown) {
        gBoard[i][j].isMarked = true
        renderCell(pos, FLAG_IMG)
    }
}

function renderCell(location, value) {
    var cellId = getClassId(location)
    var elCell = document.getElementById(cellId)

    elCell.innerHTML = value;
}

function updateCellMinesCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            cell.minesAroundCount = getMinesNegsCount(gBoard, i, j)
        }
    }
}

function checkGameOver() {

    //Game ends when all mines are marked, and all the other cells are shown
    //TODO add clearinterval for timer
}

function expandShown(board, elCell, i, j) {
    // When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.
}

function placeRandomMine(board) {
    var pos = getRandomLocMine(board)
    if (!pos) return
    board[pos.i][pos.j].isMine = true;

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

                randomsLoc.push({ i: i, j: j })
        }
    }
    if (randomsLoc.length) return randomsLoc[getRandomIntInclusive(0, randomsLoc.length - 1)];
    return null
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


