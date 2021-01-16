//TEST BUTTONS
const move = document.querySelector('#move')

//GLOBAL VARIABLES
const cells = []
const width = 10
let lives = 3 
let score = 0
const grid = document.querySelector('#grid')
let playerPos = 5

//Generate an array of arrays of dom objects, making up the cells of the grid. 
//Having a seperate array for each row in the grid will make life easier down the line.
for (let column = 0; column < width; column++) {
  cells.push([])
  for (let row = 0; row < width; row++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    cell.classList.add('empty')

    grid.appendChild(cell)
    cell.innerText = `${column}${row}`
    cells[column].push(cell) 
    cell.style.width = `${(100 / width)-0.35}%`
    cell.style.height = `${(100 / width)-0.35}%`
    
  }
}
// Set the cells in the odd numbered rows to have a class of left, and the even numbered 
//rows to have class of right, so that enemy cells know which direction to move
for (let y = 9; y >= 0; y--) {
  for (let x = 9; x >= 0; x--) {
    if ((y % 2) === 1) {       
      cells[y][x].classList.add('left')
    } else {
      cells[y][x].classList.add('right')
    }
  }
}

//EVENT LISTENERS
//player movement
document.addEventListener('keydown', (event) => {
  const key = event.key
  if (key === 'ArrowLeft' && !(playerPos === 0)) {
    changeCell(cells[9][playerPos], 'player', 'empty')
    changeCell(cells[9][playerPos-1], 'empty', 'player')
    playerPos--
  } else if (key === 'ArrowRight' && !(playerPos === 9)) {
    changeCell(cells[9][playerPos], 'player', 'empty')
    changeCell(cells[9][playerPos+1], 'empty', 'player')
    playerPos++
  }
})
//player shoot
document.addEventListener('keydown', (event) => {
  const key = event.key
  if (key === ' ') {
    if (cells[8][playerPos].classList.contains('enemy')) {
      changeCell(cells[8][playerPos], 'enemy', 'empty')
      score++
    } else {
      changeCell(cells[8][playerPos], 'empty', 'bullet')
      for (let y = 8; y >=0; y--) {
        for (let x = 0; x <=9)
      }
    }
  }
})

//FUNCTIONS
//Change cell class
function changeCell(cellNum, remove, add) {
  cellNum.classList.remove(`${remove}`)
  cellNum.classList.add(`${add}`)
}



//Populate the grid with the starting enemies
function startingEnemies() {

  changeCell(cells[9][5], 'empty', 'player')

  for (let y = 3; y >= 0; y-- ) {
    for (let x = 7; x > 1; x--){
      changeCell(cells[y][x], 'empty', 'enemy')    
    }
  }
} 

//Move enemies. To be used within an interval
function moveEnemies()  {
  for (let y = 8; y >= 0; y--) {
    //FOR LEFT CELLS
    if (y % 2 === 1) {
      for (let x = 0; x <= 9; x++) {
        let thisCell = cells[y][x]
        if (cells[y][x].classList.contains('enemy')) {
          changeCell(thisCell, 'enemy', 'empty')
          if (x === 0) {
            changeCell(cells[y+1][x], 'empty', 'enemy')
          } else {
            changeCell(cells[y][x-1], 'empty', 'enemy')
          }
        }
      }
    //FOR RIGHT CELLS  
    } else {
      for (let x = 9; x >= 0; x--) {
        let thisCell = cells[y][x]
        if (thisCell.classList.contains('enemy')) {
          changeCell(thisCell, 'enemy', 'empty')
          if (x === 9 && y === 8) {
            lives-=1
          } else if (x === 9) {
            changeCell(cells[y+1][x], 'empty', 'enemy')
          } else {
            changeCell(cells[y][x+1], 'empty', 'enemy')
          }
        }
      }
    }   
  }
} 

//Player Shooting


//TESTING FUNCTIONS
startingEnemies()

move.addEventListener('click', () => {
  moveEnemies()
})