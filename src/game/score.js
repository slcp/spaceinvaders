import {BAD_SHIP_KILLED_BY_GOOD_BULLET} from "../events/events";

class Score {
    constructor(eventBus, element) {
        this.eventBus = eventBus
        this.element = element
    }

    init() {
        this.eventBus.subscribe(BAD_SHIP_KILLED_BY_GOOD_BULLET, function() {
            this.setScore(10)
        }.bind(this))
    }

    setScore(delta) {
        this.element.innerText = parseInt(this.element.innerText,10) + delta;
    }
}

export default Score;
