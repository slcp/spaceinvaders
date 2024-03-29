import {
    ADD_LIFE,
    BAD_SHIP_KILLED_BY_GOOD_BULLET,
    GOOD_SHIP_KILLED_BY_BAD_BULLET, LOSE_LIFE,
    PLAYER_LOST_LIFE, RESPAWN_GOOD_SHIP,
    SET_SCORE
} from "../events/events";

class Player {
    constructor(context) {
        this.id = Symbol();
        this.context = context
        this._score = 0;
        this.lives = 3;
    }

    init() {
        const {eventBus} = this.context;
        eventBus.subscribe(GOOD_SHIP_KILLED_BY_BAD_BULLET, this.playerKilled.bind(this))
        eventBus.subscribe(BAD_SHIP_KILLED_BY_GOOD_BULLET, this.badShipSkilled.bind(this))
    };

    playerKilled({id}) {
        const {eventBus} = this.context;
        if (id !== this.id) return;
        this.lives = this.lives - 1;
        eventBus.publish(PLAYER_LOST_LIFE, {id: this.id, remainingLives: this.lives})
        eventBus.publish(LOSE_LIFE, {id});
        if (this.lives) {
            eventBus.publish(RESPAWN_GOOD_SHIP, {id: this.id})
        }
    }

    badShipSkilled({id}) {
        if (id !== this.id) return;
        this.score = this.score + 10;
    }

    set score(value) {
        this._score = value;
        const {eventBus} = this.context;
        eventBus.publish(SET_SCORE, {id: this.id, score: this.score})
    }

    get score() {
        return this._score;
    }
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
