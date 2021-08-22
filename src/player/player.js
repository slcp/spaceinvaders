import { v4 as uuid } from "uuid";
import { publishToEventBus, subscribeToEventBus } from "../events";
import {
  BAD_SHIP_KILLED_BY_GOOD_BULLET,
  GOOD_SHIP_KILLED_BY_BAD_BULLET,
  PLAYER_LOST_LIFE,
  RESPAWN_GOOD_SHIP,
  SET_SCORE,
} from "../events/events";

export const PLAYER_TYPE = "_player";

let players = [];

const handlePlayerKilled = (bus) => ({ id }) => {
  const player = players.find((p) => id === p.id);
  player.lives = player.lives - 1;
  publishToEventBus(bus, PLAYER_LOST_LIFE, {
    id,
    remainingLives: player.lives,
  });
  if (player.lives) {
    publishToEventBus(bus, RESPAWN_GOOD_SHIP, { id });
  }
};

const handleBadShipKilled = (bus) => ({ id }) => {
  const player = players.find((p) => id === p.id);
  if (!player) {
    throw new Error(`player with id '${id}' is not known, cannot set score`);
  }
  player.score = player.score + 10;
  publishToEventBus(bus, SET_SCORE, { id: player.id, value: player.score });
};

export const initialisePlayer = async (player, bus) => {
  players = [...players, player];
  await subscribeToEventBus(
    bus,
    GOOD_SHIP_KILLED_BY_BAD_BULLET,
    handlePlayerKilled(bus)
  );
  await subscribeToEventBus(
    bus,
    BAD_SHIP_KILLED_BY_GOOD_BULLET,
    handleBadShipKilled(bus)
  );
};

export const newPlayer = () => ({
  _type: PLAYER_TYPE,
  id: uuid(),
  score: 0,
  lives: 3,
});
