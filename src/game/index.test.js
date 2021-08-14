import * as gameExports from ".";
import * as eventBus from "../events";
import { newEventBus } from "../events";
import { runFrame } from "../animation";
import {
  BAD_SHIP_CREATED,
  BAD_SHIP_DESTROYED,
  BULLET_CREATED,
  BULLET_DESTROYED,
  CANVAS_DRAW,
  CANVAS_REMOVE,
  END_GAME,
  GOOD_SHIP_DESTROYED,
  NEW_GAME,
  START_NEXT_LEVEL,
} from "../events/events";
import { fireBullet, newBullet } from "../entitiies/bullet";
import { newGoodShip, SHIP_TYPE } from "../entitiies/goodShip";
import { newShape } from "../canvas/shape";
import { isAtExtremity } from "../canvas";
import { BAD_SHIP_TYPE, newBadShip } from "../entitiies/badShip";
import * as draw from "../functional/drawObject";
import { newRock } from "../entitiies/rock";

jest.mock("../canvas", () => ({
  isAtExtremity: jest.fn().mockReturnValue({}),
}));

jest.mock("../animation", () => ({
  runFrame: jest.fn(),
}));

jest.mock("../entitiies/bullet", () => ({
  ...jest.requireActual("../entitiies/bullet"),
  fireBullet: jest.fn(),
}));

describe("Game", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("newGame", () => {
    it("should create a new Games object", () => {
      // Arrange
      const expected = {
        badShips: [],
        bullets: [],
        goodShips: [],
        level: {},
        rocks: [],
        currentLevelMode: "standard",
      };

      // Act
      const actual = gameExports.newGame();

      // Assert
      expect(actual).toEqual(expected);
    });
  });
  describe("initaliseGame", () => {
    it("should do subscribe to the correct events and set up animation frames", async () => {
      // Arrange
      const bus = newEventBus();
      const game = gameExports.newGame();
      game.level = {
        standard: {
          game: {
            goodBulletFramerate: 1,
            badShipsBulletsPerSecond: 2,
            badBulletFramerate: 3,
            badShipFramerate: 4,
          },
        },
      };
      window.addEventListener = jest.fn((option, handler) => {
        handlers = [...handlers, handler];
      });
      const subscribeSpy = jest.spyOn(eventBus, "subscribeToEventBus");
      const expectedMoveGoodBulletsAnimationFrame = {
        _type: "_animationFrame",
        id: "moveGoodBullets",
        ms: 1000 / game.level.standard.game.goodBulletFramerate,
        action: expect.any(Function),
      };
      const expectedMoveBadBulletsAnimationFrame = {
        _type: "_animationFrame",
        id: "moveBadBullets",
        ms: 1000 / game.level.standard.game.badBulletFramerate,
        action: expect.any(Function),
      };
      const expectedShootBadBulletsAnimationFrame = {
        _type: "_animationFrame",
        id: "shootBadBullets",
        ms: 1000 / game.level.standard.game.badShipsBulletsPerSecond,
        action: expect.any(Function),
      };
      const expectedCheckForCollisionsAnimationFrame = {
        _type: "_animationFrame",
        id: "checkForCollisions",
        ms: 0,
        action: expect.any(Function),
      };
      // Act
      await gameExports.initialiseGame(bus, game, {});

      // Assert
      expect(runFrame).toHaveBeenCalledWith(
        expect.arrayContaining([
          expectedMoveGoodBulletsAnimationFrame,
          expectedMoveBadBulletsAnimationFrame,
          expectedShootBadBulletsAnimationFrame,
          expectedCheckForCollisionsAnimationFrame,
        ])
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
      expect(subscribeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          events: expect.objectContaining({
            [BAD_SHIP_CREATED]: expect.arrayContaining([expect.any(Function)]),
          }),
        }),
        BAD_SHIP_CREATED,
        expect.any(Function)
      );
      expect(subscribeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          events: expect.objectContaining({
            [NEW_GAME]: expect.arrayContaining([expect.any(Function)]),
          }),
        }),
        NEW_GAME,
        expect.any(Function)
      );
      expect(subscribeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          events: expect.objectContaining({
            [START_NEXT_LEVEL]: expect.arrayContaining([expect.any(Function)]),
          }),
        }),
        START_NEXT_LEVEL,
        expect.any(Function)
      );
      expect(subscribeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          events: expect.objectContaining({
            [END_GAME]: expect.arrayContaining([expect.any(Function)]),
          }),
        }),
        END_GAME,
        expect.any(Function)
      );
    });
  });
  describe("Event subscriptions", () => {
    it("should add bullet to game when responding to BULLET_CREATED event", async () => {
      // Arrange
      const bus = newEventBus();
      const game = gameExports.newGame();
      const bullet = newBullet("OWNER_TYPE", "OWNER_ID");
      game.bullets = [
        newBullet("OWNER_TYPE", "OWNER_ID"),
        newBullet("OWNER_TYPE", "OWNER_ID"),
      ];
      game.level = {
        standard: {
          game: {
            goodBulletFramerate: 1,
            badShipsBulletsPerSecond: 2,
            badBulletFramerate: 3,
            badShipFramerate: 4,
          },
        },
      };

      // Act
      await gameExports.initialiseGame(bus, game, {});
      await eventBus.publishToEventBus(bus, BULLET_CREATED, bullet);

      // Assert
      expect(game.bullets).toContain(bullet);
    });
    it("should add ship to game when responding to BAD_SHIP_CREATED event", async () => {
      // Arrange
      const bus = newEventBus();
      const game = gameExports.newGame();
      const ship = newBadShip();
      game.bullets = [newBadShip(), newBadShip()];
      game.level = {
        standard: {
          game: {
            goodBulletFramerate: 1,
            badShipsBulletsPerSecond: 2,
            badBulletFramerate: 3,
            badShipFramerate: 4,
          },
        },
      };

      // Act
      await gameExports.initialiseGame(bus, game, {});
      await eventBus.publishToEventBus(bus, BAD_SHIP_CREATED, ship);

      // Assert
      expect(game.badShips).toContain(ship);
    });
  });
  describe("moveBullets", () => {
    ["TYPE_ONE", "TYPE_TWO"].forEach((type) => {
      it(`should call the expected handler with type: ${type}`, () => {
        // Arrange
        const bus = newEventBus();
        const game = gameExports.newGame();
        const handlers = {
          TYPE_ONE: jest.fn(),
          TYPE_TWO: jest.fn(),
        };

        // Act
        gameExports.moveBullets(bus, game, type, handlers);

        // Assert
        expect(handlers[type]).toHaveBeenCalledWith(bus, game);
      });
    });
    it("should throw when the handler type is not known", () => {
      // Arrange
      const bus = newEventBus();
      const game = gameExports.newGame();
      const handlers = {
        TYPE_ONE: jest.fn(),
      };

      // Act
      // Assert
      expect(() =>
        gameExports.moveBullets(bus, game, "UNKOWN_TYPE", handlers)
      ).toThrow("unknon ship type when trying to move bullets");
    });
    it("should move the expected bullets only when asked to move _goodShip bullets", () => {
      // Arrange
      let id = 1;
      const goodShipBullet = () => {
        const bullet = newBullet(SHIP_TYPE, id);
        bullet.shapes = [newShape(5, 10, 10, 10, "blue")];
        id = id + 1;
        return bullet;
      };
      const badShipBullet = () => {
        const bullet = newBullet(BAD_SHIP_TYPE, id);
        bullet.shapes = [newShape(3, 13, 10, 10, "blue")];
        id = id + 1;
        return bullet;
      };
      const bus = newEventBus();
      const game = gameExports.newGame();
      game.bullets = [
        goodShipBullet(),
        badShipBullet(),
        goodShipBullet(),
        badShipBullet(),
      ];

      // Act
      gameExports.moveBullets(bus, game, SHIP_TYPE);

      // Assert
      expect(game.bullets[0].shapes[0]).toEqual({
        _type: "_shape",
        color: "blue",
        height: 10,
        oldX: 5,
        oldY: 10,
        width: 10,
        x: 5,
        y: 5,
      });
      expect(game.bullets[2].shapes[0]).toEqual({
        _type: "_shape",
        color: "blue",
        height: 10,
        oldX: 5,
        oldY: 10,
        width: 10,
        x: 5,
        y: 5,
      });
      expect(game.bullets[1].shapes[0]).toEqual({
        _type: "_shape",
        color: "blue",
        height: 10,
        width: 10,
        x: 3,
        y: 13,
      });
      expect(game.bullets[3].shapes[0]).toEqual({
        _type: "_shape",
        color: "blue",
        height: 10,
        width: 10,
        x: 3,
        y: 13,
      });
    });
    it("should move the expected bullets only when asked to move _badShip bullets", () => {
      // Arrange
      let id = 1;
      const goodShipBullet = () => {
        const bullet = newBullet(SHIP_TYPE, id);
        bullet.shapes = [newShape(5, 10, 10, 10, "blue")];
        id = id + 1;
        return bullet;
      };
      const badShipBullet = () => {
        const bullet = newBullet(BAD_SHIP_TYPE, id);
        bullet.shapes = [newShape(3, 13, 10, 10, "blue")];
        id = id + 1;
        return bullet;
      };
      const bus = newEventBus();
      const game = gameExports.newGame();
      game.bullets = [
        goodShipBullet(),
        badShipBullet(),
        goodShipBullet(),
        badShipBullet(),
      ];

      // Act
      gameExports.moveBullets(bus, game, BAD_SHIP_TYPE);

      // Assert
      expect(game.bullets[0].shapes[0]).toEqual({
        _type: "_shape",
        color: "blue",
        height: 10,
        width: 10,
        x: 5,
        y: 10,
      });
      expect(game.bullets[2].shapes[0]).toEqual({
        _type: "_shape",
        color: "blue",
        height: 10,
        width: 10,
        x: 5,
        y: 10,
      });
      expect(game.bullets[1].shapes[0]).toEqual({
        _type: "_shape",
        color: "blue",
        oldX: 3,
        oldY: 13,
        height: 10,
        width: 10,
        x: 3,
        y: 18,
      });
      expect(game.bullets[3].shapes[0]).toEqual({
        _type: "_shape",
        color: "blue",
        oldX: 3,
        oldY: 13,
        height: 10,
        width: 10,
        x: 3,
        y: 18,
      });
    });
  });
  describe("destroyObject", () => {
    ["TYPE_ONE", "TYPE_TWO"].forEach((type) => {
      it(`should call the expected handler with type: ${type}`, async () => {
        // Arrange
        const bus = newEventBus();
        const game = gameExports.newGame();
        const o = {
          _type: type,
          shapes: ["mocked"],
        };
        const handlers = {
          TYPE_ONE: jest.fn(),
          TYPE_TWO: jest.fn(),
        };
        const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

        // Act
        await gameExports.destroyObject(bus, game, o, handlers);

        // Assert
        expect(handlers[type]).toHaveBeenCalledWith(bus, o, game);
        expect(publishSpy).toHaveBeenCalledWith(bus, CANVAS_REMOVE, ["mocked"]);
      });
    });
    it("should throw when the handler type is not known", async () => {
      // Arrange
      const bus = newEventBus();
      const game = gameExports.newGame();
      const o = {
        _type: "UNKOWN_TYPE",
      };
      const handlers = {
        TYPE_ONE: jest.fn(),
      };
      const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

      // Act
      // Assert
      expect(gameExports.destroyObject(bus, game, o, handlers)).rejects.toThrow(
        "unknon object type when trying to destory object"
      );
      expect(publishSpy).not.toHaveBeenCalled();
    });
    // TODO: Test default handlers!
    it("should remove object from the game and publish an object destroyed event when object is a goodShip", async () => {
      // Arrange
      const bus = newEventBus();
      const game = gameExports.newGame();
      const o = newGoodShip("an id");
      game.goodShips = [o];
      const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

      // Act
      await gameExports.destroyObject(bus, game, o);

      // Assert
      expect(game.goodShips).toEqual([]);
      expect(publishSpy).toHaveBeenCalledWith(bus, GOOD_SHIP_DESTROYED, {
        id: o.id,
      });
      expect(publishSpy).toHaveBeenCalledWith(bus, CANVAS_REMOVE, o.shapes);
    });
    it("should remove object from the game and publish an object destroyed event when object is a badShip", async () => {
      // Arrange
      const bus = newEventBus();
      const game = gameExports.newGame();
      const o = newBadShip();
      game.badShips = [o];
      const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

      // Act
      await gameExports.destroyObject(bus, game, o);

      // Assert
      expect(game.badShips).toEqual([]);
      expect(publishSpy).toHaveBeenCalledWith(bus, BAD_SHIP_DESTROYED, {
        id: o.id,
      });
      expect(publishSpy).toHaveBeenCalledWith(bus, CANVAS_REMOVE, o.shapes);
    });
    it("should remove object from the game and publish an object destroyed event when object is a rock", async () => {
      // Arrange
      const bus = newEventBus();
      const game = gameExports.newGame();
      const o = newRock(100);
      game.rocks = [o];
      const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

      // Act
      await gameExports.destroyObject(bus, game, o);

      // Assert
      expect(game.rocks).toEqual([]);
      expect(publishSpy).toHaveBeenCalledTimes(1);
      expect(publishSpy).toHaveBeenCalledWith(bus, CANVAS_REMOVE, o.shapes);
    });
    it("should remove object from the game and publish an object destroyed event when object is a bullet", async () => {
      // Arrange
      const bus = newEventBus();
      const game = gameExports.newGame();
      const o = newBullet("OWNER_TYPE", "OWNER_ID");
      game.bullets = [o];
      const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

      // Act
      await gameExports.destroyObject(bus, game, o);

      // Assert
      expect(game.bullets).toEqual([]);
      expect(publishSpy).toHaveBeenCalledWith(bus, BULLET_DESTROYED, {
        id: o.id,
      });
      expect(publishSpy).toHaveBeenCalledWith(bus, CANVAS_REMOVE, o.shapes);
    });
  });
  describe("moveBadShips", () => {
    it("should do nothing if there are no ships in a row", () => {
      // Arrange
      const bus = newEventBus();
      const game = gameExports.newGame();
      const moveAndDrawSpy = jest.spyOn(draw, "moveAndDrawObject");
      game.badShips = [];

      // Act
      gameExports.moveBadShips(bus, game, {});

      // Assert
      expect(isAtExtremity).not.toHaveBeenCalled();
      expect(moveAndDrawSpy).not.toHaveBeenCalled();
    });
    it("should move ships by a delta of 1 if any ship is at the left extremity", () => {
      // Arrange
      const bus = newEventBus();
      const game = gameExports.newGame();
      const leftExtremityBadShape = newBadShip();
      const moveAndDrawSpy = jest.spyOn(draw, "moveAndDrawObject");
      leftExtremityBadShape.shapes = [
        newShape(0, 89, 10, 10, "blue"),
        newShape(5, 89, 10, 10, "blue"),
      ];
      game.badShips = [leftExtremityBadShape, newBadShip()];
      isAtExtremity.mockReturnValue({
        left: true,
        right: false,
      });

      // Act
      gameExports.moveBadShips(bus, game, {});

      // Assert
      expect(isAtExtremity).toHaveBeenCalledWith({}, [
        newShape(0, 89, 10, 10, "blue"),
        newShape(5, 89, 10, 10, "blue"),
      ]);
      expect(isAtExtremity).toHaveBeenCalledWith({}, [
        newShape(20, 32, 60, 9, "white"),
        newShape(40, 28, 20, 20, "white"),
        newShape(20, 20, 12, 20, "white"),
        newShape(68, 20, 12, 20, "white"),
      ]);
      expect(moveAndDrawSpy).toHaveBeenCalledTimes(2);
      expect(moveAndDrawSpy).toHaveBeenCalledWith(
        bus,
        expect.any(Object),
        1,
        10
      );
    });
    it("should move ships by a delta of -1 if any ship is at the right extremity", () => {
      // Arrange
      const bus = newEventBus();
      const game = gameExports.newGame();
      const moveAndDrawSpy = jest.spyOn(draw, "moveAndDrawObject");
      const rightExtremityBadShape = newBadShip();
      rightExtremityBadShape.shapes = [
        newShape(1, 89, 10, 10, "blue"),
        newShape(90, 89, 10, 10, "blue"),
      ];
      game.badShips = [rightExtremityBadShape, newBadShip()];
      isAtExtremity.mockReturnValue({
        left: false,
        right: true,
      });

      // Act
      gameExports.moveBadShips(bus, game, {});

      // Assert
      expect(isAtExtremity).toHaveBeenCalledWith({}, [
        newShape(1, 89, 10, 10, "blue"),
        newShape(90, 89, 10, 10, "blue"),
      ]);
      expect(isAtExtremity).toHaveBeenCalledWith({}, [
        newShape(20, 32, 60, 9, "white"),
        newShape(40, 28, 20, 20, "white"),
        newShape(20, 20, 12, 20, "white"),
        newShape(68, 20, 12, 20, "white"),
      ]);
      expect(moveAndDrawSpy).toHaveBeenCalledTimes(2);
      expect(moveAndDrawSpy).toHaveBeenCalledWith(
        bus,
        expect.any(Object),
        -1,
        10
      );
    });
  });
  describe("shootBadBullets", () => {
    it("should do nothing when there are no bad ships", () => {
      // Arrange
      const bus = newEventBus();
      const game = gameExports.newGame();
      game.badShips = [];
      game.level = {
        standard: {
          game: {
            badShipsBulletsPerSecond: 2,
          },
        },
      };

      // Act
      gameExports.shootBadBullets(bus, game);

      // Assert
      expect(fireBullet).not.toHaveBeenCalled();
    });
    it("should do call fireBullet badShipsBulletsPerSecond times with a ship from the game", () => {
      // Arrange
      const bus = newEventBus();
      const game = gameExports.newGame();
      game.level = {
        standard: {
          game: {
            badShipsBulletsPerSecond: 2,
          },
        },
      };
      game.badShips = [newBadShip(), newBadShip(), newBadShip()];

      // Act
      gameExports.shootBadBullets(bus, game);

      // Assert
      expect(fireBullet).toHaveBeenCalledTimes(2);
      expect(fireBullet).toHaveBeenCalledWith(
        bus,
        expect.objectContaining({
          _type: BAD_SHIP_TYPE,
        })
      );
    });
  });
  describe("initialiseBadShips", () => {
    it("should X", async () => {
      // Arrange
      const bus = newEventBus();
      const game = gameExports.newGame();
      game.level = {
        standard: {
          game: {
            badShipRows: 2,
            badShipsPerRow: 3,
          },
        },
      };
      const publishSpy = jest.spyOn(eventBus, "publishToEventBus");
      const moveAndDrawSpy = jest.spyOn(draw, "moveAndDrawObject");

      // Act
      await gameExports.initialiseBadShips(bus, game);

      // Assert
      expect(publishSpy).toHaveBeenCalledTimes(12); // 6 for CANVAS_DRAW + 6 for BAD_SHIP_CREATED
      expect(moveAndDrawSpy).toHaveBeenCalledTimes(6);
      // Assert calls for each expected ship
      expect(moveAndDrawSpy).toHaveBeenCalledWith(
        bus,
        expect.objectContaining({
          _type: "_badShip",
          shapes: [
            {
              _type: "_shape",
              color: "white",
              height: 9,
              oldX: 20,
              oldY: 32,
              width: 60,
              x: 25,
              y: 182,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 40,
              oldY: 28,
              width: 20,
              x: 45,
              y: 178,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 20,
              oldY: 20,
              width: 12,
              x: 25,
              y: 170,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 68,
              oldY: 20,
              width: 12,
              x: 73,
              y: 170,
            },
          ],
          width: 80,
        }),
        5,
        150
      );
      expect(moveAndDrawSpy).toHaveBeenCalledWith(
        bus,
        expect.objectContaining({
          _type: "_badShip",
          shapes: [
            {
              _type: "_shape",
              color: "white",
              height: 9,
              oldX: 20,
              oldY: 32,
              width: 60,
              x: 105,
              y: 182,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 40,
              oldY: 28,
              width: 20,
              x: 125,
              y: 178,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 20,
              oldY: 20,
              width: 12,
              x: 105,
              y: 170,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 68,
              oldY: 20,
              width: 12,
              x: 153,
              y: 170,
            },
          ],
          width: 80,
        }),
        85,
        150
      );
      expect(moveAndDrawSpy).toHaveBeenCalledWith(
        bus,
        expect.objectContaining({
          _type: "_badShip",
          shapes: [
            {
              _type: "_shape",
              color: "white",
              height: 9,
              oldX: 20,
              oldY: 32,
              width: 60,
              x: 185,
              y: 182,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 40,
              oldY: 28,
              width: 20,
              x: 205,
              y: 178,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 20,
              oldY: 20,
              width: 12,
              x: 185,
              y: 170,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 68,
              oldY: 20,
              width: 12,
              x: 233,
              y: 170,
            },
          ],
          width: 80,
        }),
        165,
        150
      );
      expect(moveAndDrawSpy).toHaveBeenCalledWith(
        bus,
        expect.objectContaining({
          _type: "_badShip",
          shapes: [
            {
              _type: "_shape",
              color: "white",
              height: 9,
              oldX: 20,
              oldY: 32,
              width: 60,
              x: 25,
              y: 262,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 40,
              oldY: 28,
              width: 20,
              x: 45,
              y: 258,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 20,
              oldY: 20,
              width: 12,
              x: 25,
              y: 250,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 68,
              oldY: 20,
              width: 12,
              x: 73,
              y: 250,
            },
          ],
          width: 80,
        }),
        5,
        230
      );
      expect(moveAndDrawSpy).toHaveBeenCalledWith(
        bus,
        expect.objectContaining({
          _type: "_badShip",
          shapes: [
            {
              _type: "_shape",
              color: "white",
              height: 9,
              oldX: 20,
              oldY: 32,
              width: 60,
              x: 105,
              y: 262,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 40,
              oldY: 28,
              width: 20,
              x: 125,
              y: 258,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 20,
              oldY: 20,
              width: 12,
              x: 105,
              y: 250,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 68,
              oldY: 20,
              width: 12,
              x: 153,
              y: 250,
            },
          ],
          width: 80,
        }),
        85,
        230
      );
      expect(moveAndDrawSpy).toHaveBeenCalledWith(
        bus,
        expect.objectContaining({
          _type: "_badShip",
          shapes: [
            {
              _type: "_shape",
              color: "white",
              height: 9,
              oldX: 20,
              oldY: 32,
              width: 60,
              x: 185,
              y: 262,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 40,
              oldY: 28,
              width: 20,
              x: 205,
              y: 258,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 20,
              oldY: 20,
              width: 12,
              x: 185,
              y: 250,
            },
            {
              _type: "_shape",
              color: "white",
              height: 20,
              oldX: 68,
              oldY: 20,
              width: 12,
              x: 233,
              y: 250,
            },
          ],
          width: 80,
        }),
        165,
        230
      );
    });
  });
  describe("handleIfOutOfPlay", () => {
    it("should not destroy object if it is not out of play", async () => {
      // Arrange
      const bus = newEventBus();
      const game = gameExports.newGame();
      const bullet = newBullet();
      const context = { height: 100, width: 100 };
      const destroyObjectSpy = jest.spyOn(gameExports, "destroyObject");

      // Act
      await gameExports.handleIfOutOfPlay(bus, game, context, bullet);

      // Assert
      expect(destroyObjectSpy).not.toHaveBeenCalled();
    });
  });
  [
    {
      top: true,
      bottom: true,
    },
    {
      top: false,
      bottom: true,
    },
    {
      top: true,
      bottom: false,
    },
  ].forEach((r) => {
    it("should if it is out of play", async () => {
      // Arrange
      const bus = newEventBus();
      const game = gameExports.newGame();
      const bullet = newBullet();
      const context = { height: 100, width: 100 };
      const publishSpy = jest.spyOn(eventBus, "publishToEventBus");
      isAtExtremity.mockReturnValue(r);
      // Act
      await gameExports.handleIfOutOfPlay(bus, game, context, bullet);

      // Assert
      expect(publishSpy).toHaveBeenCalledWith(bus, BULLET_DESTROYED, {
        id: bullet.id,
      });
    });
  });
});
