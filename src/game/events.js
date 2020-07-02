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
        if (!this.events[event]) return;
        this.events[event].forEach((cb) => new Promise((res, rej) => {
                const x = cb(...args);
                if (!x instanceof Promise) {
                    res()
                }
                if (x instanceof Promise) {
                    x.then(() => {

                        res()
                    }).catch((e) => {
                        rej(e)
                    });
                }
            }
        ));
    }
}

module.exports = EventBus;
