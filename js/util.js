
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
