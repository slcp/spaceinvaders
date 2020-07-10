import SpaceInvadersGame from './game';
import Canvas2D from "./canvas";
import EventBus from "./events/events";

const eventBus = new EventBus();
const gameContext = {
    canvas: document.getElementById("game-canvas"),
    scoreBoard: document.getElementById('score'),
    newGameButton: document.getElementById('new-game'),
    gameMessage: document.getElementById('game-message'),
    eventBus,
    height: 1000,
    width: 1000,
}

new SpaceInvadersGame(gameContext).init();
// The canvas take is responsible for drawing the game
new Canvas2D(eventBus, document.getElementById("game-canvas")).init();
