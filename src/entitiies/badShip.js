import { newShape } from "../canvas/shape";
import { subscribeToEventBus } from "../events";
import { BULLET_CREATED, BULLET_DESTROYED } from "../events/events";
import { newShip } from "./ship";

export const BAD_SHIP_TYPE = "_badShip";

export const initialiseBadShip = async (bus, badShip) => {
  await subscribeToEventBus(bus, BULLET_CREATED, (bullet) => {
    if (bullet.ownerId != badShip.id || bullet.ownerType != badShip._type) {
      return;
    }
    badShip.bulletInPlay = true;
    badShip.bullet = bullet;
  });
  await subscribeToEventBus(bus, BULLET_DESTROYED, (bullet) => {
    if (bullet.ownerId != badShip.id || bullet.ownerType != badShip._type) {
      return;
    }
    badShip.bulletInPlay = false;
    badShip.bullet = null;
  });
};

export const newBadShip = () => ({
  ...newShip(),
  _type: BAD_SHIP_TYPE,
  shapes: [
    newShape(20, 32, 60, 9, "white"),
    newShape(40, 28, 20, 20, "white"),
    newShape(20, 20, 12, 20, "white"),
    newShape(68, 20, 12, 20, "white"),
  ],
});
