import BadShip from "../badShip";
import Bullet from "../bullet";
import Canvas from "../canvas";
import GoodShip from "../goodShip";
import levels from "../levels";
import Rock from "../rock";
import GameAnimation from "./animation";
import getSetting, { getSettingFor } from "./getSetting";
import { isBadShipBullet, isGoodShipBullet } from "./helpers";

export default class SpaceInvadersGame {
  constructor(canvasId) {
    // The canvas take is responsible for drawing the game
    this.canvas = new Canvas(canvasId);
    // TOOD: Document
    this.gameIntervals = [];
    // The bad ships that are in play
    this.badShips = [];
    // The good ships (or players) that in play
    this.players = [];
    // The bullets that in play
    this.bullets = [];
    // The rocks that are in play
    this.rocks = [];
    // The game level being played
    this.currentLevel = 0;
    // The current game mode - what is game mode?
    this.currentLevelMode = "standard";
    // Configuration for game levels
    this.levelData = [...levels];

    this.frameActions = [
      {
        id: Symbol("moveGoodBullets"),
        ms: 1000 / this.getSetting("goodBulletFramerate"),
        action: () => this.moveBullets("goodShip"),
      },
      {
        id: Symbol("shootBadBullets"),
        ms: 1000,
        action: () => this.shootBadBullets(),
      },
      {
        id: Symbol("moveBadBullets"),
        ms: 1000 / this.getSetting("badBulletFramerate"),
        action: () => this.moveBullets("badShip"),
      },
      {
        id: Symbol("moveBadShips"),
        ms: 1000 / this.getSetting("badShipFramerate"),
        action: () => this.moveBadShips(),
      },
      {
        id: Symbol("checkForCollisions"),
        // Run on every frame
        ms: 0,
        action: () => this.checkForCollisions(),
      },
    ];

    // METHODS
    // this.newGame = newGame.bind(this);
  }

  getSetting(setting) {
    return getSetting(
      setting,
      this.levelData[this.currentLevel][this.currentLevelMode]
    );
  }

  getSettingsFor(objectType) {
    return getSettingFor(
      objectType,
      this.levelData[this.currentLevel][this.currentLevelMode]
    );
  }

  newGame() {
    this.endGame();
    this.gameState = "NEW_GAME";
    this.players.push(new GoodShip(this, this.getSettingsFor("goodShip")));
    this.startGame();
  }

  endGame() {
    // this.clearGameIntervals();
    this.destroyGoodShips();
    this.destroyRocks();
    this.destroyBullets();
    this.destroyBadShips();
  }

  startGame() {
    this.gameState = "START_GAME";
    this.initialiseBadShips();
    for (let goodShip of this.players) {
      this.initialiseGoodShip(goodShip);
    }
    this.initialiseRocks();
    this.runGame();
  }

  gameWon() {
    // this.clearGameIntervals();
    this.destroyBullets();
    this.setGameMessage();
  }

  // TODO: How to handle the movement of the good ship.
  // Run a counter of moves for the good ship and move them, all at once? Need a framerate?
  //   - Max moves for goodship per frame = 1 so just need bool for key press -> move
  startAnimation() {
    // Pass in a callback to the game to check game state on each frame
    // The frame can you use this to know when to stop animating
    // The game can use this to know when the animation is stopped and game status needs to be managed
    const animation = new GameAnimation();
    window.requestAnimationFrame((frameStartTime) =>
      animation.runFrame(frameStartTime, this.frameActions, () =>
        this.checkGameState()
      )
    );
  }

  checkGameState() {
    switch (this.gameState) {
      case "LEVEL_WON":
        if (this.currentLevel === this.levelData.length - 1) {
          this.gameState = "GAME_WON";
          this.gameWon();
          // Should cancel animation
          return true;
          // Check highscore status
        } else {
          this.nextLevel();
          // Should cancel animation
          return true;
        }

      case "PLAYER_DEAD":
        break;

      default:
        break;
    }
  }

  runGame() {
    this.gameState = "GAME_RUNNING";
    this.startAnimation();
  }

  nextLevel() {
    this.gameState = "NEXT_LEVEL";
    this.currentLevel++;
    this.setGameMessage();
    this.endGame();
    setTimeout(() => {
      this.clearGameMessage();
      this.startGame();
    }, 5000);
  }

  clearGameIntervals() {
    for (let interval of this.gameIntervals) {
      clearInterval(interval);
    }
  }

  setGameMessage() {
    switch (this.gameState) {
      case "GAME_WON":
        gameMessage.textContent = "Well done, you have won!";
        break;

      case "NEXT_LEVEL":
        gameMessage.textContent = `Level ${this.currentLevel + 1}`;
        break;
    }
  }

  clearGameMessage() {
    gameMessage.textContent = "";
  }

  updateScore(player, delta) {
    player.updateScore(delta);
    score.textContent = player.score;
  }

  moveObject(object, deltaX, deltaY) {
    object.move(deltaX, deltaY);
  }

  drawObject(object) {
    let shapes = object.shapes;
    if (object instanceof Rock) {
      object.getShapes();
    }
    this.canvas.draw(shapes);
  }

  destroyObject(object) {
    switch (true) {
      // Rocks damage themselves - this will remove an entire rock from the game
      case object instanceof Rock:
        this.canvas.remove(object.shapes);

        if (this.gameState == "GAME_RUNNING") {
          let rockIndex = this.rocks.indexOf(object);
          this.rocks.splice(rockIndex, 1);
        }
        break;

      case object instanceof Bullet:
        this.canvas.remove(object.shapes);
        object.owner.bulletInPlay = false;
        object.owner.bullet = "";

        if (this.gameState === "GAME_RUNNING") {
          let bulletIndex = this.bullets.indexOf(object);
          this.bullets.splice(bulletIndex, 1);
        }
        break;

      case object instanceof BadShip:
        this.canvas.remove(object.shapes);
        // Find badShip in this.badShips and remove
        for (let i = 0; i < this.badShips.length; i++) {
          if (this.badShips[i].indexOf(object) >= 0) {
            if (this.gameState === "GAME_RUNNING") {
              let badShipIndex = this.badShips[i].indexOf(object);
              this.badShips[i].splice(badShipIndex, 1);
            }
            break;
          }
        }
        break;

      case object instanceof GoodShip:
        switch (this.gameState) {
          case "GAME_WON":
            break;

          case "LEVEL_WON":
            break;

          case "GAME_RUNNING":
            this.canvas.remove(object.shapes);
            object.destroy();
            let goodShipIndex = this.players.indexOf(object);
            this.players.splice(goodShipIndex, 1);
            break;

          default:
            break;
        }
    }
  }

  testCollision() {
    let testShip = new GoodShip(this, this.getSettingsFor("goodShip"));
    this.moveObject(testShip, 0, 125);
    this.drawObject(testShip);
    this.isColliding(testShip, this.players[0]);
  }

  isColliding(object1, object2) {
    let colliding = false;

    for (let i = 0; i < object1.shapes.length; i++) {
      for (let j = 0; j < object2.shapes.length; j++) {
        if (
          !(
            object1.shapes[i].x >
              object2.shapes[j].x + object2.shapes[j].width ||
            object1.shapes[i].x + object1.shapes[i].width <
              object2.shapes[j].x ||
            object1.shapes[i].y >
              object2.shapes[j].y + object2.shapes[j].height ||
            object1.shapes[i].y + object1.shapes[i].height < object2.shapes[j].y
          )
        ) {
          colliding = true;
          break;
        }
      }
      if (colliding) {
        break;
      }
    }

    return colliding;
  }

  checkForCollisions() {
    for (let bullet of this.bullets) {
      let collision = false;

      // TODO: Rocks only (visibly) take damage after 5 hits - why?????
      for (let rock of this.rocks) {
        if (!this.isColliding(bullet, rock)) {
          continue;
        }
        // bullet + rock colliding
        let shape = rock.findDamageFrom(bullet);
        if (!shape) {
          throw new Error("something has gone wrong, check the logging");
        }
        this.destroyObject(bullet);
        this.canvas.remove([shape]);
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
              this.updateScore(bullet.owner, 100);

              let badShipCount = 0;
              for (row of this.badShips) {
                badShipCount += row.length;
              }

              this.gameState =
                badShipCount === 0 ? "LEVEL_WON" : this.gameState;
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

      for (let goodShip of this.players) {
        if (this.isColliding(bullet, goodShip)) {
          if (bullet.owner instanceof BadShip) {
            // badShip bullet + goodShip colliding
            this.destroyObject(goodShip);
            this.destroyObject(bullet);

            goodShip.loseLife();

            if (!goodShip.isDead()) {
              this.initialiseGoodShip(goodship);
            } else {
              this.gameState = "PLAYER_DEAD";
            }
          } else if (bullet.owner instanceof GoodShip) {
            // do nothing - this shouldnt be possible
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

      if (
        this.canvas.isAtExtremity("top", bullet.shapes) ||
        this.canvas.isAtExtremity("bottom", bullet.shapes)
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
    for (let i = 0; i < this.getSetting("badShipRows"); i++) {
      // Loop for number of rows required
      this.badShips[i] = []; // Initialise row in array
      for (let j = 0; j < this.getSetting("badShipsPerRow"); j++) {
        // Loop for ships required on each row
        let newShip = new BadShip(this, this.getSettingsFor("badShip"));
        this.moveObject(
          newShip,
          newShip.width * j + 5,
          newShip.height * i + 150
        ); // For initialise delta is set relative to 0, 0. newShip.width/height*j/i should offset from the previous ship and produce a gutter
        this.drawObject(newShip);
        this.badShips[i].push(newShip);
      }
    }
  }

  destroyBadShips() {
    for (let row of this.badShips) {
      for (let ship of row) {
        this.destroyObject(ship);
      }
    }

    this.badShips = [];
  }

  initialiseGoodShip(goodShip) {
    goodShip.addEventListeners();
    // Draw in centre of canvas
    this.moveObject(
      goodShip,
      this.canvas.getWidth() / 2 - goodShip.width / 2,
      this.canvas.getHeight() - (goodShip.height + 10)
    );
    this.drawObject(goodShip);
  }

  destroyGoodShips() {
    for (let ship of this.players) {
      this.destroyObject(ship);
    }

    this.players = [];
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
    const canvasCentre = this.canvas.getWidth() / 2;
    const xValueOfMiddleRock = canvasCentre - this.getSetting("rockWidth") / 2;
    let rockPair = 1;

    for (let i = 0; i < this.getSetting("numRocks"); i++) {
      let rock = new Rock(
        this.getSetting("rockWidth"),
        this.getSettingsFor("rock")
      );

      // First rock is in the middle
      if (i === 0) {
        rock.move(xValueOfMiddleRock / 2, 0);
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
        console.log("drawing non middle rock", offSet, rock);
        rockPair = i % 2 === 0 ? rockPair + 1 : rockPair;
      }

      this.rocks.push(rock);
      this.drawObject(rock);
    }
  }

  destroyRocks() {
    for (let rock of this.rocks) {
      this.destroyObject(rock);
    }

    this.rocks = [];
  }

  createBullet(ship) {
    let bullet = new Bullet(this.getSettingsFor("bullet"));
    bullet.owner = ship;
    ship.bulletInPlay = true;
    this.bullets.push(bullet);
    return bullet;
  }

  destroyBullets() {
    for (let bullet of this.bullets) {
      this.destroyObject(bullet);
    }

    this.bullets = [];
  }

  moveBadShips() {
    for (let row of this.badShips) {
      // As badShips are destroyed rows become empty.
      if (row.length > 0) {
        let firstShip = row[0];
        let lastShip = row[row.length - 1];
        let maxShipHeight = 40; //Math.max(row.map(ship => ship.height));
        let deltaX = 0;
        let deltaY = 0;

        // Ships have hit left edge of canvas, deltaX needs to be +1
        if (this.canvas.isAtExtremity("left", firstShip.shapes)) {
          this.badShipDirection = "right";
          deltaY = 10;
          // Ships have hit right side of canvas, deltaX needs to be -1
        } else if (this.canvas.isAtExtremity("right", lastShip.shapes)) {
          this.badShipDirection = "left";
          deltaY = 10;
        }

        deltaX = this.badShipDirection === "right" ? 1 : -1;

        for (let ship of row) {
          this.moveObject(ship, deltaX, deltaY);
          this.drawObject(ship);
        }
      }
    }
  }

  moveBullets(ownerType) {
    switch (ownerType) {
      case "badShip":
        this.bullets
          .filter((x) => isBadShipBullet(x))
          .forEach((y) => {
            // Move the bullet down the screen
            this.moveObject(y, 0, 5);
            this.drawObject(y);
          });
        break;

      case "goodShip":
        this.bullets
          .filter((x) => isGoodShipBullet(x))
          .forEach((y) => {
            // Move the bullet up the screen
            this.moveObject(y, 0, -5);
            this.drawObject(y);
          });
        break;

      default:
        break;
    }
  }

  // shoot bullets from X random bad ships
  shootBadBullets() {
    for (let i = 1; i <= this.getSetting("badShipsBulletsPerSecond"); i++) {
      let rowIndex = Math.floor(Math.random() * this.badShips.length);
      let shipIndex = Math.floor(
        Math.random() * this.badShips[rowIndex].length
      );
      let ship = this.badShips[rowIndex][shipIndex];
      // badShip may have already been destroyed
      if (ship) {
        ship.fireBullet();
      }
    }
  }
}
