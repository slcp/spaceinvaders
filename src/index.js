import { intialiseCanvas, new2DCanvas } from "./canvas";
import { newEventBus, publishToEventBus } from "./events";
import { NEW_GAME } from "./events/events";
import { initialiseGame, newGame } from "./game";
import GameMessage from "./gameMessage/gameMessage";
import GameState from "./gameState/gameState";
import { initialisePlayer, newPlayer } from "./player/player";
import { initialiseLife, newLife } from "./ui/lives";
import { initialiseScore, newScore } from "./ui/score";
import { makeUI } from "./ui/ui";

const eventBus = newEventBus();
const numPlayers = 1;
const players = Array.from(new Array(numPlayers)).map(() => newPlayer());
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
Promise.all(
  players.map(async (p, i) => {
    await initialisePlayer(p, eventBus);
    return [
      await initialiseScore(
        newScore({ element: scoreContainers[i], id: p.id }, eventBus)
      ),
      await initialiseLife(
        newLife({ element: livesContainers[i], id: p.id }),
        eventBus
      ),
    ];
  })
).then(async () => {
  new GameMessage({
    eventBus,
    element: document.getElementById("game-message"),
  }).init();
  initialiseGame(eventBus, newGame(), gameContext);
  new GameState({ eventBus }).init();
  // The canvas that is responsible for drawing the game
  await intialiseCanvas(
    new2DCanvas(document.getElementById("game-canvas")),
    eventBus
  );
  gameContext.newGameButton.addEventListener("click", function () {
    publishToEventBus(eventBus, NEW_GAME);
  });
});
