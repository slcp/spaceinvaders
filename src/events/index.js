// class EventBus {
//   constructor() {
//     this.events = {};
//   }

//   async subscribe(event, callback) {
//     return new Promise(
//       function (res) {
//         this.events[event] = this.events[event] || [];
//         this.events[event].push(callback);
//         res();
//       }.bind(this)
//     );
//   }

//   async publish(event, ...args) {
//     // console.log(`published: ${event}`);
//     if (!this.events[event]) return;
//     await Promise.all(
//       this.events[event].map(async (cb) => {
//         await cb(...args);
//       })
//     );
//   }
// }

export const EVENT_BUS_TYPE = "_eventBus";

export const subscribeToEventBus = async (bus, event, callback) =>
  new Promise(function (res) {
    bus.events[event] = bus.events[event] || [];
    bus.events[event].push(callback);
    res();
  });

export const publishToEventBus = async (bus, event, ...args) => {
  if (!bus.events[event]) return;
  await Promise.all(
    bus.events[event].map(async (cb) => {
      await cb(...args);
    })
  );
};

export const newEventBus = () => ({
  events: {},
});
