
import { newAnimationFrame } from './animationFrame'

describe("Animation frame", () => {
    describe("newAnimationFrame", () => {
        it("should create a new animationFrame object", () => {
            // Arrange
            const expected = {
                _type: "_animationFrame",
                id: "an id",
                ms: 100,
                action: expect.any(Function)
            }
            // Act
            const actual = newAnimationFrame("an id", 100, () => { });

            // Assert
            expect(actual).toEqual(expected);
        });
        it("should throw when action is not a function", () => {
            // Arrange
            const action = "not a function";

            // Act
            // Assert
            expect(() => newAnimationFrame("an id", 100, action)).toThrow("frame action must be callable");
        });
    });
});
