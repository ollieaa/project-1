<p align="center">
  <img alt="club undead" src="./images/banner.png"/>
</p>

<p align="center">
  My first project at General Assembly - a grid based game using HTML, CSS and JavaScript.
</p>

<p align="center">
  <img alt="gameplay" src="./screenshots/gameplay.gif"/>
</p>

<hr>

## The Brief

*	Render a game in the browser
*	Design a full game loop with win/loose conditions
*	Include separate HTML / CSS / JavaScript files
*	Stick with KISS (Keep It Simple Stupid) and DRY (Don't Repeat Yourself) principles
*	Use JavaScript for DOM manipulation
*	Deploy the game online, where the rest of the world can access it
*	Use semantic markup for HTML and CSS (adhere to best practices)

## Technologies Used

* HTML5
* Vanilla CSS3
* Vanilla JavaScript
* Git & GitHub
* Google Fonts
* GIMP image editing software
* Ableton Live 10

## Game Overview

For my first project on the software engineering immersive course at general assembly, we were given a week to create a grid based game as a solo endeavour, using a combination of the HTML, CSS, and JavaScript techniques that we had learned so far. Despite being taught a solid foundational knowledge within those technologies, the scope of this project was much larger than anything we had done so far, and the first assignment we had been set that we didn’t have explicit solutions for from previous classwork.

Given a sample collection of classic grid based games to model our projects upon, I opted for doing a spin on Space Invaders, a game where the player controls a turret that can move from left to right, shooting down a fleet of incoming space ships whilst avoiding the bombs that they drop and preventing them from reaching the bottom of the screen.

## Minimum Viable Product

* Player movement along the x-axis of the grid, with boundary detection to restrict the player from moving outside of the grid.
*	A shooting mechanic for killing enemies.
*	A movement mechanic to snake the enemies down towards the bottom of the screen.
*	A mechanic for randomising enemy attacks.
*	At least 1 wave of enemies for the player to eliminate.
*	A full game loop with victory and game over conditions.

## Stretch Goals

*	A selection of powerups for the player to attain.
*	Multiple waves of enemies with increasing difficulty.
*	A Boss fight at the end of the game.
*	An introductory cutscene to give the game some atmosphere and setting.
*	Score, wave number, lives and enemies remaining display counters.

Although it was a big push, I managed to fulfill all of my stretch goals, along with a fully functioning base game.

I ended up deciding upon a zombie themed twist on Space Invaders, set in a London nightclub where a viral outbreak had been reported. The player controls an ex-cop who is called to the scene to eliminate the infected (who have somehow retained enough motor function to hurl beer cans and water bottles at the player), and contain the virus.

Each wave would begin with a different arrangement of starting enemies to keep things interesting, and every wave after the first would also have enemies spawning at the top of the grid periodically. Each wave is made more challenging than the previous one in three ways:

*	Each round has more zombies to kill than the previous.
*	The zombies gradually move faster and faster.
*	The zombies’ attacks become more frequent.

## Game Approach/Implementation

To set up the grid which would form the gameplay area, I created an empty an array named 'cells', and used a for loop to push 9 empty arrays to 'cells', each representing a horizontal row along the y axis of my 9x9 grid. Within this for loop I also nested another for loop, creating a div (with styling to determine the size) and pushing it to the corresponding sub array of 'cells' for each of it's 9 itertions, representing the cells of the vertical columns along the x axis. Separating the rows and columns this way rather than having a single array representing all of the cells of the grid, allowed me to target a single cell very easily by using it's coordinates, e.g. cells[3][7].

GRID CODE SCREENSHOT

I used a very similar process to generate a second grid to make up the dance floor, using a combination of flexbox, absolute positioning, and z-index to center it over the top of the gameplay grid. I then created a function to animate the dancefloor, changing the background colour of each tile in time with the music.

A huge portion of the gameplay mechanics rely on using the DOM to toggle classes on and off of each cell in the gameplay grid (using CSS to apply different background images for the player, enemies, power-ups etc), so I created a couple of utility functions for adding and removing classes to shorten the code a little.

I added some event listeners to the left and right arrow keys for player movement, and to the space bar for the player shooting. For the movement, I implemented some boundary detection to prevent the player from moving outside of the grid, and keeping them in the bottom row. One of the available power-ups calls in two squadmates, placed either side of the player for additional firepower. Using an if statement, I tightened up the boundary detection when the squad power-up was active, to accomodate the additional characters.

PLAYER MOVEMENT SCREENSHOT

When creating the function for the shooting mechanic, one of the problems I encountered was that the bullet trajectory would follow the player as they moved left and right. I was initally using an interval to rapidly move the bullet up along the vertical columns of the grid, based on the players position. To overcome this I passed through the players current postion on the grid at the time the shot was fired as an argument to the shooting function. I could then base the bullet's trajectory off of this instead, separating it from the players movement. 

