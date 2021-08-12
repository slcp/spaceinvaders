import { publishToEventBus } from "../events";
import { CANVAS_DRAW } from "../events/events";
import moveObject from "./moveObject";

const drawObject = ({ eventBus, object: { shapes } }) =>
  publishToEventBus(eventBus, CANVAS_DRAW, shapes);

export const moveAndDrawObject = (bus, object, deltaX, deltaY) => {
  moveObject({ object, deltaX, deltaY });
  drawObject({ eventBus: bus, object });
};

export default drawObject;
