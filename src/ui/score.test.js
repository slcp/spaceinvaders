import { initialiseScore, newScore } from "./score";
import * as eventBus from "../events";

describe("scores", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("newScore", () => {
    it("should create a new score object", () => {
      // Arrange
      // Act
      const actual = newScore({
        element: {
          getElementsByClassName: jest.fn(),
        },
        id: "an id",
      });

      // Assert
      expect(actual.id).toEqual("an id");
      expect(actual.element.getElementsByClassName).toEqual(
        expect.any(Function)
      );
    });

    it("should throw when element.getElementsByClassName is not callable", () => {
      // Arrange
      // Act
      // Assert
      expect(() =>
        newScore({
          element: {
            getElementsByClassName: "",
          },
          id: "an id",
        })
      ).toThrow("element must represent a DOM element");
    });
  });
  describe("initialiseScore", () => {
    it("should call subscribeToEventBus", async () => {
      // Arrange
      const element = {
        innerText: "0",
      };
      const score = newScore({
        element: {
          getElementsByClassName: jest.fn().mockReturnValue([element]),
        },
        id: "an id",
      });
      const subscribeSpy = jest.spyOn(eventBus, "subscribeToEventBus");
      const bus = eventBus.newEventBus();

      // Act
      await initialiseScore(score, bus);

      // Assert
      expect(subscribeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          events: { SET_SCORE: [expect.any(Function)] },
        }),
        "SET_SCORE",
        expect.any(Function)
      );
    });
    it("should call set innerText of element when responding to SET_SCORE event", async () => {
      // Arrange
      const element = {
        innerText: "0",
      };
      const score = newScore({
        element: {
          getElementsByClassName: jest.fn().mockReturnValue([element]),
        },
        // Cannot use same as id as another test as there is internal state in the scores module
        id: "an id2",
      });
      const bus = eventBus.newEventBus();

      // Act
      await initialiseScore(score, bus);
      await eventBus.publishToEventBus(bus, "SET_SCORE", {
        id: "an id2",
        value: 100,
      });

      // Assert
      expect(score.element.getElementsByClassName).toHaveBeenCalled();
      expect(element.innerText).toEqual(100);
    });
  });
});
