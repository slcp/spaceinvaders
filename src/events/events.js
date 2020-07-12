class EventBus {
    constructor() {
        this.events = {}
    }

    async subscribe(event, callback) {
        return new Promise(function (res) {
            this.events[event] = this.events[event] || []
            this.events[event].push(callback)
            res()
        }.bind(this))
    }

    async publish(event, ...args) {
        // console.log(`published: ${event}`);
        if (!this.events[event]) return;
        await Promise.all(this.events[event].map(async (cb) => {
            await cb(...args);
        }));
    }
}

export const INITIALISE_GAME = "INITIALISE_GAME";
export const CANVAS_DRAW = "CANVAS_DRAW";
export const CANVAS_REMOVE = "CANVAS_REMOVE";
export const NEW_GAME = "NEW_GAME";
export const END_GAME = "END_GAME";
export const BAD_SHIP_KILLED_BY_GOOD_BULLET = "BAD_SHIP_KILLED_BY_GOOD_BULLET";
export const GOOD_SHIP_KILLED_BY_BAD_BULLET = "GOOD_SHIP_KILLED_BY_BAD_BULLET";
export const ROCK_SLICE_KILLED_BY_GOOD_BULLET = "ROCK_SLICE_KILLED_BY_GOOD_BULLET";
export const ROCK_SLICE_KILLED_BY_BAD_BULLET = "ROCK_SLICE_KILLED_BY_BAD_BULLET";
export const GOOD_SHIP_OUT_OF_LIVES = "GOOD_SHIP_OUT_OF_LIVES";
export const ROCK_KILLED_BY_GOOD_BULLET = "ROCK_KILLED_BY_GOOD_BULLET";
export const ROCK_KILLED_BY_BAD_BULLET = "ROCK_KILLED_BY_BAD_BULLET";
export const LEVEL_OVER = "LEVEL_OVER";
export const GAME_LOST = "GAME_LOST";
export const START_NEXT_LEVEL = "START_NEXT_LEVEL";

export default EventBus;
