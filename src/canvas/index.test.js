import { new2DCanvas, intialiseCanvas } from ".";
import * as eventBus from "../events";
import { CANVAS_DRAW, CANVAS_REMOVE } from "../events/events";
import { newShape } from "./shape";

describe("canvas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("new2DCanvas", () => {
    it("should create a new canvas object", () => {
      // Arrange
      const element = {
        width: 73,
        height: 45,
      };
      const expected = {
        _type: "_canvas2D",
        element,
      };

      // Act
      const actual = new2DCanvas(element);

      // Assert
      expect(actual).toEqual(expected);
    });
  });
  describe("initialiseCanvas", () => {
    it("should call subscribeToEventBus", async () => {
      // Arrange
      const element = {
        width: 73,
        height: 45,
      };
      const canvas = new2DCanvas(element);
      const bus = eventBus.newEventBus();
      const subscribeSpy = jest.spyOn(eventBus, "subscribeToEventBus");

      // Act
      await intialiseCanvas(canvas, bus);

      // Assert
      expect(subscribeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          events: {
            CANVAS_DRAW: [expect.any(Function)],
            CANVAS_REMOVE: [expect.any(Function)],
          },
        }),
        "CANVAS_DRAW",
        expect.any(Function)
      );
      expect(subscribeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          events: {
            CANVAS_DRAW: [expect.any(Function)],
            CANVAS_REMOVE: [expect.any(Function)],
          },
        }),
        "CANVAS_REMOVE",
        expect.any(Function)
      );
    });
    it("should clear and fill rects when responding to CANVAS_DRAW event", async () => {
      // Arrange
      const context = {
        clearRect: jest.fn(),
        fillRect: jest.fn(),
      };
      const element = {
        getContext: jest.fn().mockReturnValue(context),
      };
      const shapes = [newShape(1, 2, 10, 20, "blue")];
      const canvas = new2DCanvas(element);
      const bus = eventBus.newEventBus();

      // Act
      await intialiseCanvas(canvas, bus);
      eventBus.publishToEventBus(bus, CANVAS_DRAW, shapes);

      // Assert
      expect(element.getContext).toHaveBeenCalledTimes(2);
      expect(context.clearRect).toHaveBeenCalledWith(0, 0, 10, 20);
      expect(context.clearRect).toHaveBeenCalledWith(1, 2, 10, 20);
      expect(context.fillRect).toHaveBeenCalledWith(1, 2, 10, 20);
      expect(context.fillRect).toHaveBeenCalledWith(1, 2, 10, 20);
      expect(context.fillStyle).toEqual("blue");
    });
    it("should clear rects when responding to CANVAS_REMOVE event", async () => {
      // Arrange
      const context = {
        clearRect: jest.fn(),
      };
      const element = {
        getContext: jest.fn().mockReturnValue(context),
      };
      const shapes = [newShape(1, 2, 10, 20, "blue")];
      const canvas = new2DCanvas(element);
      const bus = eventBus.newEventBus();

      // Act
      await intialiseCanvas(canvas, bus);
      eventBus.publishToEventBus(bus, CANVAS_REMOVE, shapes);

      // Assert
      expect(element.getContext).toHaveBeenCalledTimes(1);
      expect(context.clearRect).toHaveBeenCalledWith(0, 0, 10, 20);
      expect(context.clearRect).toHaveBeenCalledWith(1, 2, 10, 20);
    });
  });
});
