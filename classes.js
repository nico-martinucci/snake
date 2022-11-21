"use strict";


/**
 * class for the Game and board itself
 */
class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    /**
     * static method to draw a new board; one parameter will draw a square
     * board with that width and height; otherwise, separate widths and heights
     * can be identified
     * @param {integer} width - width of game board
     * @param {integer} height - height of game board; default is same as width
     * @returns new Game instance
     */
    static drawBoard(width, height=width) {
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

        return new Game(width, height);
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

        // check if arrivingCell is already a snake cell
        // check if arrivingCell is on the board

        this.drawUndrawSnakeCells([arrivingCell]);
        this.bodyCells.unshift(arrivingCell);

        if (!this.checkForFood(arrivingCell)) {
            let leavingCell = this.bodyCells.pop();
            this.drawUndrawSnakeCells([leavingCell])
        } 

        console.log(JSON.parse(JSON.stringify(this.bodyCells)));
    }

    /**
     * checks if the cell that the snake is about to move into has food in it
     * @param {array} cell - coordinate of cell, in [x,y] format 
     * @returns TRUE if food is in the cell, FALSE if not
     */
    checkForFood(cell) {
        let $cell = $(`#c-${cell.x}-${cell.y}`);
        if ($cell.hasClass("food")) {
            $cell.removeClass("food");
            Food.addFoodToBoard();
            this.length++;

            return true;
        }

        return false;
    }

    /**
     * toggles "snake" class on the cells defined by the passed array of
     * coordinate
     * @param {array} cells - array of coordinates point to cells to  draw/
     * undraw - even if it's one cell, put it in an array
     */
    drawUndrawSnakeCells(cells) {
        for (let cell of cells) {
            $(`#c-${cell.x}-${cell.y}`).toggleClass("snake");
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
        } while ($(`#c-${x}-${y}`).hasClass("snake"));
        $(`#c-${x}-${y}`).addClass("food");
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