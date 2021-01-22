const colours = [
  'linear-gradient(to bottom, #fceabb 0%,#fccd4d 50%,#f8b500 51%,#fbdf93 100%)',
  'linear-gradient(to bottom, #f3c5bd 0%,#e86c57 50%,#ea2803 51%,#ff6600 75%,#c72200 100%)',
  'linear-gradient(to bottom, #cb60b3 0%,#c146a1 50%,#a80077 51%,#db36a4 100%)',
  'linear-gradient(to bottom, #ffffff 0%,#f1f1f1 50%,#e1e1e1 51%,#f6f6f6 100%)',
  'linear-gradient(to bottom, #b4ddb4 0%,#83c783 17%,#52b152 33%,#008a00 67%,#005700 83%,#002400 100%)',
  'linear-gradient(to bottom, rgba(30,87,153,1) 0%,rgba(41,137,216,1) 50%,rgba(32,124,202,1) 51%,rgba(125,185,232,1) 100%)',
  'linear-gradient(to bottom, rgba(240,183,161,1) 0%,rgba(140,51,16,1) 50%,rgba(117,34,1,1) 51%,rgba(191,110,78,1) 100%)',
  'linear-gradient(to bottom, rgba(252,236,252,1) 0%,rgba(251,166,225,1) 50%,rgba(253,137,215,1) 51%,rgba(255,124,216,1) 100%)'
]
function randomColour() {
  return colours[Math.floor(Math.random() * colours.length)]
}


//QUERY SELECTORS
const start = document.querySelector('#start')
const titleScreen = document.querySelector('#titleScreen')
const gameArea = document.querySelector('#gameArea')
const scoreDisplay = document.querySelector('#points')
const livesDisplay = document.querySelector('#lives')
const waveDisplay = document.querySelector('#wave')
const enemiesDisplay = document.querySelector('#enemies')
const introText = document.querySelector('#cutscene')
const clearedDisplay = document.createElement('div')

//AUDIO
const zomGrowls = ['./audio/zombie1.wav', './audio/zombie2.wav', './audio/zombie3.wav', './audio/zombie4.wav',
'./audio/zombie5.wav', './audio/zombie6.wav', './audio/zombie7.wav', './audio/zombie8.wav']
const splats = ['./audio/splat1.wav', './audio/splat2.wav', './audio/splat3.wav', './audio/splat4.wav', './audio/splat5.wav', './audio/splat6.wav']
const vamp = new Audio('./audio/vamp.mp3')
vamp.loop
vamp.volume = 0.6
const gunshot = new Audio('./audio/gunshot.wav')

//GLOBAL VARIABLES
const cells = []
const tiles = []
const width = 9
const tileWidth = 7 
let lives = 3 
let score = 0
let wave = 1
const grid = document.querySelector('#grid')
const danceFloor = document.querySelector('#danceFloor')
let playerPos = 4
let enemyAttackSpeed = [500, 500, 1000, 1000, 1000, 1500, 1500, 1500, 1500, 1500, 2000, 2000, 2000, 3000]
let enemyPositions = []
let enemiesRemaining = null
let spawnsRemaining = null
let bossLives = 30

//GLOBAL GAME STATES
let fire = false
let POL = false
let squad = false
let play = false

//Intervals
let moveTime = null
let enemySpawnTime = null
let powerSpawnTime = null
let floorTime = null

//Generate an array of arrays of dom objects, making up the cells of the grid. 
//Having a seperate array for each row in the grid will make life easier down the line.
for (let y = 0; y < width; y++) {
  cells.push([])
  for (let x = 0; x < width; x++) {
    const cell = document.createElement('div')
    cell.classList.add('cell') 
    grid.appendChild(cell)
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
//Generate Dancefloor
for (let x = 0; x <= 48; x++) {
  const tile = document.createElement('div')
  tile.classList.add('tile')
  danceFloor.appendChild(tile)
  tile.style.width = `${(100 / tileWidth)}%`
  tile.style.height = `${(100 / tileWidth)}%`
  tile.style.background = `${randomColour()}`
  tiles.push(tile)
}

//EVENT LISTENERS
//Disable page scroll
window.addEventListener("keydown", function(e) {
  if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
  }
}, false);
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
  if (key === ' ' && fire === true && play === true) {     
    if (squad === false) {
      shoot(playerPos)
      // gunshotAudio.play()
    } else if (squad === true) {
      shoot(playerPos)
      shoot(playerPos-1)
      shoot(playerPos+1)
    }
    fire = false
    setTimeout(() => {
      fire = true
    }, 300)
  } else {
    return
  }
})
//Start Game
start.addEventListener('click', () => {
  const stinger = new Audio('./audio/stinger.wav');
  stinger.volume = 0.5
  stinger.play()
  titleScreen.remove()
  introText.style.visibility = 'visible'
  setTimeout(() => {
    const cutsceneAudio = new Audio('./audio/cutsceneaudio.wav')
    cutsceneAudio.play()
    introText.innerText = 'London 2:48am...'
  }, 4000)
  setTimeout(() => {
    introText.innerText = 'Police receive reports of a strange viral outbreak in one of the city\'s lesser known nightclubs...'
  }, 8000)
  setTimeout(() => {
    introText.innerText = 'As an ex-cop with a track record for bringing disco bums to justice, you were the one they called to clean up the mess.'
  }, 14000)
  setTimeout(() => {
    introText.innerText = 'Don\'t let any of these creatures leave the establishment. And try to stay alive...'
  }, 20000)
  setTimeout(() => {
    introText.remove()
  }, 25000)
  setTimeout(() => {
    gameArea.style.visibility = 'visible'
    const stinger2 = new Audio('./audio/stinger2.wav')
    stinger2.play()
  }, 28000)
  setTimeout(() => {
    clearedDisplay.classList.add('cleared')
    clearedDisplay.innerText = `Get ready for the first wave...`
    grid.appendChild(clearedDisplay)
  }, 31000)
  setTimeout(() => {
    grid.removeChild(clearedDisplay)
    startGame()
  }, 37000)
})

//FUNCTIONS
function initialise() {
  for (let x = 0; x <= 8; x++) {
    if (cells[8][x].classList.contains('player')) {
      removeClass(cells[8][x], 'player')
    }
  }
  wave = 1
  lives = 3
  score = 0
  playerPos = 4
  squad = false
  POL = false
  play = false
  fire = false
  enemyAttackSpeed = [500, 500, 1000, 1000, 1000, 1500, 1500, 1500, 1500, 1500, 2000, 2000, 2000, 3000]
  clearInterval(powerSpawnTime)
  clearInterval(moveTime)
  clearInterval(enemySpawnTime)
  clearInterval(floorTime)
  clearGrid()
}
function animateFloor() {
  floorTime = setInterval(() => {
      tiles.forEach((tile) => {
      tile.style.background = `${randomColour()}`
    })
  }, 1000)   
}

function moveFunction() {
  moveTime = setInterval(() => {
    moveAssets()
  }, moveSpeed())
}
function startGame() {
  play = true
  fire = true
  scoreDisplay.innerText = `Score: ${score}`
  livesDisplay.innerText = `Lives: ${lives}`
  waveDisplay.innerText = `Wave: ${wave}`
  startingEnemies(wave)
  updateEnemyPos()
  addClass(cells[8][4], 'player')
  moveFunction()
  enemyAttackLoop()
  powerSpawn()
  animateFloor()
  zombieAudio()
  vamp.currentTime=0
  vamp.play()
  enemiesDisplay.innerText = `Enemies: ${enemiesRemaining}`
}
function waveCleared() {
  play = false
  clearInterval(moveTime)
  clearInterval(powerSpawnTime)
  clearGrid()
  enemyAttackSpeed.pop()
  const clearedDisplay = document.createElement('div')
  clearedDisplay.classList.add('cleared')
  clearedDisplay.innerText = `Wave ${wave} Cleared!`
  grid.appendChild(clearedDisplay)
  wave++
  waveDisplay.innerText = `Wave: ${wave}`
  setTimeout (() => {
    if (wave < 10) {
      clearedDisplay.innerText = `Get ready for Wave ${wave}...`
    } else {
      clearedDisplay.innerText = `BIG BOSS`
    }
  }, 3000)
  setTimeout (() => {
    grid.removeChild(clearedDisplay)
  }, 6000)
  if (wave < 10){   
    setTimeout (() => {  
      play = true 
      startingEnemies(wave)
      updateEnemyPos()
      moveFunction()
      enemyAttackLoop()
      spawnEnemies()
      powerSpawn()
      zombieAudio() 
    }, 6050) 
  } else if (wave === 10) {
    setTimeout (() => {  
      play = true 
      startingEnemies(wave)
      updateEnemyPos()
      moveFunction()
      enemyAttackLoop()
      spawnEnemies()
      powerSpawn()
      bossMoveLoop()
      zombieAudio()  
    }, 6050)
  }
}
function clearGrid() {
  for (let y = 0; y <= 8; y++) {
    for (let x = 0; x <= 8; x++) {
      let cell = cells[y][x]
      if (cell.classList.contains('enemy')){
        removeClass(cell, 'enemy')
      } else if (cell.classList.contains('life')){
        removeClass(cell, 'life')
      } else if (cell.classList.contains('squad')){
        removeClass(cell, 'squad')
      } else if (cell.classList.contains('POL')){
        removeClass(cell, 'POL')
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
function checkEnemies() {
  enemiesDisplay.innerText = `Enemies: ${enemiesRemaining}`
  if (enemiesRemaining === 0 && lives > 0) {
    waveCleared()
  }
}
function updateEnemyPos() {
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
function checkBossLives() {
  if (bossLives === 0) {
    for (let y = 0; y <= 1; y++){
      for (let x = 0; x <= 8; x++) {
        let thisCell = cells[y][x]
        if (thisCell.classList.contains('boss1')) {
          removeClass(thisCell, 'boss1')
        } else if (thisCell.classList.contains('boss2')) {
          removeClass(thisCell, 'boss2')
        } else if (thisCell.classList.contains('boss3')) {
          removeClass(thisCell, 'boss3')
        } else if (thisCell.classList.contains('boss4')) {
          removeClass(thisCell, 'boss4')
        } else if (thisCell.classList.contains('boss5')) {
          removeClass(thisCell, 'boss5')
        } else if (thisCell.classList.contains('boss6')) {
          removeClass(thisCell, 'boss6')
        } else if (thisCell.classList.contains('boss7')) {
          removeClass(thisCell, 'boss7')
        } else if (thisCell.classList.contains('boss8')) {
          removeClass(thisCell, 'boss8')
        }   
      }
    }
    enemiesRemaining = 0
    clearGrid()
    const victoryDisplay = document.createElement('div')
    victoryDisplay.classList.add('victoryDisplay')
    grid.appendChild(victoryDisplay)
    const victoryText = document.createElement('p')
    victoryText.innerText = 'You made it! The outbreak has successfully been contained!' 
    victoryText.classList.add('victoryText')
    victoryDisplay.appendChild(victoryText)
    const playAgain = document.createElement('div')
    playAgain.innerText = 'Play again'
    playAgain.classList.add('playAgain')
    victoryDisplay.appendChild(playAgain)
    playAgain.addEventListener('click', () => {
      initialise()
      startGame()
      victoryDisplay.remove()
      victoryText.remove()
      playAgain.remove()
    })
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
    //20 initial
    enemiesRemaining = 53
    spawnsRemaining = 33
    for (let y = 4; y >= 1; y--) {
      for (let x = 0; x <= 8; x++) {
        if (x % 2 === 0) {
          addClass(cells[y][x], 'enemy')
        }
      }
    }
  } else if (waveNum === 5) {
    //28 initial
    enemiesRemaining = 58
    spawnsRemaining = 30
    for (let y = 4; y >= 1; y-- ) {
      for (let x = 7; x > 0; x--){
        addClass(cells[y][x], 'enemy')    
      }
    }
  } else if (waveNum === 6) {
    //24 initial
    enemiesRemaining = 63
    spawnsRemaining = 39
    for (let y = 1; y <= 3; y++) {
      for (let x = 0; x <= 8; x++) {
        addClass(cells[y][x], 'enemy')
      }
    }
  } else if (waveNum === 7) {
    //27 initial
    enemiesRemaining = 68
    spawnsRemaining = 41
    for (let y = 5; y >= 0; y-- ) {
      for (let x = 8; x >= 0; x--){
        if (y % 2 === 1) {
          addClass(cells[y][x], 'enemy') 
        }     
      }
    }
  } else if (waveNum === 8) {
    //20 initial
    enemiesRemaining = 73
    spawnsRemaining = 53
    for (let y = 4; y >= 1; y--) {
      for (let x = 0; x <= 8; x++) {
        if (x % 2 === 0) {
          addClass(cells[y][x], 'enemy')
        }
      }
    }
  } else if (waveNum === 9) {
    //35 initial
    enemiesRemaining = 78
    spawnsRemaining = 43
    for (let y = 5; y >= 1; y-- ) {
      for (let x = 7; x > 0; x--){
        addClass(cells[y][x], 'enemy')    
      }
    }
  } else if (waveNum === 10) {
    enemiesRemaining = 101
    spawnsRemaining = 100
    addClass(cells[0][3], 'boss1')
    addClass(cells[0][4], 'boss2')
    addClass(cells[0][5], 'boss3')
    addClass(cells[1][3], 'boss4')
    addClass(cells[1][4], 'boss5')
    addClass(cells[1][5], 'boss6')
  }
} 
//Player Shooting
function shoot(position) {
  if (POL === false) {
    
    gunshot.play()
    gunshot.volume = 0.5
  }
  const splat = new Audio (`${splats[Math.floor(Math.random()*splats.length)]}`)
  splat.volume = 0.1 
  let bulletY = 7
  //If cell above player contains enemy, dont spawn bullet
  if (cells[bulletY][position].classList.contains('enemy')) {
    removeClass(cells[bulletY][position], 'enemy')
    zomSplat(cells[bulletY][position])
    splat.play()
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
    bullet.style.width ='3%'
    if (POL === false) {
      bullet.src='./images/bullet.png'
    } else {
      bullet.src='./images/heart.png'
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
          zomSplat(cells[bulletY - 1][position])
          splat.play()
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
          const health = new Audio('./audio/health.wav')
          health.play()
          //If bullet hits squad power
        } else if (cells[bulletY - 1][position].classList.contains('squad')) {
          const squadAudio = new Audio('./audio/squad.wav')
          squadAudio.play()
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
          vamp.volume=0
          const POLAudio = new Audio('./audio/pol.wav')
          POLAudio.volume = 0.6
          POLAudio.play()
          removeClass(cells[bulletY - 1][position], 'POL')
          POL = true
          setTimeout(() => {
            POL = false
            vamp.volume=0.5
          }, 10000)
        } else if (cells[bulletY - 1][position].classList.contains('boss4')||cells[bulletY - 1][position].classList.contains('boss5')||cells[bulletY - 1][position].classList.contains('boss6')) {
          bossLives--
          score+5
          updateScore()
          clearInterval(bulletTime)
          checkBossLives()
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
      if (enemyPositions.length === 0) {
        return
      } else {
        enemyAttack()
      }     
      enemyAttackLoop()
    } else {
      return
    }
  }, randomTime)
}

//Enemy attack
function enemyAttack() {  
  const enemyWeapons = ['./images/can.png', './images/water.png']
  if (enemyPositions.length === 0){
    return
  } else {
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
      bottle.src= `${enemyWeapons[Math.floor(Math.random() * enemyWeapons.length)]}`
      bottle.style.width='2.5%'
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
}

//Move all elements. To be used within an interval
function moveAssets() {
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


//Game Over
function gameOver() {
  vamp.pause()
  const gameSting = new Audio('./audio/stinger.wav')
  gameSting.play()
  play = false
  fire = false
  enemiesRemaining = 0
  clearInterval(moveTime)
  clearInterval(floorTime)
  clearGrid()
  for (let x = 0; x <= 8; x++) {
    let cell = cells[8][x]
    if (cells[8][x].classList.contains('player')){
      removeClass(cell, 'player')
    }
  }
  const gameOverDisplay = document.createElement('div')
  gameOverDisplay.classList.add('gameOverDisplay')
  grid.appendChild(gameOverDisplay)
  const gameOverImage = document.createElement('img')
  gameOverDisplay.appendChild(gameOverImage)
  gameOverImage.src = './images/gameover.png'
  gameOverImage.classList.add('gameOver')
  const tryAgain = document.createElement('div')
  tryAgain.classList.add('tryAgain')
  tryAgain.innerText = 'Try again'
  gameOverDisplay.appendChild(tryAgain)
  tryAgain.addEventListener('click', () => {
    initialise()
    startGame()
    gameOverDisplay.remove()
    gameOverImage.remove()
    tryAgain.remove()
  })
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
    return 500
  }
}
function spawnEnemies() {
  enemySpawnTime = setInterval (() => {
    if (spawnsRemaining > 0) {
      if (wave === 10) {
        addClass(cells[4][0], 'enemy')
      } else {
        addClass(cells[0][0], 'enemy')
      }     
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
function powerSpawn() {
  powerSpawnTime = setInterval(() => {   
    const powerUps = ['squad', 'life', 'POL']
    if (!cells[3][8].classList.contains('enemy') && !cells[2][8].classList.contains('enemy')) {
      addClass(cells[3][8], powerUps[Math.floor(Math.random() * powerUps.length)])
    } else if (!cells[5][8].classList.contains('enemy') && !cells[4][8].classList.contains('enemy')) {
      addClass(cells[3][8], powerUps[Math.floor(Math.random() * powerUps.length)])
    } else if (!cells[1][8].classList.contains('enemy') && !cells[0][8].classList.contains('enemy')) {
      addClass(cells[3][8], powerUps[Math.floor(Math.random() * powerUps.length)])
    }    
  }, 20000)
}
function zombieAudio() {
  const times = [3000, 4000, 5000, 6000]
  setTimeout(() => {
    const zomGrowl = new Audio (`${zomGrowls[Math.floor(Math.random()*zomGrowls.length)]}`)
    zomGrowl.volume = 0.1
    if (play === true) {
    zomGrowl.play()
    zombieAudio()
    }
  }, times[Math.floor(Math.random()*times.length)]) 
}

function bossMoveLoop() {
  const bossMoveSpeeds = [300, 500, 600, 800, 1000, 1500]
  setTimeout(() => {
    if (bossLives > 0) {
      bossMove()
      bossMoveLoop()
    }  
  }, bossMoveSpeeds[Math.floor(Math.random() * bossMoveSpeeds.length)])
}

function bossMove() {
  const bossMoveOptions = ['left', 'right']
  if (cells[0][0].classList.contains('boss1')) {
    bossMoveRight()
  } else if (cells[0][8].classList.contains('boss3')) {
    bossMoveLeft()
  } else {
    if (bossMoveOptions[Math.floor(Math.random() * bossMoveOptions.length)] === 'left'){
      bossMoveLeft()
    } else {
      bossMoveRight()
    }   
  }
}
function bossMoveRight() {
  for (let y = 0; y <=1; y++) {
    for (let x = 8; x >= 0; x--) {
      if (cells[y][x].classList.contains('boss1')) {
        removeClass(cells[y][x], 'boss1')
        addClass(cells[y][x+1], 'boss1')
      } else if (cells[y][x].classList.contains('boss2')) {
        removeClass(cells[y][x], 'boss2')
        addClass(cells[y][x+1], 'boss2')
      } else if (cells[y][x].classList.contains('boss3')) {
        removeClass(cells[y][x], 'boss3')
        addClass(cells[y][x+1], 'boss3')
      } else if (cells[y][x].classList.contains('boss4')) {
        removeClass(cells[y][x], 'boss4')
        addClass(cells[y][x+1], 'boss4')
      } else if (cells[y][x].classList.contains('boss5')) {
        removeClass(cells[y][x], 'boss5')
        addClass(cells[y][x+1], 'boss5')
      } else if (cells[y][x].classList.contains('boss6')) {
        removeClass(cells[y][x], 'boss6')
        addClass(cells[y][x+1], 'boss6')
      } 
    }
  }
}
function bossMoveLeft() {
  for (let y = 0; y <=1; y++) {
    for (let x = 0; x <=8; x++) {
      if (cells[y][x].classList.contains('boss1')) {
        removeClass(cells[y][x], 'boss1')
        addClass(cells[y][x-1], 'boss1')
      } else if (cells[y][x].classList.contains('boss2')) {
        removeClass(cells[y][x], 'boss2')
        addClass(cells[y][x-1], 'boss2')
      } else if (cells[y][x].classList.contains('boss3')) {
        removeClass(cells[y][x], 'boss3')
        addClass(cells[y][x-1], 'boss3')
      } else if (cells[y][x].classList.contains('boss4')) {
        removeClass(cells[y][x], 'boss4')
        addClass(cells[y][x-1], 'boss4')
      } else if (cells[y][x].classList.contains('boss5')) {
        removeClass(cells[y][x], 'boss5')
        addClass(cells[y][x-1], 'boss5')
      } else if (cells[y][x].classList.contains('boss6')) {
        removeClass(cells[y][x], 'boss6')
        addClass(cells[y][x-1], 'boss6')
      } 
    }
  }
}
function randomZom() {
  const zoms = ['male', 'female']
  return zoms[Math.floor(Math.random() * zoms.length)]
}
function zomSplat(cell) {
  cell.classList.add('splat')
  setTimeout(() => {
    cell.classList.remove('splat')
  }, 100)
}