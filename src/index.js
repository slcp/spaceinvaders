import { new2DCanvas } from "./canvas";
import { newEventBus, publishToEventBus } from "./events";
import { NEW_GAME } from "./events/events";
import SpaceInvadersGame from "./game";
import GameMessage from "./gameMessage/gameMessage";
import GameState from "./gameState/gameState";
import Player from "./player/player";
import Lives from "./ui/lives";
import { initialiseScore, newScore } from "./ui/score";
import { makeUI } from "./ui/ui";

const eventBus = newEventBus();
const numPlayers = 1;
const players = Array.from(new Array(numPlayers)).map(
  () => new Player({ eventBus })
);
// const players = Array.from(new Array(numPlayers)).map(() => new Player({eventBus}))
const gameContext = {
  canvas: document.getElementById("game-canvas"),
  newGameButton: document.getElementById("new-game"),
  eventBus,
  height: 1000,
  width: 1000,
  players: players.map((p) => p.id),
};

// These can safely be mapped in order to players
const [scoreContainers, livesContainers] = makeUI(players);
players.map((p, i) => {
  p.init();
  return [
    initialiseScore(
      newScore({ element: scoreContainers[i], id: p.id }, eventBus)
    ),
    new Lives({ eventBus, element: livesContainers[i], id: p.id }).init(),
  ];
});
new GameMessage({
  eventBus,
  element: document.getElementById("game-message"),
}).init();
new SpaceInvadersGame(gameContext).init();
new GameState({ eventBus }).init();
// The canvas that is responsible for drawing the game
new2DCanvas(document.getElementById("game-canvas"));
gameContext.newGameButton.addEventListener("click", function () {
  publishToEventBus(evenBus, NEW_GAME);
});
