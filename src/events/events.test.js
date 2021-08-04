import { newEventBus, publishToEventBus, subscribeToEventBus } from "./";

describe("Event Bus", () => {
  const makeContext = ({ callbacksCount, eventsCount }) => ({
    bus: newEventBus(),
    callbacks: Array.from(new Array(callbacksCount), () => jest.fn()),
    events: Array.from(new Array(eventsCount), (_, i) => `event${i}`),
  });
  describe("newEventBus", () => {
    it("should create a new event bus", () => {
      // Arrange
      const expected = { events: {}, _type: "_eventBus" };

      // Act
      const actual = newEventBus();

      // Assert
      expect(actual).toEqual(expected);
    });
  });
  describe("subscribeToEventBus", () => {
    it("should register callback with an event when there is a single callback", async () => {
      // Arrange
      const { bus, callbacks } = makeContext({ callbacksCount: 1 });
      const [callback] = callbacks;
      // Act
      await subscribeToEventBus(bus, "TEST_EVENT", callback);

      // Assert
      expect(bus.events.TEST_EVENT).toHaveLength(1);
      expect(bus.events.TEST_EVENT[0]).toEqual(expect.any(Function));
      bus.events.TEST_EVENT[0]();
      expect(callback).toHaveBeenCalled();
    });
    it("should register callback with an event when there is a more than one callback", async () => {
      // Arrange
      const { bus, callbacks } = makeContext({ callbacksCount: 2 });
      const [callback, callback2] = callbacks;

      // Act
      await subscribeToEventBus(bus, "TEST_EVENT", callback);
      await subscribeToEventBus(bus, "TEST_EVENT", callback2);

      // Assert
      expect(bus.events.TEST_EVENT).toHaveLength(2);
      expect(bus.events.TEST_EVENT[0]).toEqual(expect.any(Function));
      bus.events.TEST_EVENT.map((fn) => fn());
      expect(callback).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });
  describe("publishToEventBus", () => {
    it("should call all callbacks registered against an event", async () => {
      // Arrange
      const { bus, callbacks } = makeContext({ callbacksCount: 2 });
      const [callback, callback2] = callbacks;
      bus.events.TEST_EVENT = [callback, callback2];

      // Act
      await publishToEventBus(bus, "TEST_EVENT");

      // Assert
      expect(callback).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
    [1, 5].forEach((eventsCount) => {
      it(`should call all callbacks registered against an event with ${eventsCount} args`, async () => {
        // Arrange
        const { bus, callbacks, events } = makeContext({
          callbacksCount: 2,
          eventsCount,
        });
        const [callback, callback2] = callbacks;
        bus.events.TEST_EVENT = [callback, callback2];

        // Act
        await publishToEventBus(bus, "TEST_EVENT", ...events);

        // Assert
        expect(callback).toHaveBeenCalledWith(...events);
        expect(callback2).toHaveBeenCalledWith(...events);
      });
    });
  });
});
