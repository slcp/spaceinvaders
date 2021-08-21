import { publishToEventBus } from "../events";
import { BAD_SHIP_KILLED_BY_GOOD_BULLET } from "../events/events";
import { asyncForEach } from "../functional/asyncArrayMethods";
import { destroyObject } from "../game";
import { isGoodShipBullet } from "../game/helpers";
import CollisionCheck from "./collision";

export const handleIfCollidingWithBadShip = async (bus, game, bullet) => {
  const isGoodShip = isGoodShipBullet(bullet);
  if (!isGoodShip) return false;

  const badShipsHit = game.badShips.filter((s) =>
    new CollisionCheck(bullet.shapes, s.shapes).isColliding()
  );

  if (!badShipsHit.length) return false;

  await destroyObject(bus, game, bullet);
  await asyncForEach(badShipsHit, async (s) => {
    await publishToEventBus(bus, BAD_SHIP_KILLED_BY_GOOD_BULLET, {
      id: bullet.ownerId,
      remainingShipCount: game.badShips.length ? game.badShips.length - 1 : 0,
    });
    await destroyObject(bus, game, s);
  });
  return true;
};
