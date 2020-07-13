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

export default EventBus;

