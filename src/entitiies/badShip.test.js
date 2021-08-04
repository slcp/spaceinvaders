import { newShape } from "../canvas/shape";
import { newBadShip } from "./badShip";

describe("Bad ship", () => {
  describe("newBadShip", () => {
    it("should create a new score object", () => {
      // Arrange
      // Act
      const actual = newBadShip();

      // Assert
      expect(actual._type).toEqual("_badShip");
      expect(actual.shapes).toEqual([
        newShape(20, 32, 60, 9, "white"),
        newShape(40, 28, 20, 20, "white"),
        newShape(20, 20, 12, 20, "white"),
        newShape(68, 20, 12, 20, "white"),
      ]);
    });
  });
});
