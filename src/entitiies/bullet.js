import { newShape } from "../canvas/shape";

// class Bullet extends Moveable {
//   constructor(owner, settings) {
//     super(settings);
//     this.shapes = [new Shape(0, 10, 4, 20)];
//     this.owner = owner;
//   }
// }

export const BULLET_TYPE = "_bullet";

export const newBullet = (ownerType) => ({
  shapes: [newShape(0, 10, 4, 20)],
  ownerType,
});

export default Bullet;
