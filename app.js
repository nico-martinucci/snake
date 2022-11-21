"use strict";

const MILISECONDS_PER_TICK = 200;
const KEY_DIRECTION_MAPPING = {
    w: "up",
    ArrowUp: "up",
    a: "left",
    ArrowLeft: "left",
    s: "down",
    ArrowDown: "down",
    d: "right",
    ArrowRight: "right"
}

const $gameBoard = $("#board");
const dims = 20;

let lastDirection = "up"

function drawBoard() {
    for (let y = 0; y < dims; y++) {

        let $row = $("<tr>");
        for (let x = 0; x < dims; x++) {
            let $cell = $(`<td>
                <div id=c-${x}-${y} class="cell"></div>
            </td>`);
            $row.append($cell); 
        }
        $gameBoard.append($row);
    }
}

$("body").on("keyup", handleKeyPress);

function handleKeyPress(event) {
    let key = event.originalEvent.key;
    lastDirection = KEY_DIRECTION_MAPPING[key];
}

drawBoard();
Food.addFoodToBoard();
let snake = new Snake;
snake.initializeSnake();

setInterval(() => {
    snake.moveSnake();
}, MILISECONDS_PER_TICK)



