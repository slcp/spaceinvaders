import { newGameState } from "./gameState";

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
    it("should X", async () => {});
  });
});
