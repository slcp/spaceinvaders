import Moveable from './moveable';
import Shape from "../canvas/shape";

class Bullet extends Moveable {
  constructor(owner, settings) {
    super(settings);
    this.shapes = [new Shape(20, 10, 5, 20)];
    this.owner = owner;
  }
}

export default Bullet;
