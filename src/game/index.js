import GameAnimation, { runFrame } from "../animation";
import { newAnimationFrame } from "../animation/animationFrame";
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
import Rock, { ROCK_TYPE } from "../entitiies/rock";
import { publishToEventBus, subscribeToEventBus } from "../events";
import {
  BAD_SHIP_CREATED,
  BAD_SHIP_DESTROYED,
  BULLET_CREATED,
  BULLET_DESTROYED,
  CANVAS_REMOVE,
  END_GAME,
  GOOD_SHIP_DESTROYED,
  NEW_GAME,
  RESPAWN_GOOD_SHIP,
  START_NEXT_LEVEL,
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
  level: {},
});

export const initialiseGame = async (bus, game, context) => {
  await subscribeToEventBus(bus, NEW_GAME, () => {}); //this.newGame.bind(this));
  await subscribeToEventBus(bus, START_NEXT_LEVEL, () => {}); //this.nextLevel.bind(this));
  await subscribeToEventBus(bus, END_GAME, () => {}); //this.endGame.bind(this));
  await subscribeToEventBus(
    bus,
    RESPAWN_GOOD_SHIP,
    () => {} //this.respawnGoodShip.bind(this)
  );
  await subscribeToEventBus(bus, BULLET_CREATED, (bullet) => {
    game.bullets = [...game.bullets, bullet];
  });
  await subscribeToEventBus(bus, BAD_SHIP_CREATED, (ship) => {
    game.badShips = [...game.badShips, ship];
  });

  runFrame([
    newAnimationFrame(
      "moveGoodBullets",
      1000 /
        getSetting("goodBulletFramerate", game.level[game.currentLevelMode]),
      () => moveBullets(bus, game, SHIP_TYPE)
    ),
    newAnimationFrame(
      "shootBadBullets",
      1000 /
        getSetting(
          "badShipsBulletsPerSecond",
          game.level[game.currentLevelMode]
        ),
      () => shootBadBullets(bus, game)
    ),
    newAnimationFrame(
      "moveBadBullets",
      1000 /
        getSetting("badBulletFramerate", game.level[game.currentLevelMode]),
      () => moveBullets(bus, game, BAD_SHIP_TYPE)
    ),
    newAnimationFrame(
      "moveBadShips",
      1000 / getSetting("badShipFramerate", game.level[game.currentLevelMode]),
      () => moveBadShips(bus, game, context)
    ),
    newAnimationFrame(
      "checkForCollisions",
      // Run on every frame
      0,
      () => checkForCollisions(bus, game, context)
    ),
  ]);
};

export const startGame = async (bus, game, context) => {
  const { players } = this.context;
  // Game must be intialised first as it listens to other entity creation events
  await initialiseGame(bus, game, context);
  await initialiseBadShips(bus, game);
  game.goodShips = await asyncMap(players, async (id) => {
    const ship = newGoodShip({
      id,
    });
    await initialiseGoodShip(bus, ship);
    return ship;
  });
  await initialiseRocks(bus, game, context);
};

export const checkForCollisions = (bus, game, context) => {
  game.bullets.forEach((b) => {
    if (handleIfCollidingWithRock(bus, game, b)) return;
    if (handleIfCollidingWithBadShip(bus, game, b)) return;
    if (handleIfCollidingWithGoodShip(bus, game, b)) return;
    handleIfOutOfPlay(bus, game, context, b);
  });
};

export const handleIfOutOfPlay = async (
  bus,
  game,
  { height, width },
  object
) => {
  const { top, bottom } = isAtExtremity({ height, width }, object.shapes);
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

export const moveBadShips = (bus, game, { height, width }) => {
  const results = game.badShips.map(({ shapes }) =>
    isAtExtremity({ height, width }, shapes)
  );
  const left = results.some((r) => r.left === true);
  const right = results.some((r) => r.right === true);

  const deltaY = 10;
  const deltaX = left && !right ? 1 : -1;

  game.badShips.forEach((ship) => {
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
    (game.badShips = game.badShips.filter((s) => s.id !== ship.id)),
      await publishToEventBus(bus, BAD_SHIP_DESTROYED, { id: ship.id });
  },
  [ROCK_TYPE]: async (_, rock, game) => {
    game.rocks = game.rocks.filter((r) => r.id !== rock.id);
  },
  [BULLET_TYPE]: async (bus, bullet, game) => {
    game.bullets = game.bullets.filter((b) => b.id !== bullet.id);
    await publishToEventBus(bus, BULLET_DESTROYED, { id: bullet.id });
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

export default class SpaceInvadersGame {
  newGame() {
    this.endGame();
    this.level = this.levelData.next().value;
    this.startGame();
  }

  endGame() {
    this.destroyGoodShips();
    this.destroyRocks();
    this.destroyBullets();
    this.destroyBadShips();
    if (this.animation) {
      this.animation.cancel();
    }
  }

  startGame() {
    const { players } = this.context;
    this.initialiseBadShips();
    this.goodShips = players.map((id) =>
      newGoodShip({
        id,
      })
    );
    this.goodShips.forEach((ship) => this.initialiseGoodShip(ship));
    this.initialiseRocks();
    this.startAnimation();
  }

  startAnimation() {
    this.animation = new GameAnimation();
    this.animation.runFrame(this.frameActions);
  }

  // Keep for now - we will need to change levels
  nextLevel() {
    this.endGame();
    this.level = this.levelData.next().value;
    this.startGame();
  }

  destroyBadShips() {
    /*
     * destroyObject will modify this.badShips so that cannot be forEach-ed directly as it will be changing under us.
     * Creating a flat map of this.badShips allows us to iterate over the ships in the game and call destroyObject
     * on them
     */
    this.badShips.flat(Infinity).forEach((ship) => {
      this.destroyObject(ship);
    });
    this.badShips = [];
  }

  respawnGoodShip({ id }) {
    const ship = newGoodShip({ id });
    this.goodShips.push(ship);
    this.initialiseGoodShip(ship);
  }

  initialiseGoodShip(goodShip) {
    goodShip.init();
    // Draw in centre of canvas
    const { width, height } = this.context;
    this.moveAndDrawObject(
      goodShip,
      width / 2 - goodShip.width / 2,
      height - (goodShip.height + 10)
    );
  }

  destroyGoodShips() {
    for (let ship of this.goodShips) {
      this.destroyObject(ship);
    }
    this.goodShips = [];
  }

  // Lower levels will have a central rock protecting goodPlayer spawn point
  // Higher levels will not have a central
  // 1. Draw rock in the middle
  // 2. Draw rock to left offset n
  // 3. Draw rock to right offset -n
  // 4. Draw rock to left offset n+1
  // 5. Draw rock to right offset -n+1
  // Repeat 2-5
  initialiseRocks() {
    const { width } = this.context;
    const canvasCentre = width / 2;
    const xValueOfMiddleRock = canvasCentre - this.getSetting("rockWidth") / 2;
    let rockPair = 1;

    for (let i = 0; i < this.getSetting("numRocks"); i++) {
      let rock = new Rock(
        this.getSetting("rockWidth"),
        this.getSettingsFor("rock")
      );

      // First rock is in the middle
      if (i === 0) {
        rock.move(xValueOfMiddleRock, 0);
      } else {
        // All other rocks are drawn in pairs with an equal offset but alternatig
        // between positive and negative.
        const offSet = i % 2 === 0 ? rockPair : -rockPair;

        // This works but I cannot remember why
        const deltaX =
          xValueOfMiddleRock +
          (offSet * this.getSetting("rockWidth") +
            offSet *
              this.getSetting("rockWidth") *
              this.getSetting("rockWhiteSpace"));
        rock.move(deltaX, 0);
        rockPair = i % 2 === 0 ? rockPair + 1 : rockPair;
      }

      this.rocks.push(rock);
      this.drawObject(rock);
    }
  }

  destroyRocks() {
    /*
     * destroyObject will modify this.rocks so that cannot be forEach-ed directly as it will be changing under us.
     * Creating a flat map of this.rocks allows us to iterate over the rocks in the game and call destroyObject
     * on them
     */
    this.rocks.flat(Infinity).forEach((rock) => {
      this.destroyObject(rock);
    });
    this.rocks = [];
  }

  destroyBullets() {
    /*
     * destroyObject will modify this.bullets so that cannot be forEach-ed directly as it will be changing under us.
     * Creating a map of this.bullets allows us to iterate over the rocks in the game and call destroyObject
     * on them
     */
    this.bullets
      .map((b) => b)
      .forEach((rock) => {
        this.destroyObject(rock);
      });
    this.bullets = [];
  }
}
