'use strict'

const BOMB = 'BOMB';
const FLAG = 'FLAG';

const BOMB_IMG = '<img class="bomb" src="img/bomb.png" />';
const FLAG_IMG = '<img src="img/flag.png" />';


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
    gGame.isOn = true
    clearInterval(gTimerId)
    gTimerId = null
    gBoard = buildBoard()
    renderBoard(gBoard)

    var elDiv = document.querySelector('.timer')
    elDiv.innerText = '0'
    var elModal = document.querySelector('.modal')
    elModal.classList.add('modal-hide')
}

function buildBoard() {
    gBoardSize = gLevel.SIZE
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
    for (var i = 0; i < gLevel.MINES; i++) {
        placeRandomMine(board)
    }
    updateCellMinesCount(board)
    return board;
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var cellId = getClassId({ i: i, j: j })
            strHTML += `<td id="${cellId}" onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j});return false;"></td>`;
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;

}

function startGame(size) {
    gBoardSize = size
    switch (gBoardSize) {
        case 4:
            gLevel.SIZE = size
            gLevel.MINES = 2
            break;
        case 8:
            gLevel.SIZE = size
            gLevel.MINES = 12
            break;
        case 12:
            gLevel.SIZE = size
            gLevel.MINES = 30
            break;
    }
    init()
}

// TODO: make cell with 0 mines negs change color but dont show 0


function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isMarked) return
    if (!gTimerId) startTimer()
    var pos = { i: i, j: j }



    if (!gBoard[i][j].isShown) {
        gBoard[i][j].isShown = true
        if (!gBoard[i][j].isMine) {
            gGame.shownCount++
            expandShown(gBoard, elCell, i, j)
            elCell.style.backgroundColor = 'rgb(185, 181, 181)'
            renderCell(pos, gBoard[i][j].minesAroundCount)
            checkGameOver()
        } else {
            renderCell(pos, BOMB_IMG)
            elCell.style.backgroundColor = 'red'
            gGame.isOn = false
            Gamelose(pos)
        }
    }
}

function cellMarked(elCell, i, j) {
    var pos = { i: i, j: j }
    if (gBoard[i][j].isShown) return

    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        renderCell(pos, FLAG_IMG)
        gGame.markedCount++
        checkGameOver()
    } else {
        gBoard[i][j].isMarked = false
        renderCell(pos, '')
        gGame.markedCount--
    }
}

function renderCell(location, value) {
    var cellId = getClassId(location)
    var elCell = document.getElementById(cellId)
    elCell.innerHTML = value;
}

function updateCellMinesCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            cell.minesAroundCount = getMinesNegsCount(board, i, j)
        }
    }
}

function Gamelose(clickedBomb) {
    if (!gGame.isOn) {
        var elModal = document.querySelector('.modal')
        elModal.classList.remove('modal-hide')
        elModal.innerText = 'you lose'
        clearInterval(gTimerId)

        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                var currCell = gBoard[i][j]
                var pos = { i: i, j: j }
                if (currCell.isMine) {
                    if (pos.i === clickedBomb.i && pos.j === clickedBomb.j) continue
                    currCell.isShown = true
                    renderCell(pos, BOMB_IMG)
                    var elCell = document.getElementById(getClassId(pos))
                    elCell.style.backgroundColor = 'rgb(185, 181, 181)'
                }
            }
        }
    }
}

function checkGameOver() {

    if (gGame.shownCount === ((gBoard.length ** 2 - gLevel.MINES)) && gGame.markedCount === gLevel.MINES) {
        console.log('win');
        clearInterval(gTimerId)
        var elModal = document.querySelector('.modal')
        elModal.classList.remove('modal-hide')
        elModal.innerText = 'Victory!'
    }
}

function expandShown(board, elCell, rowIdx, colIdx) {
    if (!gBoard[rowIdx][colIdx].minesAroundCount) {
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i > board.length - 1) continue;
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (j < 0 || j > board[0].length - 1) continue;
                if (i === rowIdx && j === colIdx) continue;
                var pos = { i: i, j: j }
                if (!gBoard[i][j].isShown) {
                    gGame.shownCount++
                    gBoard[i][j].isShown = true
                    var elCell = document.getElementById(getClassId(pos))
                    elCell.style.backgroundColor = 'rgb(185, 181, 181)'
                    renderCell(pos, gBoard[i][j].minesAroundCount)
                }
            }
        }
    }
}
// gGame.shownCount++

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


