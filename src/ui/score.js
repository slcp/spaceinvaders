import {BAD_SHIP_KILLED_BY_GOOD_BULLET, SET_SCORE} from "../events/events";

class Score {
    constructor({eventBus, element, id}) {
        this.eventBus = eventBus;
        this.element = element;
        this.id = id;
    }

    init() {
        this.eventBus.subscribe(SET_SCORE, this.setScore.bind(this))
        return this;
    }

    setScore({id, score}) {
        if (this.id !== id) return;
        this.element.getElementsByClassName("score")[0]
            .innerText = score;
    }
}

export default Score;
