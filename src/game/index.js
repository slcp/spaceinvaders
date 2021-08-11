import GameAnimation from "../animation";
import { newAnimationFrame } from "../animation/animationFrame";
import Canvas2D from "../canvas";
import CollisionCheck from "../collisionCheck/collision";
import BadShip from "../entitiies/badShip";
import Bullet, { BULLET_TYPE } from "../entitiies/bullet";
import GoodShip, { newGoodShip } from "../entitiies/goodShip";
import Rock, { ROCK_TYPE } from "../entitiies/rock";
import {
  BAD_SHIP_KILLED_BY_GOOD_BULLET,
  BULLET_CREATED,
  CANVAS_REMOVE,
  END_GAME,
  GOOD_SHIP_KILLED_BY_BAD_BULLET,
  NEW_GAME,
  RESPAWN_GOOD_SHIP,
  ROCK_SLICE_KILLED_BY_BAD_BULLET,
  ROCK_SLICE_KILLED_BY_GOOD_BULLET,
  START_NEXT_LEVEL,
} from "../events/events";
import drawObject from "../functional/drawObject";
import moveObject from "../functional/moveObject";
import levelsGenerator from "../levels";
import { getRandomInt } from "../levels/generators";
import getSetting, { getSettingFor } from "./getSetting";
import { isBadShipBullet, isGoodShipBullet } from "./helpers";

// TOOD: Build canvas operations that in an animation frame into the frame queue - killing objects

const levelGen = levelsGenerator();

export const initialiseGame = (bus, game) => {
  subscribeToEventBus(bus, NEW_GAME, this.newGame.bind(this));
  subscribeToEventBus(bus, START_NEXT_LEVEL, this.nextLevel.bind(this));
  subscribeToEventBus(bus, END_GAME, this.endGame.bind(this));
  subscribeToEventBus(bus, RESPAWN_GOOD_SHIP, this.respawnGoodShip.bind(this));
  subscribeToEventBus(bus, BULLET_CREATED, (bullet) => {
    game.bullets = [...game.bullets, bullet];
  });

  newAnimationFrame(
    "moveGoodBullets",
    1000 / getSetting("goodBulletFramerate", game.level[currentLevelMode]),
    () => this.moveBullets("goodShip")
  );
  newAnimationFrame(
    "shootBadBullets",
    1000 / getSetting("badShipsBulletsPerSecond", game.level[currentLevelMode]),
    () => this.shootBadBullets()
  );
  newAnimationFrame(
    "moveBadBullets",
    1000 / getSetting("badBulletFramerate", game.level[currentLevelMode]),
    () => this.moveBullets("badShip")
  );
  newAnimationFrame(
    "moveBadShips",
    1000 / getSetting("badShipFramerate", game.level[currentLevelMode]),
    () => this.moveBadShips()
  );
  newAnimationFrame(
    "checkForCollisions",
    // Run on every frame
    0,
    () => this.checkForCollisions()
  );
};

export const newGame = () => ({
  // The bad ships that are in play
  badShips: [],
  // The good ships (or players) that in play
  goodShips: [],
  // The bullets that in play
  bullets: [], // TODO: Subscribe to BULLET_CREATED event
  // The rocks that are in play
  rocks: [],
  // The current game mode - what is game mode?
  currentLevelMode: "standard",
  level: {},
});

const objectDestroyHandlers = {
  [SHIP_TYPE]: (bus, ship, game) => {
    // TODO: Publish event for killed ship, good ship should subscribe and destroy itself
    game.goodShips.filter((s) => s.id !== ship.id);
  },
  [BAD_SHIP_TYPE]: (bus, ship, game) =>
    game.badShips.map((r) => r.filter((s) => s.id !== ship.id)),
  [ROCK_TYPE]: (bus, rock, game) => game.rocks.filter((r) => r.id !== rock.id),
  [BULLET_TYPE]: (bus, bullet, game) => {
    // TODO: Replace with event and subscriptions for owners
    // object.owner.bulletInPlay = false;
    // object.owner.bullet = null;
    game.bullets.filter((b) => b.id !== bullet.id);
  },
};

export const destroyObject = (bus, game, object, handlers = objectDestroyHandlers) => {
  const { _type, shapes } = object;
  publishToEventBus(bus, CANVAS_REMOVE, object.shapes);
  handlers[_type](bus, object, game);
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

  // TODO: How to handle the movement of the good ship.
  // Run a counter of moves for the good ship and move them, all at once? Need a framerate?
  //   - Max moves for goodship per frame = 1 so just need bool for key press -> move
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

  drawObject(object) {
    drawObject({ eventBus: this.eventBus, object });
  }

  moveAndDrawObject(object, deltaX, deltaY) {
    moveObject({ object, deltaX, deltaY });
    this.drawObject(object);
  }

  isColliding(object1, object2) {
    return new CollisionCheck(object1.shapes, object2.shapes).isColliding();
  }

  // TODO: I think all events will get fired from here
  checkForCollisions() {
    for (let bullet of this.bullets) {
      let collision = false;

      for (let rock of this.rocks) {
        if (!this.isColliding(bullet, rock)) continue;

        // bullet + rock colliding
        let shape = rock.findDamageFrom(bullet);
        if (!shape) {
          throw new Error("something has gone wrong, check the logging");
        }
        this.eventBus.publish(
          bullet.owner instanceof GoodShip
            ? ROCK_SLICE_KILLED_BY_GOOD_BULLET
            : ROCK_SLICE_KILLED_BY_BAD_BULLET,
          bullet.owner instanceof GoodShip && { id: bullet.owner.id }
        );
        this.destroyObject(bullet);
        this.eventBus.publish(CANVAS_REMOVE, [shape]);
        collision = true;
        break;
      }
      if (collision) {
        continue;
      }

      for (let row of this.badShips) {
        for (let badShip of row) {
          if (this.isColliding(bullet, badShip)) {
            if (bullet.owner instanceof BadShip) {
              this.drawObject(badShip);
              continue;
            } else if (bullet.owner instanceof GoodShip) {
              // goodShip bullet + badShip colliding
              this.destroyObject(badShip);
              this.destroyObject(bullet);
              this.eventBus.publish(BAD_SHIP_KILLED_BY_GOOD_BULLET, {
                id: bullet.owner.id,
                remainingShipCount: this.badShips.flat(Infinity).length,
              });
            }
            collision = true;
            break;
          } else {
            continue;
          }
        }
        if (collision) {
          break;
        }
      }

      if (collision) {
        continue;
      }

      for (let goodShip of this.goodShips) {
        if (this.isColliding(bullet, goodShip)) {
          if (bullet.owner instanceof BadShip) {
            // badShip bullet + goodShip colliding
            this.eventBus.publish(GOOD_SHIP_KILLED_BY_BAD_BULLET, {
              id: goodShip.id,
            });
            this.destroyObject(bullet);
            this.destroyObject(goodShip);

            if (!goodShip.isDead()) {
              this.initialiseGoodShip(goodShip);
            } else {
            }
          } else if (bullet.owner instanceof GoodShip) {
            // do nothing - this shouldn't be possible
            this.drawObject(goodShip);
            continue;
          }
          collision = true;
          break;
        } else {
          continue;
        }
      }

      if (collision) {
        continue;
      }

      const { height, width } = this.context;
      if (
        Canvas2D.isAtExtremity({ height, width }, "top", bullet.shapes) ||
        Canvas2D.isAtExtremity({ height, width }, "bottom", bullet.shapes)
      ) {
        this.destroyObject(bullet);
      }
    }

    for (let row of this.badShips) {
      for (let badShip of row) {
        for (let rock of this.rocks) {
          if (this.isColliding(badShip, rock)) {
            // badShip + rock colliding
            // damage rock precisely where positions intersect
          } else {
            continue;
          }
        }
      }
    }
  }

  // Draw a grid of badShips
  initialiseBadShips() {
    const settings = getSettingFor("badShip", level[this.currentLevelMode]);
    const shipsPerRow = this.getSetting("badShipsPerRow");
    for (let i = 0; i < this.getSetting("badShipRows"); i++) {
      // Loop for number of rows required
      this.badShips[i] = []; // Initialise row in array
      for (let j = 0; j < shipsPerRow; j++) {
        // Loop for ships required on each row
        let newShip = new BadShip(this, settings);
        this.moveAndDrawObject(
          newShip,
          newShip.width * j + 5,
          newShip.height * i + 150
        ); // For initialise delta is set relative to 0, 0. newShip.width/height*j/i should offset from the previous ship and produce a gutter
        this.badShips[i].push(newShip);
      }
    }
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

  moveBadShips() {
    for (let row of this.badShips) {
      // As badShips are destroyed rows become empty.
      if (row.length) {
        const { height, width } = this.context;
        const firstShip = row[0];
        const lastShip = row[row.length - 1];
        let deltaX,
          deltaY = 0;

        // Ships have hit left edge of canvas, deltaX needs to be +1
        if (
          Canvas2D.isAtExtremity({ height, width }, "left", firstShip.shapes)
        ) {
          this.badShipDirection = "right";
          deltaY = 10;
          // Ships have hit right side of canvas, deltaX needs to be -1
        } else if (
          Canvas2D.isAtExtremity({ height, width }, "right", lastShip.shapes)
        ) {
          this.badShipDirection = "left";
          deltaY = 10;
        }

        deltaX = this.badShipDirection === "right" ? 1 : -1;

        row.forEach((ship) => {
          this.moveAndDrawObject(ship, deltaX, deltaY);
        });
      }
    }
  }

  moveBullets(ownerType) {
    switch (ownerType) {
      case "badShip":
        this.bullets
          .filter((bullet) => isBadShipBullet(bullet))
          // Move the bullet down the screen
          .forEach((bullet) => this.moveAndDrawObject(bullet, 0, 5));
        break;
      case "goodShip":
        this.bullets
          .filter((bullet) => isGoodShipBullet(bullet))
          // Move the bullet up the screen
          .forEach((bullet) => this.moveAndDrawObject(bullet, 0, -5));
        break;
      default:
        break;
    }
  }

  // shoot bullets from X random bad ships
  shootBadBullets() {
    for (let i = 1; i <= this.getSetting("badShipsBulletsPerSecond"); i++) {
      let rowIndex = getRandomInt({ max: this.badShips.length - 1 });
      let shipIndex = getRandomInt({ max: this.badShips[rowIndex].length - 1 });
      let ship = this.badShips[rowIndex][shipIndex];
      // badShip may have already been destroyed
      if (ship) ship.fireBullet();
    }
  }
}
