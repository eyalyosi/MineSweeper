
function createMat(length) {
    var mat = []
    
    for (var i = 0; i < length; i++) {
        var row = []
        for (var j = 0; j < length; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function startTimer() {
    var startTime = Date.now()

    gTimerId = setInterval(function () {
        var elDiv = document.querySelector('.timer')
        var currTime = Date.now()
        var printTime = Math.floor(((currTime - startTime) % (1000 * 60)) / 1000)
        elDiv.innerText = printTime
    }, 1000)
}
