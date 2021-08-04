import { newShape } from "../canvas/shape";

export const BULLET_TYPE = "_bullet";

export const newBullet = (ownerType) => ({
  _type: BULLET_TYPE,
  shapes: [newShape(0, 10, 4, 20)],
  ownerType,
});
