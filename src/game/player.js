import {BAD_SHIP_KILLED_BY_GOOD_BULLET} from "../events/events";

class Player {
    constructor(context) {
        this.id = Symbol();
        this.context = context
        this.score = 0;
    }
    init() {
        const {eventBus} = this.context;
        eventBus.subscribe(BAD_SHIP_KILLED_BY_GOOD_BULLET, function({id}) {
            if (id !== this.id) return;
            console.log("player recognised event")
        }.bind(this))
    };
}

/*
 * Plan:
 * Create a player for each player - Done
 * Inject player ids into the game - Done
 * Game maps the player ids and assigns them to goodShips - Done
 * Score(Managers?) are also created by mapping the plaer ids (outside of the gmae)
 * Events that concern a goodShip pass the player id as an arg - Done
 * Both Score(Managers?) and Player subscribe to events to maintain internal state/update the UI - Players Done
 * Result:
 * Score UI/Player data/Game run are decoupled but can communicate about players
 */

export default Player;
