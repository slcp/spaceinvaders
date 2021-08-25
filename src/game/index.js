import { isAtExtremity } from "../canvas";
import { handleIfCollidingWithBadShip } from "../collisionCheck/badShip";
import { handleIfCollidingWithGoodShip } from "../collisionCheck/goodShip";
import { handleIfCollidingWithRock } from "../collisionCheck/rocks";
import { BAD_SHIP_TYPE } from "../entitiies/badShip";
import { BULLET_TYPE, fireBullet } from "../entitiies/bullet";
import {
  initialiseGoodShip,
  newGoodShip,
  SHIP_TYPE,
} from "../entitiies/goodShip";
import { ROCK_TYPE } from "../entitiies/rock";
import { publishToEventBus } from "../events";
import {
  BAD_SHIP_DESTROYED,
  BULLET_DESTROYED,
  CANVAS_REMOVE,
  GOOD_SHIP_DESTROYED,
} from "../events/events";
import { asyncForEach, asyncMap } from "../functional/asyncArrayMethods";
import { moveAndDrawObject } from "../functional/drawObject";
import levelsGenerator from "../levels";
import { getRandomInt } from "../levels/generators";
import getSetting from "./getSetting";
import { isBadShipBullet, isGoodShipBullet } from "./helpers";
import { initialiseBadShips, initialiseRocks } from "./initialise";

// TOOD: Build canvas operations that in an animation frame into the frame queue - killing objects

const levelGen = levelsGenerator();

export const newGame = () => ({
  // The bad ships that are in play
  badShips: [],
  // The good ships (or players) that in play
  goodShips: [],
  // The bullets that in play
  bullets: [],
  // The rocks that are in play
  rocks: [],
  // The current game mode - what is game mode?
  currentLevelMode: "standard",
  level: levelGen.next().value,
});

export const spawnGoodShip = async (bus, id, { width, height }) => {
  const ship = newGoodShip(id);
  await moveAndDrawObject(
    bus,
    ship,
    width / 2 - ship.width / 2,
    height - (ship.height + 10)
  );
  await initialiseGoodShip(bus, ship);
  return ship;
};

export const startGame = async (bus, game, context) => {
  const { players } = context;
  await initialiseBadShips(bus, game);
  game.goodShips = await asyncMap(
    players,
    async (id) => await spawnGoodShip(bus, id, context)
  );
  await initialiseRocks(bus, game, context);
};

export const checkForCollisions = async (bus, game, context) => {
  await asyncForEach(game.bullets, async (b) => {
    handleIfOutOfPlay(bus, game, context, b); // TODO: Why does this work if done first
    if (await handleIfCollidingWithRock(bus, game, b)) return;
    if (await handleIfCollidingWithBadShip(bus, game, b)) return;
    if (await handleIfCollidingWithGoodShip(bus, game, b)) return;
  });
};

export const handleIfOutOfPlay = async (
  bus,
  game,
  { height, width },
  object
) => {
  const top = isAtExtremity("top", { height, width }, object.shapes);
  const bottom = isAtExtremity("bottom", { height, width }, object.shapes);
  if (!top && !bottom) return;
  await destroyObject(bus, game, object);
};

export const shootBadBullets = (bus, game) => {
  const rate = getSetting(
    "badShipsBulletsPerSecond",
    game.level[game.currentLevelMode]
  );
  for (let i = 1; i <= rate; i++) {
    const shipIndex = getRandomInt({ max: game.badShips.length - 1 });
    const ship = game.badShips[shipIndex];
    // badShip may have already been destrosyed
    if (ship) fireBullet(bus, ship);
  }
};

let direction = null;

export const moveBadShips = async (bus, game, { height, width }) => {
  const left = game.badShips.some((r) =>
    isAtExtremity("left", { height, width }, r.shapes)
  );
  const right = game.badShips.some((r) =>
    isAtExtremity("right", { height, width }, r.shapes)
  );

  if (left) direction = "right";
  if (right) direction = "left";

  const deltaY = left || right ? 10 : 0;
  const deltaX = direction === "right" ? 1 : -1;

  await asyncForEach(game.badShips, (ship) => {
    moveAndDrawObject(bus, ship, deltaX, deltaY);
  });
};

const bulletMoveHandlers = {
  [BAD_SHIP_TYPE]: async (bus, game) =>
    await asyncForEach(
      game.bullets.filter((bullet) => isBadShipBullet(bullet)),
      // Move the bullet down the screen
      async (bullet) => moveAndDrawObject(bus, bullet, 0, 5)
    ),
  [SHIP_TYPE]: async (bus, game) =>
    await asyncForEach(
      game.bullets.filter((bullet) => isGoodShipBullet(bullet)),
      // Move the bullet up the screen
      async (bullet) => moveAndDrawObject(bus, bullet, 0, -5)
    ),
};

export const moveBullets = async (
  bus,
  game,
  ownerType,
  handlers = bulletMoveHandlers
) => {
  if (!handlers[ownerType]) {
    throw new Error("unknon ship type when trying to move bullets");
  }
  await handlers[ownerType](bus, game);
};

const objectDestroyHandlers = {
  [SHIP_TYPE]: async (bus, ship, game) => {
    game.goodShips = game.goodShips.filter((s) => {
      return s.id !== ship.id;
    });
    await publishToEventBus(bus, GOOD_SHIP_DESTROYED, { id: ship.id });
  },
  [BAD_SHIP_TYPE]: async (bus, ship, game) => {
    game.badShips = game.badShips.filter((s) => s.id !== ship.id);
    await publishToEventBus(bus, BAD_SHIP_DESTROYED, { id: ship.id });
  },
  [ROCK_TYPE]: async (_, rock, game) => {
    game.rocks = game.rocks.filter((r) => r.id !== rock.id);
  },
  [BULLET_TYPE]: async (bus, bullet, game) => {
    game.bullets = game.bullets.filter((b) => b.id !== bullet.id);
    await publishToEventBus(bus, BULLET_DESTROYED, bullet);
  },
};

export const destroyObject = async (
  bus,
  game,
  object,
  handlers = objectDestroyHandlers
) => {
  const { _type } = object;
  if (!handlers[_type]) {
    throw new Error("unknon object type when trying to destory object");
  }
  await publishToEventBus(bus, CANVAS_REMOVE, object.shapes);
  await handlers[_type](bus, object, game);
};

// export default class SpaceInvadersGame {
//   newGame() {
//     this.endGame();
//     this.level = this.levelData.next().value;
//     this.startGame();
//   }

//   endGame() {
//     this.destroyGoodShips();
//     this.destroyRocks();
//     this.destroyBullets();
//     this.destroyBadShips();
//     if (this.animation) {
//       this.animation.cancel();
//     }
//   }

//   // Keep for now - we will need to change levels
//   nextLevel() {
//     this.endGame();
//     this.level = this.levelData.next().value;
//     this.startGame();
//   }

//   destroyBadShips() {
//     /*
//      * destroyObject will modify this.badShips so that cannot be forEach-ed directly as it will be changing under us.
//      * Creating a flat map of this.badShips allows us to iterate over the ships in the game and call destroyObject
//      * on them
//      */
//     this.badShips.flat(Infinity).forEach((ship) => {
//       this.destroyObject(ship);
//     });
//     this.badShips = [];
//   }

//   respawnGoodShip({ id }) {
//     const ship = newGoodShip({ id });
//     this.goodShips.push(ship);
//     this.initialiseGoodShip(ship);
//   }

//   destroyGoodShips() {
//     for (let ship of this.goodShips) {
//       this.destroyObject(ship);
//     }
//     this.goodShips = [];
//   }

//   destroyRocks() {
//     /*
//      * destroyObject will modify this.rocks so that cannot be forEach-ed directly as it will be changing under us.
//      * Creating a flat map of this.rocks allows us to iterate over the rocks in the game and call destroyObject
//      * on them
//      */
//     this.rocks.flat(Infinity).forEach((rock) => {
//       this.destroyObject(rock);
//     });
//     this.rocks = [];
//   }

//   destroyBullets() {
//     /*
//      * destroyObject will modify this.bullets so that cannot be forEach-ed directly as it will be changing under us.
//      * Creating a map of this.bullets allows us to iterate over the rocks in the game and call destroyObject
//      * on them
//      */
//     this.bullets
//       .map((b) => b)
//       .forEach((rock) => {
//         this.destroyObject(rock);
//       });
//     this.bullets = [];
//   }
// }
