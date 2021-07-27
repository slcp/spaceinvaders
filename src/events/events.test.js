import EventBus from "./";

describe('Event Bus', ({callbacksCount = 1, eventsCount = 1} = {}) => {
    const makeContext = () => ({
        eventBus: new EventBus(),
        callbacks: Array.from(new Array(callbacksCount), () => jest.fn()),
        events: Array.from(new Array(eventsCount), (_, i) => `event${i}`),
    })
    it('should call subscribed callback when an event is published', () => {
        // Arrange
        const {eventBus, callbacks, events} = makeContext();
        const [callback1] = callbacks;
        const [event1] = events;

        // Act
        eventBus.subscribe(event1, callback1)
        eventBus.publish(event1)

        // Assert
        expect(callback1).toHaveBeenCalledTimes(1);
    })
    it('should call subscribed callback with args when an event is published with args', () => {
        // Arrange
        const {eventBus, callbacks, events} = makeContext();
        const [callback1] = callbacks;
        const [event1] = events;

        // Act
        eventBus.subscribe(event1, callback1)
        eventBus.publish(event1, "arg1", "arg2");

        // Assert

        expect(callback1).toHaveBeenCalledWith("arg1", "arg2");
    })
    it('should not call subscribed callback when another event is published', () => {
        // Arrange
        const {eventBus, callbacks, events} = makeContext({ eventsCount: 2});
        const [callback1] = callbacks;
        const [event1, event2] = events;

        // Act
        eventBus.subscribe(event1, callback1)
        eventBus.publish(event2);

        // Assert

        expect(callback1).not.toHaveBeenCalled();
    })
})
