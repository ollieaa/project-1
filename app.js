//TEST BUTTONS
const start = document.querySelector('#start')
const livesDisplay = document.querySelector('#lives')
const scoreDisplay = document.querySelector('#score')

//GLOBAL VARIABLES
const cells = []
const width = 10
let lives = 3 
let score = 0
let wave = 1
const grid = document.querySelector('#grid')
let playerPos = 5
let enemiesRemaining = 24
let enemyPositions = []


//GLOBAL GAME STATES

let play = false

//Generate an array of arrays of dom objects, making up the cells of the grid. 
//Having a seperate array for each row in the grid will make life easier down the line.
for (let y = 0; y < width; y++) {
  cells.push([])
  for (let x = 0; x < width; x++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    // cell.classList.add('empty') 
    grid.appendChild(cell)
    // cell.innerText = `${y}${x}`
    cells[y].push(cell) 
    cell.style.width = `${(100 / width)}%`
    cell.style.height = `${(100 / width)}%`
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
//player shooting
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
  play = true
  enemyAttackLoop()
}

function updateScore() {
  scoreDisplay.innerText = `Score: ${score}`
  if (enemiesRemaining === 0) {
    play = false
  }
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
            enemiesRemaining--
          } else if (x === 9) {
            addClass(cells[y+1][x], 'enemy')
          } else {
            addClass(cells[y][x+1], 'enemy')
          }
        }
      }
    }   
  }
  updateEnemyPos()
} 

//Player Shooting
function shoot(position) {
  let bulletY = 8
  if (cells[8][playerPos].classList.contains('enemy')) {
    removeClass(cells[8][playerPos], 'enemy')
    updateEnemyPos()
    score++
    enemiesRemaining--
    updateScore()
  } else {
    addClass(cells[bulletY][position], 'bullet')
    const bullet = document.createElement('img')
    bullet.src='../images/bullet.png'
    addClass(bullet, 'bulletPic')
    cells[bulletY][position].appendChild(bullet)
    const bulletTime = setInterval(() => {
      removeClass(cells[bulletY][position], 'bullet')
      bullet.remove()
      if (cells[bulletY][position] === cells[0][position]) {       
        clearInterval(bulletTime)
      } else {
        if (cells[bulletY - 1][position].classList.contains('enemy')) {
          removeClass(cells[bulletY - 1][position], 'enemy')
          updateEnemyPos()
          score++
          enemiesRemaining--
          updateScore()
          clearInterval(bulletTime)
        } else {
          addClass(cells[bulletY-1][position], 'bullet')
          cells[bulletY-1][position].appendChild(bullet)
          bulletY--
        }
      }
      
    }, 50)
  }
}


let enemyShootTime = [500, 1000, 1000, 1500, 1500, 2000, 2000, 2000, 3000]
//Enemy attack random timeout 
function enemyAttackLoop() {
  const randomTime = enemyShootTime[Math.floor(Math.random() * enemyShootTime.length)]
  setTimeout(() => {
    if (enemiesRemaining > 0) {
      enemyAttack()
    }   
    if (enemiesRemaining > 0 && play === true) {
      enemyAttackLoop()
    }
  }, randomTime)
}

//Update enemy positions
function updateEnemyPos () {
  enemyPositions = []
  for (let y = 8; y >= 1; y--){
    for (let x = 0; x <= 9; x++) {
      if (cells[y][x].classList.contains('enemy')) {
        enemyPositions.push({column:y, row:x})
      }
    }
  }
}

//Enemy attack
function enemyAttack() {  
  console.log(enemyPositions)
  const randomEnemy = enemyPositions[Math.floor(Math.random() * enemyPositions.length)]
  const attacker = randomEnemy
  let bottleY = attacker.column+1
  const bottleX = attacker.row
  //If bottle would spawn on player, dont spawn bottle.
  if (cells[bottleY][bottleX].classList.contains('player')) {
    lives--
    updateLives()
  } else if (cells[bottleY][bottleX].classList.contains('player')) {
    ;
  //Else spawn bottle
  } else {
    //Create new bottle class and image
    addClass(cells[bottleY][bottleX], 'bottle')
    const bottle = document.createElement('img')
    bottle.src='../images/bottle.png'
    addClass(bottle, 'bottlePic')
    cells[bottleY][bottleX].appendChild(bottle)
    //Animation for bottle travel
    const bottleTime = setInterval(() => {
      //Clear bottle from current position
      removeClass(cells[bottleY][bottleX], 'bottle')
      bottle.remove()
      //If bottle is in bottom row of grid, stop bottle travel
      if (cells[bottleY][bottleX] === cells[9][bottleX]) {       
        clearInterval(bottleTime)
      //Else continue bottle travel
      } else {
        //If bottle hits player
        if (cells[bottleY+1][bottleX].classList.contains('player')) {
          lives--
          updateLives()
          clearInterval(bottleTime)
        } else {
          //Move bottle to next row down
          addClass(cells[bottleY+1][bottleX], 'bottle')
          cells[bottleY+1][bottleX].appendChild(bottle)
          bottleY++         
        }
      }      
    }, 150)
  }
}

//Spawn enemies
function spawnEnemies(waveNum) {
  addClass(cells[0][0], 'enemy')
}

//TESTING FUNCTIONS


start.addEventListener('click', () => {
  startGame()
})