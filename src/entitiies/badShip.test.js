import { newShape } from "../canvas/shape";
import * as eventBus from "../events";
import { BULLET_CREATED, BULLET_DESTROYED } from "../events/events";
import { initialiseBadShip, newBadShip } from "./badShip";
import { newBullet } from "./bullet";
import { newShip } from "./ship";

jest.mock("./ship", () => ({
  newShip: jest.fn(() => ({
    id: "an id",
    bullet: "",
    bulletInPlay: false,
    width: 80,
    height: 80,
  })),
}));

describe("Bad ship", () => {
  describe("newBadShip", () => {
    it("should create a new badShip object", () => {
      // Arrange
      const expected = {
        _type: "_badShip",
        shapes: [
          newShape(20, 32, 60, 9, "white"),
          newShape(40, 28, 20, 20, "white"),
          newShape(20, 20, 12, 20, "white"),
          newShape(68, 20, 12, 20, "white"),
        ],
        ...newShip(),
      };
      // Act
      const actual = newBadShip();

      // Assert
      expect(actual).toEqual(expected);
    });
  });
  describe("initaliseBadShip", () => {
    it("should subscribe to the relevant events", async () => {
      // Arrange
      const ship = newBadShip();
      const bus = eventBus.newEventBus();
      const subscribeSpy = jest.spyOn(eventBus, "subscribeToEventBus");

      // Act
      await initialiseBadShip(bus, ship);

      // Assert
      expect(subscribeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          events: expect.objectContaining({
            [BULLET_CREATED]: expect.arrayContaining([expect.any(Function)]),
          }),
        }),
        BULLET_CREATED,
        expect.any(Function)
      );
      expect(subscribeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          events: expect.objectContaining({
            [BULLET_DESTROYED]: expect.arrayContaining([expect.any(Function)]),
          }),
        }),
        BULLET_DESTROYED,
        expect.any(Function)
      );
    });
  });
  describe("subscription to BULLET_CREATED event", () => {
    it("should take ownership when a bullet is created", async () => {
      // Arrange
      const ship = newBadShip();
      ship.bullet = null;
      ship.bulletInPlay = false;
      const bullet = newBullet(ship._type, ship.id);
      const bus = eventBus.newEventBus();

      // Act
      await initialiseBadShip(bus, ship);
      await eventBus.publishToEventBus(bus, BULLET_CREATED, bullet);

      expect(ship.bulletInPlay).toEqual(true);
      expect(ship.bullet).toEqual(bullet);
    });
    it("should do nothing when a ownerTypes do not match", async () => {
      // Arrange
      const ship = newBadShip();
      ship.bullet = null;
      ship.bulletInPlay = false;
      const bullet = newBullet("ANOTHER_TYPE", ship.id);
      const bus = eventBus.newEventBus();

      // Act
      await initialiseBadShip(bus, ship);
      await eventBus.publishToEventBus(bus, BULLET_CREATED, bullet);

      expect(ship.bulletInPlay).toEqual(false);
      expect(ship.bullet).toEqual(null);
    });
    it("should do nothing when a ownerIds do not match", async () => {
      // Arrange
      const ship = newBadShip();
      ship.bullet = null;
      ship.bulletInPlay = false;
      const bullet = newBullet(ship._type, "another id");
      const bus = eventBus.newEventBus();

      // Act
      await initialiseBadShip(bus, ship);
      await eventBus.publishToEventBus(bus, BULLET_CREATED, bullet);

      expect(ship.bulletInPlay).toEqual(false);
      expect(ship.bullet).toEqual(null);
    });
  });
  describe("subscription to BULLET_DESTROYED event", () => {
    it("should take ownership when a bullet is destroyed", async () => {
      // Arrange
      const ship = newBadShip();
      const bullet = newBullet(ship._type, ship.id);
      ship.bullet = bullet;
      ship.bulletInPlay = true;
      const bus = eventBus.newEventBus();

      // Act
      await initialiseBadShip(bus, ship);
      await eventBus.publishToEventBus(bus, BULLET_DESTROYED, bullet);

      expect(ship.bulletInPlay).toEqual(false);
      expect(ship.bullet).toEqual(null);
    });
    it("should do nothing when ownerTypes do not match", async () => {
      // Arrange
      const ship = newBadShip();
      const bullet = newBullet("ANOTHER_TYPE", ship.id);
      ship.bullet = bullet;
      ship.bulletInPlay = true;
      const bus = eventBus.newEventBus();

      // Act
      await initialiseBadShip(bus, ship);
      await eventBus.publishToEventBus(bus, BULLET_DESTROYED, bullet);

      expect(ship.bulletInPlay).toEqual(true);
      expect(ship.bullet).toEqual(bullet);
    });
    it("should do nothing when a ownerIds do not match", async () => {
      // Arrange
      const ship = newBadShip();
      const bullet = newBullet(ship._type, "another id");
      ship.bullet = bullet;
      ship.bulletInPlay = true;
      const bus = eventBus.newEventBus();

      // Act
      await initialiseBadShip(bus, ship);
      await eventBus.publishToEventBus(bus, BULLET_DESTROYED, bullet);

      expect(ship.bulletInPlay).toEqual(true);
      expect(ship.bullet).toEqual(bullet);
    });
  });
});
