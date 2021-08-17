import { newEventBus } from "../events";
import { badShipKilled, checkGameState, newGameState, playerKilled } from "./gameState";
import * as eventBus from "../events";
import {
  END_GAME,
  NEW_GAME,
  SET_MESSAGE,
  START_NEXT_LEVEL,
} from "../events/events";

describe("gameState", () => {
  describe("newGameState", () => {
    it("should create a new GameState object", () => {
      // Arrange
      const expected = {
        badShips: [],
        playerLives: [],
      };

      // Act
      const actual = newGameState();

      // Assert
      expect(expected).toEqual(actual);
    });
  });
  describe("checkGameState", () => {
    it("should do nothing when state has playerLives and badShips greater than 0", async () => {
      // Arrange
      const state = newGameState();
      state.badShips = 1;
      state.playerLives = 1;
      const bus = newEventBus();
      const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

      // Act
      await checkGameState(bus, state);

      // Assert
      expect(publishSpy).not.toHaveBeenCalled();
    });
    it("should publish X when state has 0 badShips", async () => {
      // Arrange
      const state = newGameState();
      state.badShips = 0;
      const bus = newEventBus();
      const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

      // Act
      await checkGameState(bus, state);

      // Assert
      expect(publishSpy).toHaveBeenCalledWith(bus, START_NEXT_LEVEL);
      expect(publishSpy).toHaveBeenCalledWith(bus, SET_MESSAGE, {
        message: "Next level",
      });
    });
    it("should publish X when state has 0 playerLives and more than 0 badShips", async () => {
      // Arrange
      const state = newGameState();
      state.badShips = 1;
      state.playerLives = 0;
      const bus = newEventBus();
      const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

      // Act
      await checkGameState(bus, state);

      // Assert
      expect(publishSpy).toHaveBeenCalledWith(bus, END_GAME);
      expect(publishSpy).toHaveBeenCalledWith(bus, SET_MESSAGE, {
        message: "Game over",
        persist: true,
      });
    });
  });
  describe("badShipKilled", () => {
    it("should throw when value of remainingShipCount is not a number", async () => {
      // Arrange
      const bus = newEventBus();
      const state = newGameState();

      // Act
      // Assert
      expect(
        badShipKilled(bus, state, { remainingShipCount: "string" })
      ).rejects.toThrowError(
        "The type of remainingShipCount must be a number, received: string"
      );
    });
    it("should set badShips on state", async () => {
      // Arrange
      const bus = newEventBus();
      const state = newGameState();
      state.badShips = 5

      // Act
      await badShipKilled(bus, state, { remainingShipCount: 2 })
      
      // Assert
      expect(state.badShips).toEqual(2)
    });
  });
  describe("playerKilled", () => {
    it("should throw when value of remainingLives is not a number", async () => {
      // Arrange
      const bus = newEventBus();
      const state = newGameState();

      // Act
      // Assert
      expect(
        playerKilled(bus, state, { remainingLives: "string" })
      ).rejects.toThrowError(
        "The type of remainingLives must be a number, received: string"
      );
    });
    it("should set playerLives on state", async () => {
      // Arrange
      const bus = newEventBus();
      const state = newGameState();
      state.playerLives = 5;

      // Act
      await playerKilled(bus, state, { remainingLives: 2 });

      // Assert
      expect(state.playerLives).toEqual(2);
    });
  });
});
