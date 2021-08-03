// class Score {
//   constructor({ eventBus, element, id }) {
//     this.eventBus = eventBus;
//     this.element = element;
//     this.id = id;
//   }

import { subscribeToEventBus } from "../events";
import { SET_SCORE } from "../events/events";

//   init() {
//     this.eventBus.subscribe(SET_SCORE, this.setScore.bind(this));
//     return this;
//   }

//   setScore({ id, score }) {
//     if (this.id !== id) return;
//     this.element.getElementsByClassName("score")[0].innerText = score;
//   }
// }

let scores = [];

export const SCORE_TYPE = "_score";

const setScore = ({ id, value }) => {
  const { element } = scores.find((s) => s.id === id);
  element.getElementsByClassName("score")[0].innerText = value;
};

export const initialiseScore = async (score, bus) => {
  scores = [...scores, score];
  await subscribeToEventBus(bus, SET_SCORE, setScore);
};

export const newScore = ({ element, id }) => {
  if (typeof element.getElementsByClassName !== "function") {
    throw new Error("element must represent a DOM element");
  }

  return {
    _type: SCORE_TYPE,
    element,
    id,
  };
};
