import { newShape } from "../canvas/shape";

const moveObject = ({ object, deltaX, deltaY }) =>
  (object.shapes = object.shapes.map((s) => {
    const shape = newShape(
      s.x + deltaX,
      s.y + deltaY,
      s.width,
      s.height,
      s.color
    );
    shape.oldX = s.x;
    shape.oldY = s.y;
    return shape;
  }));

export default moveObject;
