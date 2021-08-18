import { subscribeToEventBus } from "../events";
import { CANVAS_DRAW, CANVAS_REMOVE } from "../events/events";

const extremityHandlers = {
  left: (shapes, _, __) => {
    const leftMostXValue = Math.floor(...shapes.map((shape) => shape.x));
    return leftMostXValue <= 0;
  },
  right: (shapes, _, width) => {
    const rightMostXValue = Math.max(
      ...shapes.map((shape) => shape.x + shape.width)
    );
    return rightMostXValue >= width;
  },
  top: (shapes, _, __) => {
    const topMostYValue = Math.floor(...shapes.map((shape) => shape.y));
    return topMostYValue <= 0;
  },
  bottom: (shapes, height, __) => {
    const bottomMostYValue = Math.max(
      ...shapes.map((shape) => shape.y + shape.height)
    );
    return bottomMostYValue >= height;
  },
};

export const isAtExtremity = (
  direction,
  { height, width },
  shapes,
  handlers = extremityHandlers
) => {
  return handlers[direction](shapes, height, width)
};

export const CANVAS_TYPE = "_canvas2D";

const clearShape = (
  { element },
  { width, height, oldX = 0, oldY = 0, x, y }
) => {
  const context = element.getContext("2d");
  context.clearRect(oldX, oldY, width, height);
  context.clearRect(x, y, width, height);
};

const fillShape = ({ element }, { width, height, color, x, y }) => {
  const context = element.getContext("2d");
  context.fillStyle = color ? color : "green";
  context.fillRect(x, y, width, height);
};

const drawOnCanvas = (canvas) => (shapes) => {
  // Remove from canvas
  for (let shape of shapes) {
    clearShape(canvas, shape);
  }
  // Draw in new position
  for (let shape of shapes) {
    fillShape(canvas, shape);
  }
};

const removeFromCanvas = (canvas) => (shapes) => {
  for (let shape of shapes) {
    clearShape(canvas, shape);
  }
};

export const intialiseCanvas = async (canvas, bus) => {
  await subscribeToEventBus(bus, CANVAS_DRAW, drawOnCanvas(canvas));
  await subscribeToEventBus(bus, CANVAS_REMOVE, removeFromCanvas(canvas));
};

export const new2DCanvas = (element) => ({
  _type: CANVAS_TYPE,
  element,
});
