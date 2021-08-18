import { publishToEventBus } from "../events";
import { CANVAS_DRAW } from "../events/events";
import moveObject from "./moveObject";

const drawObject = async ({ eventBus, object: { shapes } }) =>
  await publishToEventBus(eventBus, CANVAS_DRAW, shapes);

export const moveAndDrawObject = async (bus, object, deltaX, deltaY) => {
  moveObject({ object, deltaX, deltaY });
  await drawObject({ eventBus: bus, object });
};

export default drawObject;
