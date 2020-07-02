const EventBus = require("./src/game/events");

const bus = new EventBus()
bus.subscribe("test", (...args) => {
        setTimeout(() => {
            console.log('long wait', args);
        }, 5000)
    }
)
bus.subscribe("test", (...args) => {
        setTimeout(() => {
            console.log('longer wait', args);
        }, 7000)

    }
)
bus.publish("test", 1, 2, 3, 4)
