import { intialiseCanvas, new2DCanvas } from "./canvas";
import { newEventBus, publishToEventBus } from "./events";
import { NEW_GAME } from "./events/events";
import { newGame, startGame } from "./game";
import { initialiseGame } from "./game/initialise";
import GameMessage from "./gameMessage/gameMessage";
import GameState, {
  initialiseGameState,
  newGameState,
} from "./gameState/gameState";
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
        newScore({ element: scoreContainers[i], id: p.id }),
        eventBus
      ),
      await initialiseLife(
        newLife({ element: livesContainers[i], id: p.id }),
        eventBus
      ),
    ];
  })
)
  .then(async () => {
    new GameMessage({
      eventBus,
      element: document.getElementById("game-message"),
    }).init();
    const game = newGame();
    return initialiseGame(eventBus, game, gameContext);
  })
  .then(() => {
    return initialiseGameState(eventBus, newGameState());
  })
  .then(() => {
    return intialiseCanvas(
      // The canvas that is responsible for drawing the game
      new2DCanvas(document.getElementById("game-canvas")),
      eventBus
    );
  })
  .then(() => {
    return startGame(eventBus, game, gameContext);
  })
  .then(() => {
    gameContext.newGameButton.addEventListener("click", () => {
      publishToEventBus(eventBus, NEW_GAME);
    });
  });
