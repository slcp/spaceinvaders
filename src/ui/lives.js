import {ADD_LIFE, LOSE_LIFE} from "../events/events";
import {makeLifeRepresentation} from "./ui";

class Lives {
    constructor({eventBus, element, id}) {
        this.eventBus = eventBus;
        this.element = element;
        this.id = id;
    }

    init() {
        this.eventBus.subscribe(ADD_LIFE, this.addLife.bind(this))
        this.eventBus.subscribe(LOSE_LIFE, this.loseLife.bind(this))
        return this;
    }

    addLife({id}) {
        if (this.id !== id) return;
        const index = parseInt(this.element.lastChild.id.split('-')[1], 10) + 1;
        console.log(index);
        this.element.appendChild(makeLifeRepresentation(index))

    }

    loseLife({id}) {
        if (this.id !== id) return;
        this.element.removeChild(this.element.lastChild)
    }
}

export default Lives;
