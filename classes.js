"use strict";


/**
 * class for the Game and board itself
 */
class Game {
    constructor(tickRate, width, height) {
        this.width = width;
        this.height = height;
        this.tickRate = tickRate;
        this.ticksId = null;
    }

    /**
     * static method to draw a new board; one parameter will draw a square
     * board with that width and height; otherwise, separate widths and heights
     * can be identified
     * @param {integer} width - width of game board
     * @param {integer} height - height of game board; default is same as width
     * @returns new Game instance
     */
    static drawBoard(tickRate, width, height=width) {
        for (let y = 0; y < height; y++) {

            let $row = $("<tr>");
            for (let x = 0; x < width; x++) {
                let $cell = $(`<td>
                    <div id=c-${x}-${y} class="cell"></div>
                </td>`);
                $row.append($cell); 
            }
            $gameBoard.append($row);
        }    

        return new Game(tickRate, width, height);
    }

    /**
     * called to start the game
     */
    startTicks() {
        this.ticksId = setInterval(() => {
            snake.moveSnake();
        }, this.tickRate)
    }

    /**
     * called when the snake hits itself or the wall to end the game
     */
    endGame() {
        clearInterval(this.ticksId);
        console.log("YOU LOSE!")
    }
}


/**
 * class for creating the Snake; created through the initializeSnake() method,
 * but has methods for moving the snake, checking overlap with food, and 
 * drawing/undrawing snake cells
 */
class Snake {
    constructor(cells, length) {
        this.length = length;
        this.bodyCells = cells; // first cell is the head, last is the tail
        this.drawUndrawSnakeCells(this.bodyCells);
    }

    /**
     * static method to build the snake at its starting location
     * @param {integer} length - optional length parameter; defaults to 5
     * @returns new Snake instance
     */
    static initializeSnake(length=5) {
        let startCells = [];
        let headCell = {
            x: Math.floor(game.width/2),
            y: Math.floor(game.height/2)
        };

        startCells.push(headCell);
        for (let y = 1; y < length; y++) {
            startCells.push({
                x: headCell.x,
                y: headCell.y + y
            });
        }

        return new Snake(startCells, length)
    }

    /**
     * function called every tick to "move" the snake, which is really just
     * adding a front cell and removing the back cell (assuming no food was
     * encountered). also checks if snake has run into itself or the wall,
     * and triggeres end game if so.
     */
    moveSnake() {
        let arrivingCell = JSON.parse(JSON.stringify(this.bodyCells[0]));

        if (lastDirection === "up") {
            arrivingCell.y -= 1;
        } else if (lastDirection === "left") {
            arrivingCell.x -= 1;
        } else if (lastDirection === "down") {
            arrivingCell.y += 1;
        } else if (lastDirection === "right") {
            arrivingCell.x += 1;
        }

        let isOverlapping = this.checkForOverlap(arrivingCell);
        let isOffBoard = this.checkForOffBoard(arrivingCell);
        // check if arrivingCell is already a snake cell
        if (isOverlapping | isOffBoard) {
            game.endGame();
        } else {
            this.drawUndrawSnakeCells([arrivingCell]);
            this.bodyCells.unshift(arrivingCell);
    
            if (!this.checkForFood(arrivingCell)) {
                let leavingCell = this.bodyCells.pop();
                this.drawUndrawSnakeCells([leavingCell])
            }     
        }
        // check if arrivingCell is on the board


        console.log(JSON.parse(JSON.stringify(this.bodyCells)));
    }

    /**
     * checks if the cell that the snake is about to move into has food in it
     * @param {array} cell - coordinate of cell, in [x,y] format 
     * @returns TRUE if food is in the cell, FALSE if not
     */
    checkForFood(cell) {
        let $cell = getJqCell(cell);
        if ($cell.hasClass("food")) {
            $cell.removeClass("food");
            Food.addFoodToBoard();
            this.length++;

            return true;
        }

        return false;
    }

    /**
     * checks if the passed coordinates point to a cell that is already
     * occupied by the snake
     * @param {object} cell - coordinate cell with x and y parameters
     * @returns TRUE if is a snake cell, FALSE if not
     */
    checkForOverlap(cell) {
        let $cell = getJqCell(cell);
        if ($cell.hasClass("snake")) {
            return true;
        }

        return false;
    }

    /**
     * checks if the passed coordinates point to a cell that doesn't exist 
     * (i.e. is outside of the dimensions of the board)
     * @param {object} cell - coordinate cell with x and y parameters
     * @returns TRUE if cell is out of the bounds of the board; FALSE if valid 
     * cell
     */
    checkForOffBoard(cell) {
        let offTop = cell.y < 0;
        let offLeft = cell.x < 0;
        let offBottom = cell.y >= game.height;
        let offRight = cell.x >= game.width;

        return offTop | offLeft | offBottom | offRight;
    }

    /**
     * toggles "snake" class on the cells defined by the passed array of
     * coordinate
     * @param {array} cells - array of coordinates point to cells to  draw/
     * undraw - even if it's one cell, put it in an array
     */
    drawUndrawSnakeCells(cells) {
        for (let cell of cells) {
            getJqCell(cell).toggleClass("snake");
        } 
    }
}


/**
 * class for Food on the board; right now just has a static method to 
 * instantiate one at a random location, but could have more in the future
 */
class Food {
    constructor() {

    }

    /**
     * static method to create a new food on the board
     */
    static addFoodToBoard() {
        let x = 0;
        let y = 0;
        do {
            x = randomInt(0, game.width - 1);
            y = randomInt(0, game.height - 1);
        } while (getJqCell({x, y}).hasClass("snake"));
        getJqCell({x, y}).addClass("food");
    }
}

/**
 * generates a random integer, inclusive of the bounds provided
 * @param {integer} low - low bound
 * @param {integer} high - high bound
 * @returns random integer
 */
 function randomInt(low, high) {
    if (typeof low !== "number" || typeof high !== "number") {
        throw new Error("Invalid data type - both arguments must be numbers")
    }
    if (parseInt(low) !== low || parseInt(high) !== high) {
        throw new Error("One or more non-integers provided - unpredictable results!")
    }
    return Math.floor(Math.random() * (high - low + 1)) + low;
}

function getJqCell(cell) {
    return $(`#c-${cell.x}-${cell.y}`);
}