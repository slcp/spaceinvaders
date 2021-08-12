import { initialiseGame, moveBadShips, moveBullets, newGame } from ".";
import * as eventBus from "../events";
import { newEventBus } from "../events";
import { runFrame } from "../animation";
import {
  BULLET_CREATED,
  END_GAME,
  NEW_GAME,
  START_NEXT_LEVEL,
} from "../events/events";
import { newBullet } from "../entitiies/bullet";
import { SHIP_TYPE } from "../entitiies/goodShip";
import { newShape } from "../canvas/shape";
import { isAtExtremity } from "../canvas";
import { BAD_SHIP_TYPE, newBadShip } from "../entitiies/badShip";
import * as draw from "../functional/drawObject";

jest.mock("../canvas", () => ({
  isAtExtremity: jest.fn().mockReturnValue({}),
}));

jest.mock("../animation", () => ({
  runFrame: jest.fn(),
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
      const actual = newGame();

      // Assert
      expect(actual).toEqual(expected);
    });
  });
  describe("initaliseGame", () => {
    it("should do subscribe to the correct events and set up animation frames", async () => {
      // Arrange
      const bus = newEventBus();
      const game = newGame();
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
      await initialiseGame(bus, game, {});

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
  describe("moveBullets", () => {
    ["TYPE_ONE", "TYPE_TWO"].forEach((type) => {
      it(`should call the expected handler with type: ${type}`, () => {
        // Arrange
        const bus = newEventBus();
        const game = newGame();
        const handlers = {
          TYPE_ONE: jest.fn(),
          TYPE_TWO: jest.fn(),
        };

        // Act
        moveBullets(bus, game, type, handlers);

        // Assert
        expect(handlers[type]).toHaveBeenCalledWith(bus, game);
      });
    });
    it("should throw when the handler type is not known", () => {
      // Arrange
      const bus = newEventBus();
      const game = newGame();
      const handlers = {
        TYPE_ONE: jest.fn(),
      };

      // Act
      // Assert
      expect(() => moveBullets(bus, game, "UNKOWN_TYPE", handlers)).toThrow(
        "unknon ship type when trying to move bullets"
      );
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
      const game = newGame();
      game.bullets = [
        goodShipBullet(),
        badShipBullet(),
        goodShipBullet(),
        badShipBullet(),
      ];

      // Act
      moveBullets(bus, game, SHIP_TYPE);

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
      const game = newGame();
      game.bullets = [
        goodShipBullet(),
        badShipBullet(),
        goodShipBullet(),
        badShipBullet(),
      ];

      // Act
      moveBullets(bus, game, BAD_SHIP_TYPE);

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
  describe("moveBadShips", () => {
    it("should do nothing if there are no ships in a row", () => {
      // Arrange
      const bus = newEventBus();
      const game = newGame();
      const moveAndDrawSpy = jest.spyOn(draw, "moveAndDrawObject");
      game.badShips = [[]];

      // Act
      moveBadShips(bus, game, {});

      // Assert
      expect(isAtExtremity).not.toHaveBeenCalled();
      expect(moveAndDrawSpy).not.toHaveBeenCalled();
    });
    it("should move ships by a delta of 1 if any ship is at the left extremity", () => {
      // Arrange
      const bus = newEventBus();
      const game = newGame();
      const leftExtremityBadShape = newBadShip();
      const moveAndDrawSpy = jest.spyOn(draw, "moveAndDrawObject");
      leftExtremityBadShape.shapes = [
        newShape(0, 89, 10, 10, "blue"),
        newShape(5, 89, 10, 10, "blue"),
      ];
      game.badShips = [[leftExtremityBadShape], [newBadShip()]];
      isAtExtremity.mockReturnValue({
        left: true,
        right: false,
      });

      // Act
      moveBadShips(bus, game, {});

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
      const game = newGame();
      const moveAndDrawSpy = jest.spyOn(draw, "moveAndDrawObject");
      const rightExtremityBadShape = newBadShip();
      rightExtremityBadShape.shapes = [
        newShape(1, 89, 10, 10, "blue"),
        newShape(90, 89, 10, 10, "blue"),
      ];
      game.badShips = [[rightExtremityBadShape], [newBadShip()]];
      isAtExtremity.mockReturnValue({
        left: false,
        right: true,
      });

      // Act
      moveBadShips(bus, game, {});

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
});
