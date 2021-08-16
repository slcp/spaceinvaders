import { publishToEventBus, subscribeToEventBus } from "../events";
import { CLEAR_MESSAGE, SET_MESSAGE } from "../events/events";

class GameMessage {
  constructor({ eventBus, element }) {
    this.eventBus = eventBus;
    this.element = element;
  }

  init() {
    subscribeToEventBus(this.eventBus, SET_MESSAGE, this.setMessage.bind(this));
    subscribeToEventBus(
      this.eventBus,
      CLEAR_MESSAGE,
      this.clearMessage.bind(this)
    );
    return this;
  }

  setMessage({ message, persist }) {
    this.element.innerText = message;
    if (persist) return;
    setTimeout(
      function () {
        publishToEventBus(this.eventBus, CLEAR_MESSAGE);
      }.bind(this),
      2000
    );
  }

  clearMessage() {
    this.element.innerText = "";
  }
}

export default GameMessage;
