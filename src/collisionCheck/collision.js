import { SHAPE_TYPE } from "../canvas/shape";

const isShape = (x) => x._type === SHAPE_TYPE;
const isArrayOfShapes = (x) => Array.isArray(x) && x.every((y) => isShape(y));

class CollisionCheck {
  // Must be initialised with each arg being a Shape or Array(Shape)
  constructor(obj1, obj2) {
    if (!isShape(obj1) && !isArrayOfShapes(obj1)) {
      throw new Error("collision object must be shapes or array of shapes");
    }
    this.obj1 = Array.isArray(obj1) ? obj1 : new Array(obj1);
    if (!isShape(obj2) && !isArrayOfShapes(obj2)) {
      throw new Error("collision object must be shapes or array of shapes");
    }
    this.obj2 = Array.isArray(obj2) ? obj2 : new Array(obj2);
  }

  isColliding() {
    for (let shape1 of this.obj1) {
      for (let shape2 of this.obj2) {
        if (this._checkForCollision(shape1, shape2)) {
          return true;
        }
      }
    }
    return false;
  }

  _checkForCollision(shape1, shape2) {
    return !(
      shape1.x > shape2.x + shape2.width ||
      shape1.x + shape1.width < shape2.x ||
      shape1.y > shape2.y + shape2.height ||
      shape1.y + shape1.height < shape2.y
    );
  }
}

export default CollisionCheck;
