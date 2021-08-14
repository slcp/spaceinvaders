import { initialiseRock, newRock } from "./rock";

describe("Rock", () => {
  describe("newRock", () => {
    it("should create a new rock object", () => {
      // Arrange
      // Act
      const actual = newRock(100);

      // Assert
      expect(actual._type).toEqual("_rock");
      expect(actual.width).toEqual(100);
      expect(actual.shapes).toBeFalsy();
    });
  });
  describe("initialiseRock", () => {
    it("should generate the expected shapes to make up the whole rock", () => {
      // Arrange
      const rock = newRock(30);
      const settings = {
        rockParticleWidth: 10,
        rockParticleHeight: 4,
      };

      // Act
      initialiseRock(rock, settings);

      // Assert
      expect(rock.shapes).toEqual([
        {
          _type: "_shape",
          color: undefined,
          height: 4,
          width: 10,
          x: 0,
          y: 800,
        },
        {
          _type: "_shape",
          color: undefined,
          height: 4,
          width: 10,
          x: 10,
          y: 800,
        },
        {
          _type: "_shape",
          color: undefined,
          height: 4,
          width: 10,
          x: 20,
          y: 800,
        },
        {
          _type: "_shape",
          color: undefined,
          height: 4,
          width: 10,
          x: 30,
          y: 800,
        },
        {
          _type: "_shape",
          color: undefined,
          height: 4,
          width: 10,
          x: 40,
          y: 800,
        },
        {
          _type: "_shape",
          color: undefined,
          height: 4,
          width: 10,
          x: 50,
          y: 800,
        },
        {
          _type: "_shape",
          color: undefined,
          height: 4,
          width: 10,
          x: 60,
          y: 800,
        },
        {
          _type: "_shape",
          color: undefined,
          height: 4,
          width: 10,
          x: 70,
          y: 800,
        },
        {
          _type: "_shape",
          color: undefined,
          height: 4,
          width: 10,
          x: 80,
          y: 800,
        },
        {
          _type: "_shape",
          color: undefined,
          height: 4,
          width: 10,
          x: 90,
          y: 800,
        },
      ]);
    });
    it("should throw when rock width is not set", () => {
      // Arrange
      const rock = newRock();
      const settings = {
        rockParticleWidth: 10,
        rockParticleHeight: 4,
      };

      // Act
      // Assert
      expect(() => initialiseRock(rock, settings)).toThrow(
        "rock width must be set"
      );
    });
  });
});
