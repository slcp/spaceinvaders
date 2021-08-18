// Lower levels will have a central rock protecting goodPlayer spawn point
// Higher levels will not have a central
// 1. Draw rock in the middle
// 2. Draw rock to left offset n
// 3. Draw rock to right offset -n
// 4. Draw rock to left offset n+1
// 5. Draw rock to right offset -n+1

import { checkForCollisions, moveBadShips, moveBullets, shootBadBullets } from ".";
import { runFrame } from "../animation";
import { newAnimationFrame } from "../animation/animationFrame";
import { BAD_SHIP_TYPE, newBadShip } from "../entitiies/badShip";
import { SHIP_TYPE } from "../entitiies/goodShip";
import { initialiseRock, newRock } from "../entitiies/rock";
import { publishToEventBus, subscribeToEventBus } from "../events";
import { BAD_SHIP_CREATED, BULLET_CREATED, END_GAME, NEW_GAME, RESPAWN_GOOD_SHIP, START_NEXT_LEVEL } from "../events/events";
import { asyncForEach } from "../functional/asyncArrayMethods";
import drawObject, { moveAndDrawObject } from "../functional/drawObject";
import moveObject from "../functional/moveObject";
import getSetting from "./getSetting";

// Repeat 2-5
export const initialiseRocks = async (bus, game, { width }) => {
  const canvasCentre = width / 2;
  const rockWidth = getSetting("rockWidth", game.level[game.currentLevelMode]);
  const numRocks = getSetting("numRocks", game.level[game.currentLevelMode]);
  const rockWhiteSpace = getSetting(
    "rockWhiteSpace",
    game.level[game.currentLevelMode]
  );
  const xValueOfMiddleRock = canvasCentre - rockWidth / 2;
  let rockPair = 1;

  for (let i = 0; i < numRocks; i++) {
    const rock = newRock(rockWidth);
    initialiseRock(rock, {
      rockParticleWidth: getSetting(
        "rockParticleWidth",
        game.level[game.currentLevelMode]
      ),
      rockParticleHeight: getSetting(
        "rockParticleHeight",
        game.level[game.currentLevelMode]
      ),
    });
    game.rocks = [...game.rocks, rock];
  }

  await asyncForEach(game.rocks, async (r, i) => {
    // First rock is in the middle
    if (i === 0) {
      await moveObject({ object: r, deltaX: xValueOfMiddleRock, deltaY: 0 });
    } else {
      // All other rocks are drawn in pairs with an equal offset but alternatig
      // between positive and negative.
      const offSet = i % 2 === 0 ? rockPair : -rockPair;

      // This works but I cannot remember why
      const deltaX =
        xValueOfMiddleRock +
        (offSet * rockWidth + offSet * rockWidth * rockWhiteSpace);
      await moveObject({ object: r, deltaX, deltaY: 0 });
      rockPair = i % 2 === 0 ? rockPair + 1 : rockPair;
    }
    await drawObject({ eventBus: bus, object: r });
  });
};

export const initialiseBadShips = async (bus, game) => {
  const shipsPerRow = getSetting(
    "badShipsPerRow",
    game.level[game.currentLevelMode]
  );
  const rows = getSetting("badShipRows", game.level[game.currentLevelMode]);

  for (let i = 0; i < rows; i++) {
    // Loop for number of rows required
    for (let j = 0; j < shipsPerRow; j++) {
      // Loop for ships required on each row
      const newShip = newBadShip();
      await moveAndDrawObject(
        bus,
        newShip,
        newShip.width * j + 5,
        newShip.height * i + 150
      ); // For initialise delta is set relative to 0, 0. newShip.width/height*j/i should offset from the previous ship and produce a gutter
      await publishToEventBus(bus, BAD_SHIP_CREATED, newShip);
    }
  }
};

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
