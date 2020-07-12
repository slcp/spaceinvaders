import SpaceInvadersGame from './game';
import Canvas2D from "./canvas";
import EventBus, {NEW_GAME} from "./events/events";
import Score from "./game/score";
import Player from "./game/player";
import {makeUI} from "./ui";
import GameState from "./game/gameState";

const eventBus = new EventBus();
const numPlayers = 1;
const players = Array.from(new Array(numPlayers)).map(() => new Player({eventBus}))
const gameContext = {
    canvas: document.getElementById("game-canvas"),
    newGameButton: document.getElementById('new-game'),
    gameMessage: document.getElementById('game-message'),
    eventBus,
    height: 1000,
    width: 1000,
    players: players.map(p => p.id)
}

// These can safely be mapped in order to players
const [scoreContainers, livesContainers] = makeUI(players)
players.map((p, i) => {
    p.init()
    return [new Score({eventBus, element: scoreContainers[i], id: p.id}).init()]
});
new SpaceInvadersGame(gameContext).init();
new GameState({eventBus}).init();
// The canvas that is responsible for drawing the game
new Canvas2D(eventBus, document.getElementById("game-canvas")).init();
gameContext.newGameButton.addEventListener('click', function () {
    eventBus.publish(NEW_GAME)
}.bind(this))
