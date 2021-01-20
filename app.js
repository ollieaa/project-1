//TEST BUTTONS
const start = document.querySelector('#start')
const livesDisplay = document.querySelector('#lives')
const scoreDisplay = document.querySelector('#score')

//GLOBAL VARIABLES
const cells = []
const width = 9
let lives = 3 
let score = 0
let wave = 1
const grid = document.querySelector('#grid')
let playerPos = 4
let enemyAttackSpeed = [500, 500, 1000, 1000, 1000, 1500, 1500, 1500, 1500, 1500, 2000, 2000, 2000, 3000]
let enemyPositions = []

//GLOBAL GAME STATES
let fire = true
let enemiesRemaining = null
let spawnsRemaining = null
let POL = false
let squad = false
let play = false

//Intervals
let moveTime = null
let enemySpawnTime = null

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
  if (squad === false){
    if (key === 'ArrowLeft' && !(playerPos === 0)) {
      removeClass(cells[8][playerPos], 'player')
      addClass(cells[8][playerPos-1], 'player')
      playerPos--
    } else if (key === 'ArrowRight' && !(playerPos === 8)) {
      removeClass(cells[8][playerPos], 'player')
      addClass(cells[8][playerPos+1], 'player')
      playerPos++
    }
  } else if (squad === true){
    if (key === 'ArrowLeft' && !(playerPos-1 === 0)) {
      removeClass(cells[8][playerPos], 'player')
      removeClass(cells[8][playerPos-1], 'squadLeft')
      removeClass(cells[8][playerPos+1], 'squadRight')
      addClass(cells[8][playerPos-1], 'player')
      addClass(cells[8][playerPos-2], 'squadLeft')
      addClass(cells[8][playerPos], 'squadRight')
      playerPos--
    } else if (key === 'ArrowRight' && !(playerPos+1 === 8)) {
      removeClass(cells[8][playerPos], 'player')
      removeClass(cells[8][playerPos-1], 'squadLeft')
      removeClass(cells[8][playerPos+1], 'squadRight')
      addClass(cells[8][playerPos+1], 'player')
      addClass(cells[8][playerPos], 'squadLeft')
      addClass(cells[8][playerPos+2], 'squadRight')
      playerPos++
    }
  }
})
//player shooting
document.addEventListener('keydown', (event) => {
  const key = event.key
  if (key === ' ' && fire === true) {     
    if (squad === false) {
      shoot(playerPos)
    } else if (squad === true) {
      shoot(playerPos)
      shoot(playerPos-1)
      shoot(playerPos+1)
    }
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

function moveFunction() {
  moveTime = setInterval(() => {
    moveAssets()
  }, moveSpeed())
}
function startGame() {
  play = true
  score = 0
  lives = 3
  fire = true
  scoreDisplay.innerText = `Score: ${score}`
  livesDisplay.innerText = `Lives: ${lives}`
  startingEnemies(wave)
  updateEnemyPos()
  addClass(cells[8][4], 'player')
  moveFunction()
  enemyAttackLoop()
  addClass(cells[5][8], 'POL')
}
function waveCleared () {
  play = false
  clearInterval(moveTime)
  clearGrid()
  const clearedDisplay = document.createElement('div')
  clearedDisplay.classList.add('cleared')
  clearedDisplay.innerText = `Wave ${wave} Cleared!`
  grid.appendChild(clearedDisplay)
  enemyAttackSpeed.pop()
  setTimeout (() => {
    clearedDisplay.innerText = `Get ready for Wave ${wave+1}...`
  }, 3000)
  setTimeout (() => {
    grid.removeChild(clearedDisplay)
  }, 6000)
  setTimeout (() => {
    wave+=1
    startingEnemies(wave)
    updateEnemyPos()
    moveFunction()
    enemyAttackLoop()
    spawnEnemies()
    play = true   
  }, 6050) 
}
function clearGrid() {
  for (let y = 0; y <= 8; y++) {
    for (let x = 0; x <= 8; x++) {
      let cell = cells[y][x]
      if (cell.classList.contains('enemy')){
        removeClass(cell, 'enemy')
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
function updateScore() {
  scoreDisplay.innerText = `Score: ${score}`
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
function updateEnemyPos () {
  //Clear existing enemy positions
  enemyPositions = []
  //Update the current positions of enemies
  for (let y = 7; y >= 0; y--){
    for (let x = 0; x <= 8; x++) {
      if (cells[y][x].classList.contains('enemy')) {
        enemyPositions.push({column:y, row:x})
      }
    }
  }
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
function startingEnemies(waveNum) {
  if (waveNum === 1){
    //28 initial
    enemiesRemaining = 28
    spawnsRemaining = 0
    for (let y = 3; y >= 0; y-- ) {
      for (let x = 7; x > 0; x--){
        addClass(cells[y][x], 'enemy')    
      }
    }
  } else if (waveNum === 2) {
    //24 initial
    enemiesRemaining = 43
    spawnsRemaining = 19
    for (let y = 3; y >= 1; y-- ) {
      for (let x = 8; x >= 0; x--){
        if (x > 4 || x < 4) {
          addClass(cells[y][x], 'enemy') 
        }     
      }
    }
  } else if (waveNum === 3) {
    //27 initial
    enemiesRemaining = 48
    spawnsRemaining = 21
    for (let y = 5; y >= 0; y-- ) {
      for (let x = 8; x >= 0; x--){
        if (y % 2 === 1) {
          addClass(cells[y][x], 'enemy') 
        }     
      }
    }
  } else if (waveNum === 4) {

  } else if (waveNum === 5) {

  } else if (waveNum === 6) {

  } else if (waveNum === 7) {

  } else if (waveNum === 8) {

  } else if (waveNum === 9) {

  } else if (waveNum === 10) {

  }
} 
//Player Shooting
function shoot(position) {
  let bulletY = 7
  //If cell above player contains enemy, dont spawn bullet
  if (cells[bulletY][position].classList.contains('enemy')) {
    removeClass(cells[bulletY][position], 'enemy')
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
    if (POL === false) {
      bullet.src='./images/bullet.png'
    } else {
      bullet.src='./images/bottle.png'
    }
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
          //If bullet hits life power
        } else if (cells[bulletY - 1][position].classList.contains('life')) {
          removeClass(cells[bulletY - 1][position], 'life')
          lives++ 
          updateLives()   
          clearInterval(bulletTime)
          //If bullet hits squad power
        } else if (cells[bulletY - 1][position].classList.contains('squad')) {
          removeClass(cells[bulletY - 1][position], 'squad')
          squad = true
          for (let x = 0; x <= 8; x++) {
            if (cells[8][x].classList.contains('player')) {
              removeClass(cells[8][x], 'player')
            }
          }
          addClass(cells[8][4], 'player')
          addClass(cells[8][3], 'squadLeft')
          addClass(cells[8][5], 'squadRight')
          playerPos = 4
          setTimeout(() => {
            squad = false
            removeClass(cells[8][playerPos-1], 'squadLeft')
            removeClass(cells[8][playerPos+1], 'squadRight') 
          }, 6000)
          clearInterval(bulletTime)
        } else if (cells[bulletY - 1][position].classList.contains('POL')) {
          removeClass(cells[bulletY - 1][position], 'POL')
          POL = true
          setTimeout(() => {
            POL = false
          }, 10000)
        } else {
          addClass(cells[bulletY-1][position], 'bullet')
          cells[bulletY-1][position].appendChild(bullet)
          bulletY--
        }
      }
    }, playerAttackSpeed())
  }
}

//Random enemy attack loop
function enemyAttackLoop() {
  const randomTime = enemyAttackSpeed[Math.floor(Math.random() * enemyAttackSpeed.length)]
  setTimeout(() => {
    //Only trigger enemy attack if there are enemies remaining
    if (enemiesRemaining > 0) {
      enemyAttack()
      enemyAttackLoop()
    } else {
      return
    }
  }, randomTime)
}

//Enemy attack
function enemyAttack() {  
  const randomEnemy = enemyPositions[Math.floor(Math.random() * enemyPositions.length)]
  const attacker = randomEnemy
  let bottleY = attacker.column+1
  const bottleX = attacker.row
  //If bottle would spawn on player, dont spawn bottle.
  if (cells[bottleY][bottleX].classList.contains('player') && POL === false) {
    lives--
    updateLives()
  //Else spawn bottle
  } else {
    //Create new bottle class and image
    addClass(cells[bottleY][bottleX], 'bottle')
    const bottle = document.createElement('img')
    bottle.src='./images/bottle.png'
    addClass(bottle, 'bottlePic')
    cells[bottleY][bottleX].appendChild(bottle)
    //Animation for bottle travel
     const enemyAttackMotion = setInterval(() => {
      //Clear bottle from current position
      removeClass(cells[bottleY][bottleX], 'bottle')
      bottle.remove()
      //If bottle is in bottom row of grid, stop bottle travel
      if (cells[bottleY][bottleX] === cells[8][bottleX]) {       
        clearInterval(enemyAttackMotion)
      //Else continue bottle travel
      } else {
        //If bottle hits player
        if (cells[bottleY+1][bottleX].classList.contains('player') && play === true) {
          if (POL === false) {
            lives--
            updateLives()
            clearInterval(enemyAttackMotion)
          } else {
            clearInterval(enemyAttackMotion)
          }
        } else {
          //Move bottle to next row down
          addClass(cells[bottleY+1][bottleX], 'bottle')
          cells[bottleY+1][bottleX].appendChild(bottle)
          bottleY++         
        }
      }      
    }, 120)
  }
}

//Move all elements. To be used within an interval
function moveAssets()  {
  for (let y = 7; y >= 0; y--) {
    //FOR LEFT CELLS
    if (y % 2 === 1) {
      for (let x = 0; x <= 8; x++) {
        let thisCell = cells[y][x]
        //Move enemies
        if (thisCell.classList.contains('enemy')) {
          removeClass(thisCell, 'enemy')
          if (x === 0 && y === 7) {
            lives-=1
            updateLives()
            enemiesRemaining--
            checkEnemies()
          } else if (x === 0) {
            addClass(cells[y+1][x], 'enemy')
          } else {
            addClass(cells[y][x-1], 'enemy')
          }
          //Move life
        } else if (thisCell.classList.contains('life')) {
          removeClass(thisCell, 'life')
          if (x > 0) {
            addClass(cells[y][x-1], 'life')
          } 
        } else if (thisCell.classList.contains('POL')) {
          removeClass(thisCell, 'POL')
          if (x > 0) {
            addClass(cells[y][x-1], 'POL')
          } 
        } else if (thisCell.classList.contains('squad')) {
          removeClass(thisCell, 'squad')
          if (x > 0) {
            addClass(cells[y][x-1], 'squad')
          } 
        }
      }
    //FOR RIGHT CELLS  
    } else {
      for (let x = 8; x >= 0; x--) {
        let thisCell = cells[y][x]
        if (thisCell.classList.contains('enemy')) {
          removeClass(thisCell, 'enemy')
          if (x === 8) {
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
//TESTING FUNCTIONS
//Spawn enemies

//Game Over
function gameOver() {
  enemiesRemaining = 0
  clearInterval(moveTime)
  clearGrid()
  for (let x = 0; x <= 8; x++) {
    let cell = cells[8][x]
    if (cells[8][x].classList.contains('player')){
      removeClass(cell, 'player')
    }
  }
  const gameOverDisplay = document.createElement('div')
  gameOverDisplay.classList.add('gameOver')
  gameOverDisplay.innerText = 'Game Over. You\'re zombie food now...'
  grid.appendChild(gameOverDisplay) 
}

function moveSpeed() {
  if (wave === 1 || wave === 2) {
    return 1000
  } else if (wave === 3 || wave === 4) {
    return 800
  } else if (wave === 5 || wave === 6) {
    return 600
  } else if (wave === 7 || wave === 8) {
    return 500
  } else if (wave === 9) {
    return 400
  } else if (wave === 10) {

  }
}
function spawnEnemies() {
  enemySpawnTime = setInterval (() => {
    if (spawnsRemaining > 0) {
      addClass(cells[0][0], 'enemy')
      spawnsRemaining--
    } else {
      clearInterval(enemySpawnTime)
    }   
  }, moveSpeed()) 
}
function playerAttackSpeed() {
  if (POL === false) {
    return 30
  } else {
    return 120
  }
}
function spawnLife() {
  if (!cells[0][0].classList.contains('enemy') && !cells[0][0].classList.contains('POL')) {
    addClass(cells[0][0], 'life')
  } else {
    return
  }
}
function spawnPOL() {
  if (!cells[0][0].classList.contains('enemy') && !cells[0][0].classList.contains('life')) {
    addClass(cells[0][0], 'POL')
  } else {
    return
  }
}
function spawnGang() {
  if (!cells[0][0].classList.contains('enemy') && !cells[0][0].classList.contains('life')) {
    addClass(cells[0][0], 'squad')
  } else {
    return
  } 
}