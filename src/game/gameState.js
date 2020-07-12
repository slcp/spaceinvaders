import {BAD_SHIP_KILLED_BY_GOOD_BULLET, GAME_LOST, GOOD_SHIP_KILLED_BY_BAD_BULLET, LEVEL_OVER} from "../events/events";

class GameState {
    constructor({eventBus}) {
        this.eventBus = eventBus;
        this.badShips = null;
        this.playerLives = null;
    }

    init() {
        this.eventBus.subscribe(GOOD_SHIP_KILLED_BY_BAD_BULLET, this.playerKilled.bind(this))
        this.eventBus.subscribe(BAD_SHIP_KILLED_BY_GOOD_BULLET, this.badShipKilled.bind(this))
    }

    badShipKilled({remainingShipCount}) {
        if (remainingShipCount === undefined) {
            throw("need some data with this event!")
        }
        this.badShips = remainingShipCount;
        this.checkGameState();
    }

    playerKilled({remainingLives}) {
        if (remainingLives === undefined) {
            throw("need some data with this event!")
        }
        this.playerLives = remainingLives;
        this.checkGameState();
    }

    checkGameState() {
        if (this.badShips === 0) {
            this.eventBus.publish(LEVEL_OVER)
        }
        if (this.playerLives === 0) {
            this.eventBus.publish(GAME_LOST)
        }
    }
}

export default GameState;
