import { newShape } from "../canvas/shape";
import { BAD_SHIP_TYPE } from "./badShip";
import { newBullet } from "./bullet";

describe("Bad ship", () => {
  describe("newBadShip", () => {
    it("should create a new score object", () => {
      // Arrange
      // Act
      const actual = newBullet(BAD_SHIP_TYPE);

      // Assert
      expect(actual._type).toEqual("_bullet");
      expect(actual.ownerType).toEqual("_badShip");
      expect(actual.shapes).toEqual([newShape(0, 10, 4, 20)]);
    });
  });
});
