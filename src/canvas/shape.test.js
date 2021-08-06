import { new2DCanvas, intialiseCanvas } from ".";
import * as eventBus from "../events";
import { CANVAS_DRAW, CANVAS_REMOVE } from "../events/events";
import { newShape } from "./shape";

describe("shape", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("newShape", () => {
    it("should create a new shape object", () => {
      // Arrange
      const expected = {
        _type: "_shape",
        x: 1,
        y: 2,
        width: 10,
        height: 20,
        color: "yellow",
      };

      // Act
      const actual = newShape(1, 2, 10, 20, "yellow");

      // Assert
      expect(actual).toEqual(expected);
    });
  });
});
