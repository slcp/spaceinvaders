import { initialiseGame, newGame } from ".";
import * as eventBus from "../events";
import { newEventBus } from "../events";
import * as animation from "../animation";
import {
  BULLET_CREATED,
  END_GAME,
  NEW_GAME,
  START_NEXT_LEVEL,
} from "../events/events";

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
      const initialiseAnimationSpy = jest.spyOn(animation, "runFrame");
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
      await initialiseGame(bus, game);

      // Assert
      expect(initialiseAnimationSpy).toHaveBeenCalledWith(
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
});
