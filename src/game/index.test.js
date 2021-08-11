import { initialiseGame, newGame } from ".";
import * as eventBus from "../events";
import { newEventBus } from "../events";
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
    it("should do X", async () => {
      // Arrange
      const bus = newEventBus();
      const game = newGame();
      window.addEventListener = jest.fn((option, handler) => {
        handlers = [...handlers, handler];
      });
      const subscribeSpy = jest.spyOn(eventBus, "subscribeToEventBus");
      const expectedFireBulletAnimationFrame = {
        _type: "_animationFrame",
        id: "uuid",
        ms: 800,
        action: expect.any(Function),
      };
      // Act
      await initialiseGame(bus, game);

      // Assert
      //   expect(initialiseAnimationSpy).toHaveBeenCalledWith(
      //     expectedMoveShipAnimationFrame
      //   );
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
