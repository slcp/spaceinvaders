import { subscribeToEventBus } from "../events";
import { ADD_LIFE, LOSE_LIFE } from "../events/events";
import { makeLifeRepresentation } from "./ui";

let lives = [];

export const LIFE_TYPE = "_life";

export const addLife = ({ id }) => {
  const { element } = lives.find((l) => l.id === id);
  const index = parseInt(element.lastChild.id.split("-")[1], 10) + 1;
  element.appendChild(makeLifeRepresentation(index));
};

export const loseLife = ({ id }) => {
  const { element } = lives.find((l) => l.id === id);
  element.removeChild(element.lastChild);
};

export const initialiseLife = (life, bus) => {
  if (!!lives.find((l) => l.id === life.id)) {
    throw new Error(`life with id ${life.id} already initialised`);
  }

  lives = [...lives, life];
  subscribeToEventBus(bus, ADD_LIFE, addLife);
  subscribeToEventBus(bus, LOSE_LIFE, loseLife);
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
