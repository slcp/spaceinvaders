import {CLEAR_MESSAGE, SET_MESSAGE} from "../events/events";

class GameMessage {
    constructor({eventBus, element}) {
        this.eventBus = eventBus;
        this.element = element;
    }

    init() {
        this.eventBus.subscribe(SET_MESSAGE, this.setMessage.bind(this))
        this.eventBus.subscribe(CLEAR_MESSAGE, this.clearMessage.bind(this))
        return this;
    }

    setMessage({message}) {
        this.element.innerText = message;
        setTimeout(function() {
            this.eventBus.publish(CLEAR_MESSAGE)
        }.bind(this), 2000)
    }

    clearMessage() {
        this.element.innerText = '';
    }
}

export default GameMessage
