// Lower levels will have a central rock protecting goodPlayer spawn point
// Higher levels will not have a central
// 1. Draw rock in the middle
// 2. Draw rock to left offset n
// 3. Draw rock to right offset -n
// 4. Draw rock to left offset n+1
// 5. Draw rock to right offset -n+1

import { newBadShip } from "../entitiies/badShip";
import { initialiseRock, newRock } from "../entitiies/rock";
import { publishToEventBus } from "../events";
import { BAD_SHIP_CREATED } from "../events/events";
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
      moveAndDrawObject(
        bus,
        newShip,
        newShip.width * j + 5,
        newShip.height * i + 150
      ); // For initialise delta is set relative to 0, 0. newShip.width/height*j/i should offset from the previous ship and produce a gutter
      publishToEventBus(bus, BAD_SHIP_CREATED, newShip);
    }
  }
};
