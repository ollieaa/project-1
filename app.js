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
let fire = true

//Generate an array of arrays of dom objects, making up the cells of the grid. 
//Having a seperate array for each row in the grid will make life easier down the line.
for (let y = 0; y < width; y++) {
  cells.push([])
  for (let x = 0; x < width; x++) {
    const cell = document.createElement('div')
    cell.classList.add('cell') 
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
  if (key === ' ' && fire === true) {     
    shoot(playerPos)
    fire = false
    setTimeout(() => {
      fire = true
    }, 500)
  } else {
    return
  }
})
//Start Game
start.addEventListener('click', () => {
  startGame()
  start.blur()
})

//FUNCTIONS

function startGame() {
  score = 0
  lives = 3
  wave = 1
  play = true
  fire = true
  scoreDisplay.innerText = `Score: ${score}`
  livesDisplay.innerText = `Lives: ${lives}`
  startingEnemies(wave)
  const enemyMoveInt = setInterval(() => {
    moveEnemies()
  }, 500) 
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
  if (lives === 0) {
    gameOver()
  }
}

function checkEnemies () {
  if (enemiesRemaining === 0 && lives > 0) {
    waveCleared()
  }
}

function waveCleared () {
  const clearedDisplay = document.createElement('div')
  clearedDisplay.classList.add('cleared')
  clearedDisplay.innerText = `Wave ${wave} Cleared!`
  grid.appendChild(clearedDisplay)
  setTimeout (() => {
    clearedDisplay.innerText = `Get ready for wave ${wave+1}...`
  }, 3000)
  setTimeout (() => {
    grid.removeChild(clearedDisplay)
  }, 6000)
}

//Add cell class
function addClass(cellNum, add) {
  cellNum.classList.add(`${add}`)
}
//Remove cell class
function removeClass(cellNum, remove) {
  cellNum.classList.remove(`${remove}`)
}

//Game Over
function gameOver() {
  for (let y = 0; y <= 9; y++) {
    for (let x = 0; x <= 9; x++) {
      let cell = cells[y][x]
      if (cell.classList.contains('enemy')){
        removeClass(cell, 'enemy')
      }
      if (cell.classList.contains('player')){
        removeClass(cell, 'player')
      }
      if (cell.classList.contains('bullet')){
        removeClass(cell, 'bullet')
      }
      if (cell.classList.contains('bottle')){
        removeClass(cell, 'bottle')
      }
    }
  }
}

//Populate the grid with the starting enemies
function startingEnemies(waveNum) {

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
            checkEnemies()
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
  //If cell above player contains enemy, dont spawn bullet
  if (cells[bulletY][playerPos].classList.contains('enemy')) {
    removeClass(cells[bulletY][playerPos], 'enemy')
    updateEnemyPos()
    score++
    enemiesRemaining--
    updateScore()
    checkEnemies()
    //Else spawn bullet
  } else {
    //Create new bullet class and image
    addClass(cells[bulletY][position], 'bullet')
    const bullet = document.createElement('img')
    bullet.src='../images/bullet.png'
    addClass(bullet, 'bulletPic')
    cells[bulletY][position].appendChild(bullet)
    //Animation for bullet travel
    const bulletTime = setInterval(() => {
      //Remove existing bullet
      removeClass(cells[bulletY][position], 'bullet')
      bullet.remove()
      //If bullet is in the top row, end bullet travel
      if (cells[bulletY][position] === cells[0][position]) {       
        clearInterval(bulletTime)
      //Else continue bullet travel
      } else {
        //If bullet hits enemy
        if (cells[bulletY - 1][position].classList.contains('enemy')) {
          removeClass(cells[bulletY - 1][position], 'enemy')
          updateEnemyPos()
          score++
          enemiesRemaining--
          updateScore()
          clearInterval(bulletTime)
          checkEnemies()
          //If bullet hits bottle
        // } else if (cells[bulletY - 1][position].classList.contains('bottle')) {
        //   removeClass(cells[bulletY - 1][position], 'bottle')
        //   cells[bulletY - 1][position].removeChild(cells[bulletY - 1][position].firstChild)
        //   clearInterval(bottleTime)
          //Else continue bullet travel
        } else {
          addClass(cells[bulletY-1][position], 'bullet')
          cells[bulletY-1][position].appendChild(bullet)
          bulletY--
        }
      }
      
    }, 30)
  }
}

//Array of possible enemy attack frequencies
let enemyShootTime = [500, 1000, 1000, 1500, 1500, 2000, 2000, 2000, 3000]
//Random enemy attack loop
function enemyAttackLoop() {
  const randomTime = enemyShootTime[Math.floor(Math.random() * enemyShootTime.length)]
  setTimeout(() => {
    //Only trigger enemy attack if there are enemies remaining
    if (enemiesRemaining > 0) {
      enemyAttack()
    }   
    //Only repeat loop if there are enemies remaining and the wave is not
    //yet cleared
    if (enemiesRemaining > 0 && play === true) {
      enemyAttackLoop()
    }
  }, randomTime)
}

//Update enemy positions
function updateEnemyPos () {
  enemyPositions = []
  //Update the current positions of enemies
  for (let y = 8; y >= 0; y--){
    for (let x = 0; x <= 9; x++) {
      if (cells[y][x].classList.contains('enemy')) {
        enemyPositions.push({column:y, row:x})
      }
    }
  }
}

//Enemy attack
function enemyAttack() {  
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
    }, 520)
  }
}

//Spawn enemies
function spawnEnemies(waveNum) {
  addClass(cells[0][0], 'enemy')
}

//TESTING FUNCTIONS

