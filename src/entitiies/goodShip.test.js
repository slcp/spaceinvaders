import { newShape } from "../canvas/shape";
import { newGoodShip } from "./goodShip";
import { newShip } from "./ship";

describe("Good ship", () => {
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
        shootTrigger: "Space"
      };

      // Act
      const actual = newGoodShip("an id");

      // Assert
      expect(actual).toEqual(expected);
    });
  });
});
