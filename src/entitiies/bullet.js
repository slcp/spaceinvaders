import { v4 as uuid } from "uuid";
import { newShape } from "../canvas/shape";
import { publishToEventBus } from "../events";
import { BULLET_CREATED } from "../events/events";
import drawObject from "../functional/drawObject";
import moveObject from "../functional/moveObject";

export const BULLET_TYPE = "_bullet";

export const fireBullet = (bus, { id, _type, bulletInPlay, shapes }) => {
  if (!bulletInPlay /* || settings.continuousFire*/) {
    const bullet = newBullet(_type, id);
    const xValues = shapes.map((shape) => shape.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const deltaX =
      Math.max(...xValues) + shapes.find((s) => s.x === maxX).width;
    const diff = deltaX - minX;
    moveObject({
      object: bullet,
      // TODO: This assumes the bullet has one shape, will need a way to get bullets width
      deltaX: minX + diff / 2 - bullet.shapes[0].width / 2,
      deltaY: Math.min(...shapes.map((shape) => shape.y)),
    });
    drawObject({ eventBus: bus, object: bullet });
    publishToEventBus(bus, BULLET_CREATED, bullet);
  }
};

export const newBullet = (ownerType, ownerId) => ({
  _type: BULLET_TYPE,
  id: uuid(),
  shapes: [newShape(0, 10, 4, 20)],
  ownerType,
  ownerId,
});
