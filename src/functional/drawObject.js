import {CANVAS_DRAW} from "../events/events";

const drawObject = ({eventBus, object: {shapes}}) => eventBus.publish(CANVAS_DRAW, shapes);

export default drawObject;
