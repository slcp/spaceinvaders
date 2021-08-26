import { initialiseLife, newLife } from "./lives";
import * as eventBus from "../events";
import { makeLifeRepresentation } from "./ui";

describe("lives", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("newLife", () => {
    it("should create a new life object", () => {
      // Arrange
      // Act
      const actual = newLife({
        element: {
          removeChild: jest.fn(),
          appendChild: jest.fn(),
        },
        id: "an id",
      });

      // Assert
      expect(actual.id).toEqual("an id");
    });

    it("should throw when element.removeChild/appendChild are not callable", () => {
      // Arrange
      // Act
      // Assert
      expect(() =>
        newLife({
          element: {
            removeChild: "",
            appendChild: "",
          },
          id: "an id",
        })
      ).toThrow("element must represent a DOM element");
    });
  });
  describe("initialiseLife", () => {
    it("should call subscribeToEventBus", async () => {
      // Arrange
      const life = newLife({
        element: {
          removeChild: jest.fn(),
          appendChild: jest.fn(),
        },
        id: "an id",
      });
      const subscribeSpy = jest.spyOn(eventBus, "subscribeToEventBus");
      const bus = eventBus.newEventBus();

      // Act
      await initialiseLife(life, bus);

      // Assert
      expect(subscribeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          events: {
            PLAYER_LOST_LIFE: [expect.any(Function)],
          },
        }),
        "PLAYER_LOST_LIFE",
        expect.any(Function)
      );
    });
    it("should throw when a life with the same id has already been initialised", async () => {
      // Arrange
      const life = newLife({
        element: {
          removeChild: jest.fn(),
          appendChild: jest.fn(),
        },
        id: "idx",
      });
      const bus = eventBus.newEventBus();

      // Act
      // Assert
      await initialiseLife(life, bus);
      await expect(initialiseLife(life, bus)).rejects.toThrow(
        "life with id idx already initialised"
      );
    });
    it("should call removeChild when responding to PLAYER_LOST_LIFE event", async () => {
      // Arrange
      const life = newLife({
        element: {
          removeChild: jest.fn(),
          appendChild: jest.fn(),
          lastChild: "expected",
        },
        // Cannot use same as id as another test as there is internal state in the scores module
        id: "an id2",
      });
      const bus = eventBus.newEventBus();

      // Act
      await initialiseLife(life, bus);
      await eventBus.publishToEventBus(bus, "PLAYER_LOST_LIFE", {
        id: "an id2",
      });

      // Assert
      expect(life.element.removeChild).toHaveBeenCalledWith("expected");
    });
  });
});
