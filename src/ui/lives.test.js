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
    it("should call subscribeToEventBus", () => {
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
      initialiseLife(life, bus);

      // Assert
      expect(subscribeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          events: {
            ADD_LIFE: [expect.any(Function)],
            PLAYER_LOST_LIFE: [expect.any(Function)],
          },
        }),
        "ADD_LIFE",
        expect.any(Function)
      );
      expect(subscribeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          events: {
            ADD_LIFE: [expect.any(Function)],
            PLAYER_LOST_LIFE: [expect.any(Function)],
          },
        }),
        "PLAYER_LOST_LIFE",
        expect.any(Function)
      );
    });
    it("should throw when a life with the same id has already been initialised", () => {
      // Arrange
      const life = newLife({
        element: {
          removeChild: jest.fn(),
          appendChild: jest.fn(),
        },
        id: "idx",
      });
      const subscribeSpy = jest.spyOn(eventBus, "subscribeToEventBus");
      const bus = eventBus.newEventBus();

      // Act
      // Assert
      initialiseLife(life, bus);
      expect(() => initialiseLife(life, bus)).toThrow(
        "life with id idx already initialised"
      );
    });
    it("should call removeChild when responding to LOSE_LIFE event", async () => {
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
      initialiseLife(life, bus);
      await eventBus.publishToEventBus(bus, "PLAYER_LOST_LIFE", {
        id: "an id2",
      });

      // Assert
      expect(life.element.removeChild).toHaveBeenCalledWith("expected");
    });
    it("should call removeChild when responding to ADD_LIFE event", async () => {
      // Arrange
      const life = newLife({
        element: {
          removeChild: jest.fn(),
          appendChild: jest.fn(),
          lastChild: {
            id: "loroem-5",
          },
        },
        id: "an id3",
      });
      const bus = eventBus.newEventBus();

      // Act
      initialiseLife(life, bus);
      await eventBus.publishToEventBus(bus, "ADD_LIFE", {
        id: "an id3",
      });

      // Assert
      expect(life.element.appendChild).toHaveBeenCalledWith(
        makeLifeRepresentation(6)
      );
    });
  });
});
