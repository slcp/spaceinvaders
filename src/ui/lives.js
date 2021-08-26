import { subscribeToEventBus } from "../events";
import { PLAYER_LOST_LIFE } from "../events/events";

let lives = [];

export const LIFE_TYPE = "_life";

export const loseLife = ({ id }) => {
  const { element } = lives.find((l) => l.id === id);
  element.removeChild(element.lastChild);
};

export const initialiseLife = async (life, bus) => {
  if (!!lives.find((l) => l.id === life.id)) {
    throw new Error(`life with id ${life.id} already initialised`);
  }

  lives = [...lives, life];
  await subscribeToEventBus(bus, PLAYER_LOST_LIFE, loseLife);
};

export const newLife = ({ element, id }) => {
  if (
    typeof element.removeChild !== "function" &&
    typeof element.appendChild !== "function"
  ) {
    throw new Error("element must represent a DOM element");
  }

  return {
    _type: LIFE_TYPE,
    element,
    id,
  };
};
