"use strict";

class Snake {
    constructor() {
        this.length = 5;
        this.bodyCells = []; // first cell is the head, last is the tail
    }

    initializeSnake() {
        // find ~center cell, add it to the bodyCells
        // add the this.length number of cells below it
        // call drawSnakeCells with array of cells
        let start = Math.floor(dims/2);
        let headCell = {
            x: start,
            y: start
        };
        this.bodyCells.push(headCell);
        for (let y = 1; y < this.length; y++) {
            this.bodyCells.push({
                x: start,
                y: y + start
            });
        }

        console.log(this.bodyCells);
        this.drawUndrawSnakeCells(this.bodyCells);
    }

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

        this.drawUndrawSnakeCells([arrivingCell]);
        this.bodyCells.unshift(arrivingCell);

        if (!this.checkForFood(arrivingCell)) {
            let leavingCell = this.bodyCells.pop();
            this.drawUndrawSnakeCells([leavingCell])
        } 

        console.log(JSON.parse(JSON.stringify(this.bodyCells)));
    }

    checkForFood(cell) {
        let $cell = $(`#c-${cell.x}-${cell.y}`);
        if ($cell.hasClass("food")) {
            $cell.removeClass("food");
            Food.addFoodToBoard();
            return true;
        }
        return false;
    }

    /**
     * 
     * @param {array} cells - array of cells to draw, even if it's one cell
     */
    drawUndrawSnakeCells(cells) {
        // loop through passed cells
        // for each, grab div with matching coordinates
        // update class of that div to point to snake class
        for (let cell of cells) {
            $(`#c-${cell.x}-${cell.y}`).toggleClass("snake");
        } 
    }
}

class Food {
    constructor() {

    }

    static addFoodToBoard() {
        // find an empty cell
        let x = 0;
        let y = 0;
        do {
            x = randomInt(0, dims - 1);
            y = randomInt(0, dims - 1);
        } while ($(`#c-${x}-${y}`).hasClass("snake"));
        // add the food class to it
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