import { newShape } from "../canvas/shape";
import { newBadShip } from "./badShip";
import { newShip } from "./ship";

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
      }
      // Act
      const actual = newBadShip();

      // Assert
      expect(actual).toEqual(expected);
    });
  });
});
