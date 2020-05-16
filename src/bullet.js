import Moveable from './moveable';

class Bullet extends Moveable {
  constructor(owner, settings) {
    super(settings);
    this.shapes = [
      {
        x: 20,
        y: 10,
        width: 2,
        height: 10,
      },
    ];
    this.owner = owner;
  }
}

export default Bullet;