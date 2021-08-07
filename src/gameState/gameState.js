import {
    BAD_SHIP_KILLED_BY_GOOD_BULLET,
    END_GAME,
    NEW_GAME, PLAYER_LOST_LIFE, SET_MESSAGE, START_NEXT_LEVEL
} from "../events/events";

class GameState {
    constructor({ eventBus }) {
        this.eventBus = eventBus;
        this.badShips = null;
        this.playerLives = null;
    }

    init() {
        this.eventBus.subscribe(PLAYER_LOST_LIFE, this.playerKilled.bind(this))
        this.eventBus.subscribe(BAD_SHIP_KILLED_BY_GOOD_BULLET, this.badShipKilled.bind(this))
        this.eventBus.subscribe(NEW_GAME, this.newGame.bind(this))
    }

    badShipKilled({ remainingShipCount, id }) {
        if (remainingShipCount === undefined) {
            throw ("need some data with this event!")
        }
        this.badShips = remainingShipCount;
        this.checkGameState();
    }

    playerKilled({ remainingLives }) {
        if (remainingLives === undefined) {
            throw ("need some data with this event!")
        }
        this.playerLives = remainingLives;
        this.checkGameState();
    }

    checkGameState() {
        if (this.badShips === 0) {
            this.eventBus.publish(START_NEXT_LEVEL)
            this.eventBus.publish(SET_MESSAGE, { message: "Next level" })
        }
        if (this.playerLives === 0) {
            this.eventBus.publish(END_GAME)
            this.eventBus.publish(SET_MESSAGE, { message: "Game over", persist: true })
        }
    }

    newGame() {
        this.eventBus.publish(SET_MESSAGE, { message: "New game -  enjoy!!" })
    }
}

export default GameState;
