var time;
var blankIndicies = []
var sudoku;
const res = document.getElementById('res')


window.onload = function () {
    // add event listener to default button
    document.getElementById('solveBtn').addEventListener('click', solve)

    // add event listenr to upload button
    document.getElementById('uploadBtn').addEventListener('click', () => {
        const input = document.getElementById('sudokuInput').value
        processData(input)
        res.innerHTML = ""
        res.className = ""
        renderDOM(sudoku)
    })

    // add event listener to speed slider
    document.getElementById('speed').addEventListener('change', setSpeed)

    setSpeed()
    renderDOM(sudoku)
}

function setSpeed() {
    const value = document.getElementById('speed').value
    time = 1000 - Number(value)
}

function findValid(row, col) {
    const valid = []

    const tmp = new Set()
    const all = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    // check for row
    for (let i = 0; i < 9; i++) {
        if (col == i) { continue }
        if (sudoku[row][i]) {
            tmp.add(sudoku[row][i])
        }
    }

    // check for col
    for (let i = 0; i < 9; i++) {
        if (row == i) { continue }
        if (sudoku[i][col]) {
            tmp.add(sudoku[i][col])
        }
    }

    // check for box
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3

    for (let i = boxRow; i < boxRow + 3; i++) {
        for (let j = boxCol; j < boxCol + 3; j++) {
            if (sudoku[i][j]) {
                tmp.add(sudoku[i][j])
            }
        }
    }

    // get valid moves
    for (let i = 0; i < all.length; i++) {
        if (!tmp.has(all[i])) {
            valid.push(all[i])
        }
    }
    return valid

}

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

async function _solve(indx = 0) {
    if (indx == blankIndicies.length) {
        return true
    }

    const row = blankIndicies[indx][0]
    const col = blankIndicies[indx][1]

    const valid = findValid(row, col)

    for (let i = 0; i < valid.length; i++) {

        sudoku[row][col] = valid[i]

        renderDOM(row, col)

        await sleep(time)

        const tmp = await _solve(indx + 1)

        if (tmp) {
            return tmp
        }

        renderDOM(row, col, false)
        sudoku[row][col] = 0

        await sleep(time)
    }

}

async function solve() {
    // fill blank indicies
    blankIndicies = []
    sudoku.forEach((row, j) => row.forEach((item, i) => {
        if (item == 0) {
            blankIndicies.push([j, i])
        }
    }))

    const flag = await _solve()
    if (flag) {
        res.className = 'message success'
        res.innerText = 'Solved'
        renderDOM(sudoku)
    } else {
        res.className = 'message failed'
        res.innerText = 'Sorry'
        renderDOM(sudoku)
    }
}

function renderDOM(activeRow = -1, activeCol = -1, flag = true) {
    const target = document.getElementById('root')
    target.innerHTML = ""

    const frag = document.createDocumentFragment()

    sudoku.forEach((row, i) => row.forEach((item, j) => {
        const div = document.createElement('div')
        if (item) {
            div.innerText = item
        }
        if (i == activeRow && j == activeCol) {
            if (flag) {
                div.id = 'added'
            } else {
                div.id = 'removed'
            }
        }
        frag.appendChild(div)
    }))

    target.appendChild(frag)
}

function processData(input) {
    input = input.trim().split('\n')
    sudoku = input.map(row => row.trim().split(' ').map(Number))
}

// default input
processData("0 4 0 0 0 0 1 7 9\n0 0 2 0 0 8 0 5 4\n0 0 6 0 0 5 0 0 8\n0 8 0 0 7 0 9 1 0\n0 5 0 0 9 0 0 3 0\n0 1 9 0 6 0 0 4 0\n3 0 0 4 0 0 7 0 0\n5 7 0 1 0 0 2 0 0\n9 2 8 0 0 0 0 6 0")
