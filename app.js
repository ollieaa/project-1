//TEST BUTTONS
const start = document.querySelector('#start')
const livesDisplay = document.querySelector('#lives')
const scoreDisplay = document.querySelector('#score')

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
    removeClass(cells[9][playerPos], 'player')
    addClass(cells[9][playerPos-1], 'player')
    playerPos--
  } else if (key === 'ArrowRight' && !(playerPos === 9)) {
    removeClass(cells[9][playerPos], 'player')
    addClass(cells[9][playerPos+1], 'player')
    playerPos++
  }
})
//player shoot
document.addEventListener('keydown', (event) => {
  const key = event.key
  if (key === ' ') {
    shoot(playerPos)
  }
})


//FUNCTIONS

function startGame() {
  scoreDisplay.innerText = `Score: ${score}`
  livesDisplay.innerText = `Lives: ${lives}`
  startingEnemies()
  const enemyMoveInt = setInterval(() => {
    moveEnemies()
  }, 500)
}

function updateScore() {
  scoreDisplay.innerText = `Score: ${score}`
}

function updateLives() {
  livesDisplay.innerText = `Lives: ${lives}`
}

//Add cell class
function addClass(cellNum, add) {
  cellNum.classList.add(`${add}`)
}
//Remove cell class
function removeClass(cellNum, remove) {
  cellNum.classList.remove(`${remove}`)
}

//Populate the grid with the starting enemies
function startingEnemies() {

  addClass(cells[9][5], 'player')

  for (let y = 3; y >= 0; y-- ) {
    for (let x = 7; x > 1; x--){
      addClass(cells[y][x], 'enemy')    
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
          removeClass(thisCell, 'enemy')
          if (x === 0) {
            addClass(cells[y+1][x], 'enemy')
          } else {
            addClass(cells[y][x-1], 'enemy')
          }
        }
      }
    //FOR RIGHT CELLS  
    } else {
      for (let x = 9; x >= 0; x--) {
        let thisCell = cells[y][x]
        if (thisCell.classList.contains('enemy')) {
          removeClass(thisCell, 'enemy')
          if (x === 9 && y === 8) {
            lives-=1
            updateLives()
          } else if (x === 9) {
            addClass(cells[y+1][x], 'enemy')
          } else {
            addClass(cells[y][x+1], 'enemy')
          }
        }
      }
    }   
  }
} 

//Player Shooting
function shoot(position) {
  let bulletY = 8
  if (cells[8][playerPos].classList.contains('enemy')) {
    removeClass(cells[8][playerPos], 'enemy')
    score++
    updateScore()
  } else {
    addClass(cells[bulletY][position], 'bullet')
    const bulletTime = setInterval(() => {
      removeClass(cells[bulletY][position], 'bullet')
      if (cells[bulletY][position] === cells[0][position]) {       
        clearInterval(bulletTime)
      } else {
        if (cells[bulletY - 1][position].classList.contains('enemy')) {
          removeClass(cells[bulletY - 1][position], 'enemy')
          score++
          updateScore()
          clearInterval(bulletTime)
        } else {
          addClass(cells[bulletY-1][position], 'bullet')
          bulletY--
        }
      }
      
    }, 50)
  }
}

//TESTING FUNCTIONS


start.addEventListener('click', () => {
  startGame()
})