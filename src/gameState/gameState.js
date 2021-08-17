import { publishToEventBus, subscribeToEventBus } from "../events";
import {
  BAD_SHIP_KILLED_BY_GOOD_BULLET,
  END_GAME,
  NEW_GAME,
  PLAYER_LOST_LIFE,
  SET_MESSAGE,
  START_NEXT_LEVEL,
} from "../events/events";

export const newGameState = () => ({
  badShips: [],
  playerLives: [],
});

export const initialiseGameState = async (bus, state) => {
  subscribeToEventBus(bus, PLAYER_LOST_LIFE, async (event) =>
    playerKilled(bus, state, event)
  );
  subscribeToEventBus(
    bus,
    BAD_SHIP_KILLED_BY_GOOD_BULLET,
    async (event) => await badShipKilled(bus, state, event)
  );
  subscribeToEventBus(
    bus,
    NEW_GAME,
    async () =>
      await publishToEventBus(bus, SET_MESSAGE, {
        message: "New game -  enjoy!!",
      })
  );
};

export const badShipKilled = async (bus, state, { remainingShipCount }) => {
  if (typeof remainingShipCount !== "number") {
    throw new Error(
      `The type of remainingShipCount must be a number, received: ${typeof remainingShipCount}`
    );
  }
  state.badShips = remainingShipCount;
  await checkGameState(bus, state);
};

export const playerKilled = async (bus, state, { remainingLives }) => {
  if (typeof remainingLives !== "number") {
    throw new Error(
      `The type of remainingLives must be a number, received: ${typeof remainingLives}`
    );
  }
  state.playerLives = remainingLives;
  await checkGameState(bus, state);
};

export const checkGameState = async (bus, state) => {
  if (state.badShips === 0) {
    await publishToEventBus(bus, START_NEXT_LEVEL);
    await publishToEventBus(bus, SET_MESSAGE, { message: "Next level" });
    return;
  }
  if (state.playerLives === 0) {
    await publishToEventBus(bus, END_GAME);
    await publishToEventBus(bus, SET_MESSAGE, {
      message: "Game over",
      persist: true,
    });
    return;
  }
};
