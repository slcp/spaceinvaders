import { newShape } from "../canvas/shape";
import { v4 as uuid } from 'uuid'

export const BULLET_TYPE = "_bullet";

export const newBullet = (ownerType) => ({
  _type: BULLET_TYPE,
  id: uuid(),
  shapes: [newShape(0, 10, 4, 20)],
  ownerType,
});
