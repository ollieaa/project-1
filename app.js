//GLOBAL VARIABLES
const cells = []
const width = 10
let lives = 3 
let score = 0
const grid = document.querySelector('#grid')

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
// Set the cells in the odd numbered rows to have a class of left, and the even numbered rows to have class of right
for (let y = 9; y >= 0; y--) {
  for (let x = 9; x >= 0; x--) {
    if ((y % 2) === 1) {       
      cells[y][x].classList.add('left')
    } else {
      cells[y][x].classList.add('right')
    }
  }
}

//Function to populate the grid with the starting enemies
function startingEnemies() {

  cells[9][6].classList.remove('empty')
  cells[9][5].classList.add('player')

  for (let y = 3; y >= 0; y-- ) {
    for (let x = 7; x > 1; x--){
      cells[y][x].classList.remove('empty')
      cells[y][x].classList.add('enemy')     
    }
  }
}  