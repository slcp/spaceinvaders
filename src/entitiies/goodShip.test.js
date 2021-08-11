import * as animation from "../animation/animationFrame";
import { newShape } from "../canvas/shape";
import * as eventBus from "../events";
import { newEventBus } from "../events";
import { BULLET_CREATED, CANVAS_DRAW } from "../events/events";
import * as bullet from "./bullet";
import { initialiseGoodShip, moveShip, newGoodShip } from "./goodShip";
import { newShip } from "./ship";

jest.mock("uuid", () => ({
  v4: jest.fn(() => {
    const value = "uuid";
    return value;
  }),
}));

jest.mock("./ship", () => ({
  newShip: jest.fn(() => ({
    id: "not an id",
    bullet: "",
    bulletInPlay: false,
    width: 80,
    height: 80,
  })),
}));

describe("Good ship", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("newGoodShip", () => {
    it("should create a new goodShip object", () => {
      // Arrange
      const expected = {
        ...newShip(),
        _type: "_goodShip",
        id: "an id",
        lives: 3,
        keys: [],
        shapes: [
          newShape(20, 40, 60, 20, "#21c521"),
          newShape(40, 20, 20, 20, "#21c521"),
          newShape(20, 55, 20, 20, "#21c521"),
          newShape(60, 55, 20, 20, "#21c521"),
        ],
        shootTrigger: "Space",
      };

      // Act
      const actual = newGoodShip("an id");

      // Assert
      expect(actual).toEqual(expected);
    });
  });
  describe("initaliseGoodShip", () => {
    let handlers = [];
    let ship = null;
    it("should addEventListeners for game keys and set up animation frames", async () => {
      // Arrange
      ship = newGoodShip("an id");
      const bus = newEventBus();
      window.addEventListener = jest.fn((option, handler) => {
        handlers = [...handlers, handler];
      });
      const initialiseAnimationSpy = jest.spyOn(
        animation,
        "initialiseAnimationFrame"
      );
      const subscribeSpy = jest.spyOn(eventBus, "subscribeToEventBus");
      const expectedFireBulletAnimationFrame = {
        _type: "_animationFrame",
        id: "uuid",
        ms: 800,
        action: expect.any(Function),
      };
      const expectedMoveShipAnimationFrame = {
        _type: "_animationFrame",
        id: "uuid",
        ms: 0,
        action: expect.any(Function),
      };

      // Act
      await initialiseGoodShip(bus, ship);

      // Assert
      expect(window.addEventListener).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );
      expect(window.addEventListener).toHaveBeenCalledWith(
        "keyup",
        expect.any(Function)
      );
      expect(handlers).toHaveLength(2);
      expect(initialiseAnimationSpy).toHaveBeenCalledWith(
        expectedMoveShipAnimationFrame
      );
      expect(initialiseAnimationSpy).toHaveBeenCalledWith(
        expectedFireBulletAnimationFrame
      );
      expect(subscribeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          events: expect.objectContaining({
            [BULLET_CREATED]: expect.arrayContaining([expect.any(Function)]),
          }),
        }),
        BULLET_CREATED,
        expect.any(Function)
      );
    });
    [
      { type: "keyup", code: "Space" },
      { type: "keyup", code: "ArrowLeft" },
      { type: "keyup", code: "ArrowRight" },
    ].forEach(({ type, code }) => {
      it(`should set keys[${code}] to false on ${type}`, () => {
        // Arrange
        // Ship used is created in previous test as it gets closured over when setting listeners in initialise
        const event = {
          type,
          code,
          preventDefault: jest.fn(),
        };

        // Act
        handlers.forEach((h) => h(event, ship));

        // Assert
        expect(event.preventDefault).toHaveBeenCalledTimes(2);
        expect(ship.keys[code]).toEqual(false);
      });
    });
    [
      { type: "keydown", code: "ArrowLeft" },
      { type: "keydown", code: "ArrowRight" },
    ].forEach(({ type, code }) => {
      it(`should set keys[${code}] to false on ${type} when ship.direction is falsey`, () => {
        // Arrange
        ship.direction = false;
        const event = {
          type,
          code,
          preventDefault: jest.fn(),
        };

        // Act
        handlers.forEach((h) => h(event, ship));

        // Assert
        expect(event.preventDefault).toHaveBeenCalledTimes(2);
        expect(ship.keys[code]).toEqual(true);
      });
      it(`should not set keys[${code}] on ${type} when ship.direction is truthy`, () => {
        // Arrange
        ship.direction = true;
        ship.keys[code] = "static";
        const event = {
          type,
          code,
          preventDefault: jest.fn(),
        };

        // Act
        handlers.forEach((h) => h(event, ship));

        // Assert
        expect(event.preventDefault).toHaveBeenCalledTimes(2);
        expect(ship.keys[code]).toEqual("static");
      });
    });
    [{ type: "keydown", code: "Space" }].forEach(({ type, code }) => {
      it(`should set keys['Space'] to true`, () => {
        // Arrange
        ship.keys["Space"] = "not a boolean true";
        const event = {
          type,
          code,
          preventDefault: jest.fn(),
        };

        // Act
        handlers.forEach((h) => h(event, ship));

        // Assert
        expect(event.preventDefault).toHaveBeenCalledTimes(2);
        expect(ship.keys["Space"]).toEqual(true);
      });
      it("should fire bullet if possible if keys['Space'] is set to false", () => {
        // Arrange
        ship.keys["Space"] = false;
        jest.spyOn(bullet, "fireBullet").mockReturnValue(null);
        const event = {
          type,
          code,
          preventDefault: jest.fn(),
        };

        // Act
        handlers.forEach((h) => h(event, ship));

        // Assert
        expect(event.preventDefault).toHaveBeenCalledTimes(2);
        expect(ship.keys["Space"]).toEqual(true);
        expect(bullet.fireBullet).toHaveBeenCalledWith(
          expect.objectContaining({ _type: "_eventBus" }),
          ship
        );
      });
    });
    [
      {
        type: "unknownevent",
        code: "Space",
        error: "No handler know for key code: Space",
      },
      {
        type: "keydown",
        code: "unknowncode",
        error: "No handler know for key code: unknowncode",
      },
    ].forEach(({ type, code, error }) => {
      it(`should throw when with code: ${code} and type: ${type} as one is not known`, () => {
        // Arrange
        ship.direction = false;
        const event = {
          type,
          code,
          preventDefault: jest.fn(),
        };

        // Act
        // Assert
        expect(() => handlers.forEach((h) => h(event, ship))).toThrow(error);
      });
    });
  });
  describe("Subscription to CREATE_BULLET event", () => {
    it("should do take ownership of bullet in response to CREATE_BULLET event, when ids match", async () => {
      // Arrange
      const ship = newGoodShip("an id");
      ship.bulletInPlay = false;
      ship.bullet = undefined;
      const bus = newEventBus();
      const b = bullet.newBullet(ship._type, ship.id);

      // Act
      await initialiseGoodShip(bus, ship);
      await eventBus.publishToEventBus(bus, BULLET_CREATED, b);

      // Assert
      expect(ship.bulletInPlay).toEqual(true);
      expect(ship.bullet).toEqual(b);
    });
    it("should do nothing in response to CREATE_BULLET event when ids don't match", async () => {
      // Arrange
      const ship = newGoodShip("an id");
      ship.bulletInPlay = false;
      ship.bullet = undefined;
      const bus = newEventBus();
      const b = bullet.newBullet(ship._type, "another id");

      // Act
      await initialiseGoodShip(bus, ship);
      await eventBus.publishToEventBus(bus, BULLET_CREATED, b);

      // Assert
      expect(ship.bulletInPlay).toEqual(false);
      expect(ship.bullet).toBeUndefined();
    });
    it("should do nothing in response to CREATE_BULLET event when types don't match", async () => {
      // Arrange
      const ship = newGoodShip("an id");
      ship.bulletInPlay = false;
      ship.bullet = undefined;
      const bus = newEventBus();
      const b = bullet.newBullet("ANOTHER_TYPE", ship.id);

      // Act
      await initialiseGoodShip(bus, ship);
      await eventBus.publishToEventBus(bus, BULLET_CREATED, b);

      // Assert
      expect(ship.bulletInPlay).toEqual(false);
      expect(ship.bullet).toBeUndefined();
    });
  });
  describe("moveShip", () => {
    it("should update the x,y values of the ship and publish an event when keys['RIGHT'] is true", async () => {
      // Arrange
      const ship = newGoodShip("an id");
      ship.keys["RIGHT"] = true;
      ship.shapes = [{ x: 2, y: 4 }];
      const bus = newEventBus();
      const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

      // Act
      await moveShip(bus, ship);

      // Assert
      expect(ship.shapes[0]).toEqual(
        expect.objectContaining({
          x: 4, // +2
          y: 4, // +0
          oldX: 2,
          oldY: 4,
        })
      );
      expect(publishSpy).toHaveBeenCalledWith(bus, CANVAS_DRAW, [
        expect.objectContaining({
          x: 4, // +2
          y: 4, // +0
          oldX: 2,
          oldY: 4,
        }),
      ]);
    });
    it("should update the x,y values of the ship and publish an event when keys['LEFT'] is true", async () => {
      // Arrange
      const ship = newGoodShip("an id");
      ship.keys["LEFT"] = true;
      ship.shapes = [{ x: 2, y: 4 }];
      const bus = newEventBus();
      const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

      // Act
      await moveShip(bus, ship);

      // Assert
      expect(ship.shapes[0]).toEqual(
        expect.objectContaining({
          x: 0, // -2
          y: 4, // +0
          oldX: 2,
          oldY: 4,
        })
      );
      expect(publishSpy).toHaveBeenCalledWith(bus, CANVAS_DRAW, [
        expect.objectContaining({
          x: 0,
          y: 4,
          oldX: 2,
          oldY: 4,
        }),
      ]);
    });
    it("should do nothing when neither keys['LEFT'] or keys['RIGHT'] is true", async () => {
      // Arrange
      const ship = newGoodShip("an id");
      ship.keys["LEFT"] = false;
      ship.keys["RIGHT"] = false;
      ship.shapes = [{ x: 2, y: 4 }];
      const bus = newEventBus();
      const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

      // Act
      await moveShip(bus, ship);

      // Assert
      expect(ship.shapes[0]).toEqual(
        expect.objectContaining({
          x: 2, // no change
          y: 4, // no change
        })
      );
      expect(publishSpy).not.toHaveBeenCalled();
    });
  });
});
