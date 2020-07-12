import Moveable from './moveable';
import Shape from "../canvas/shape";

class Bullet extends Moveable {
  constructor(owner, settings) {
    super(settings);
    this.shapes = [new Shape(0, 10, 4, 20)];
    this.owner = owner;
  }
}

export default Bullet;
