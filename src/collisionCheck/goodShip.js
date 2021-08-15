import { publishToEventBus } from "../events";
import { GOOD_SHIP_KILLED_BY_BAD_BULLET } from "../events/events";
import { asyncForEach } from "../functional/asyncArrayMethods";
import { destroyObject } from "../game";
import { isBadShipBullet } from "../game/helpers";
import CollisionCheck from "./collision";

export const handleIfCollidingWithGoodShip = async (bus, game, bullet) => {
  const isBadShip = isBadShipBullet(bullet);
  if (!isBadShip) return false;

  const goodShipsHit = game.goodShips.filter((s) =>
    new CollisionCheck(bullet.shapes, s.shapes).isColliding()
  );
  if (!goodShipsHit.length) return false;

  await destroyObject(bus, game, bullet);
  await asyncForEach(goodShipsHit, async (s) => {
    await publishToEventBus(bus, GOOD_SHIP_KILLED_BY_BAD_BULLET, {
      id: s.id,
    });
    await destroyObject(bus, game, s);
  });

  return true;

  // TODO: Game was creating new good ship here but it should happen off an event...what event and where?
};
