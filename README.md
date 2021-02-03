# Game of Life

## Foreword
#### I know, that the TypeScript is not the optimal tool for this project, but i think, that's a good project for practicing this language. I don't have deep experience with TS, but i like this tool and I would like to get deeper knowledge with it.

## Licence
You can freely use, modify this project. I believe in opensource community. If you think, this practice project will be useful for you, use and enjoy it! :) 

# Install 
This project uses TypeScript, Bootstrap, and JQuery.
If you want to build the project by yourself, you might need to add JQuery type as dependency, so TS can compile properly

```sh
npm install @types/jquery --save-dev
```
## Rules and the game
The rules for the game of life are simple. We start off by populating a “world” with as many “live” cells as we choose, the initial configuration. Then based on the rules below, we see our population grow, change and die off as generations go by.
- Any live cell with fewer than two live neighbors dies, as if caused by under population.
- Any live cell with two or three live neighbors lives on to the next generation.
- Any live cell with more than three live neighbors dies, as if by overcrowding.
- Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

## For developers
There are two own types, Cell And Area. Cell type is used to handle the cells and its coordinates, Area is used to handle the visible piece of our "world".

### Classes
#### Main
##### Properties

```sh 
areaWidth: number, stores the visible map width 
areaHeight: number, stores the visible map height
offsetX: number, stores the current offset on the "X" axis (for navigation)
offsetY: number, stores the current offset on the "Y" axis (for navigation)
cellEnviroment: number, definies the cell's enviroment size 
autoPlayContainer: variable for stroing the interval object (autoplay feature )
selectedCells: array of <Cell>: here will be stored the living cells
deleteList: array of <Cell>: here will be stored the cells, which will be die at end of the round
addList: array of <Cell>: here will be stored the cells, which will be alive at end of the round
visibleArea: <Area> : Current visible piece of the world
```
##### Functions
###### construct()
Here we render the visible area, bind to handling events and controls

###### RenderArea()
From the (0;0) coordinate we draw the world on the screen with HTML table.
The visible area's size will be stored and the DisplayCurrentArea() shows the world. 

###### setVisibleArea(rangeX: number[],rangeY: number[])
Setter for storing the current visible area. 
rangeX and rangeY are a section.

###### DisplayCurrentArea()
Here will be updated the visible section on the top of the table
...and then the living cells will be filtered, we collect that cells, which coordinates are in the visible area.

If there aren't any living cell , we stop the autoplay, if it's needed.

###### addSelectedCell(cell: Cell)
Adds the given cell to the living cells list

###### removeSelectedCell(cell: Cell)
Removes the given cell from the living cells list, if it's in the list.

###### cellIsAdded(tmp: Cell)
Tells us, wether the given cell is in the livings cells list, or not.

###### getNeighbours(cell: Cell)
Returns with an array of <Cell> with  that living cells, which are in the given cell's enviroment

###### getEnviroment(cell: Cell)
Returns with an array of <Cell> with  that dead cells, which are in the given cell's enviroment

###### initCellSelecting()
We bind here to the cell's click events, handling the cell selecting/unselecting action

###### initNavigation()
We bing here to the arrow keys "keydown" events. It's incrementing or decrementing the right offset values and refresh the screen.

###### initActions() 
We bind here to the click events of the start and stop buttons, if it's needed starting and stopping the autoplay.

###### playRound()
It's taking all of the required actions at the end of the round. Removes, adds cells and refresh the screen.

###### startAutoPlay()
Sets an interval, what calls the playRound() function in every 1.5 seconds.

###### stopAutoPlay()
Clears the pegged interval action

###### buildAddList()
It's building an array of <Cell>,what contains all the dead cells, which become alive at the end of the round. 

###### addBirthingCells()
It's iterating over those dead cells, which become alive.

###### builDeleteList()
It's building an array of <Cell>,what contains all the living cells, which become dead at the end of the round. 

###### deleteDyingCells()
It's iterating over those living cells, which become dead.

###### handleButtonStatuses()
Handling the button's UI states.

###### resetStartButton()
Resets the start button UI states.
