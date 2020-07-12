import {BAD_SHIP_KILLED_BY_GOOD_BULLET} from "../events/events";

class Score {
    constructor({eventBus, element, id}) {
        this.eventBus = eventBus;
        this.element = element;
        this.id = id;
    }

    init() {
        this.eventBus.subscribe(BAD_SHIP_KILLED_BY_GOOD_BULLET, function ({id}) {
            if (this.id !== id) return;
            this.setScore(10)
        }.bind(this))
        return this;
    }

    setScore(delta) {
        this.element.getElementsByClassName("score")[0]
            .innerText = parseInt(this.element.innerText, 10) + delta;
    }
}

export default Score;
