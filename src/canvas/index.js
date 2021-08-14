import { subscribeToEventBus } from "../events";
import { CANVAS_DRAW, CANVAS_REMOVE } from "../events/events";

export const isAtExtremity = ({ height, width }, shapes) => {
  const extremities = {
    left: null,
    right: null,
    top: null,
    bottom: null,
  };
  const leftMostXValue = Math.floor(...shapes.map((shape) => shape.x));
  extremities.left = leftMostXValue <= 0;

  const rightMostXValue = Math.max(
    ...shapes.map((shape) => shape.x + shape.width)
  );
  extremities.right = rightMostXValue >= width;

  const topMostYValue = Math.floor(...shapes.map((shape) => shape.y));
  extremities.top = topMostYValue <= 0;

  const bottomMostYValue = Math.max(
    ...shapes.map((shape) => shape.y + shape.height)
  );
  extremities.bottom = bottomMostYValue >= height;

  return extremities;
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
