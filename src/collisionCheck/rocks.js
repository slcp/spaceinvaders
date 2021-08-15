import { publishToEventBus } from "../events";
import {
  CANVAS_REMOVE,
  ROCK_SLICE_KILLED_BY_BAD_BULLET,
  ROCK_SLICE_KILLED_BY_GOOD_BULLET,
} from "../events/events";
import { asyncFilter } from "../functional/asyncArrayMethods";
import { destroyObject } from "../game";
import { isGoodShipBullet } from "../game/helpers";
import CollisionCheck from "./collision";

export const handleIfCollidingWithRock = async (bus, game, bullet) => {
  const rocksHit = game.rocks.filter((r) =>
    new CollisionCheck(bullet.shapes, r.shapes).isColliding()
  );
  if (!rocksHit.length) return false;

  await Promise.all(
    rocksHit.map(async (r) => {
      r.shapes = await asyncFilter(r.shapes, async (s) => {
        const hit = new CollisionCheck(bullet.shapes, s).isColliding();
        if (hit) await publishToEventBus(bus, CANVAS_REMOVE, [s]);
        return !hit;
      });
    })
  );

  await publishToEventBus(
    bus,
    isGoodShipBullet(bullet)
      ? ROCK_SLICE_KILLED_BY_GOOD_BULLET
      : ROCK_SLICE_KILLED_BY_BAD_BULLET,
    { id: bullet.id }
  );
  await destroyObject(bus, game, bullet);
  return true;
};
