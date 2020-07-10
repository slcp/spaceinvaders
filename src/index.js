import SpaceInvadersGame from './game';
import Canvas2D from "./canvas";
import EventBus from "./events/events";
import Score from "./game/score";

const eventBus = new EventBus();
const gameContext = {
    canvas: document.getElementById("game-canvas"),
    newGameButton: document.getElementById('new-game'),
    gameMessage: document.getElementById('game-message'),
    eventBus,
    height: 1000,
    width: 1000,
}

new SpaceInvadersGame(gameContext).init();
// The canvas take is responsible for drawing the game
new Canvas2D(eventBus, document.getElementById("game-canvas")).init();
new Score(eventBus, document.getElementById('score')).init()
