"use strict";

const MILISECONDS_PER_TICK = 100;
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

let lastDirection = "up"

$("body").on("keyup", handleKeyPress);

function handleKeyPress(event) {
    let key = event.originalEvent.key;
    lastDirection = KEY_DIRECTION_MAPPING[key];
}

let game = Game.drawBoard(MILISECONDS_PER_TICK, 10);
let snake = Snake.initializeSnake();

Food.addFoodToBoard();

game.startTicks();
