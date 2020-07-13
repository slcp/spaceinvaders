import BadShip from "../entitiies/badShip";
import Bullet from "../entitiies/bullet";
import Canvas2D from "../canvas";
import GoodShip from "../entitiies/goodShip";
import levelsGenerator from "../levels";
import Rock from "../entitiies/rock";
import GameAnimation from "../animation";
import AnimationFrame from "../animation/animationFrame";
import getSetting, {getSettingFor} from "./getSetting";
import {isBadShipBullet, isGoodShipBullet} from "./helpers";
import {
    BAD_SHIP_KILLED_BY_GOOD_BULLET,
    CANVAS_REMOVE,
    END_GAME,
    GOOD_SHIP_KILLED_BY_BAD_BULLET,
    NEW_GAME,
    ROCK_SLICE_KILLED_BY_BAD_BULLET,
    ROCK_SLICE_KILLED_BY_GOOD_BULLET,
    START_NEXT_LEVEL
} from "../events/events";
import CollisionCheck from "./collision";
import {getRandomInt} from "../levels/generators";
import drawObject from "../functional/drawObject";
import moveObject from "../functional/moveObject";

// TOOD: Build canvas operations that in an animation frame into the frame queue - killing objects

export default class SpaceInvadersGame {
    constructor({eventBus, ...context}) {
        const levelGen = levelsGenerator();
        this.context = context;
        // The event bus for the game
        this.eventBus = eventBus;
        // The bad ships that are in play
        this.badShips = [];
        // The good ships (or players) that in play
        this.goodShips = [];
        // The bullets that in play
        this.bullets = [];
        // The rocks that are in play
        this.rocks = [];
        // The game level being played
        this.level = levelGen.next().value;
        // The current game mode - what is game mode?
        this.currentLevelMode = "standard";
        // Game levels generator*
        this.levelData = levelGen;

        this.frameActions = [
            new AnimationFrame(
                Symbol("moveGoodBullets"),
                1000 / this.getSetting("goodBulletFramerate"),
                () => this.moveBullets("goodShip")
            ),
            new AnimationFrame(
                Symbol("shootBadBullets"),
                1000 / this.getSetting("badShipsBulletsPerSecond"),
                () => this.shootBadBullets()
            ),
            new AnimationFrame(
                Symbol("moveBadBullets"),
                1000 / this.getSetting("badBulletFramerate"),
                () => this.moveBullets("badShip")
            ),
            new AnimationFrame(
                Symbol("moveBadShips"),
                1000 / this.getSetting("badShipFramerate"),
                () => this.moveBadShips(),
            ),
            new AnimationFrame(
                Symbol("checkForCollisions"),
                // Run on every frame
                0,
                () => this.checkForCollisions(),
            ),
        ];
    }

    init() {
        this.eventBus.subscribe(NEW_GAME, this.newGame.bind(this))
        this.eventBus.subscribe(START_NEXT_LEVEL, this.nextLevel.bind(this))
        this.eventBus.subscribe(END_GAME, this.endGame.bind(this))
    }

    getSetting(setting) {
        return getSetting(
            setting,
            this.level[this.currentLevelMode]
        );
    }

    getSettingsFor(objectType) {
        return getSettingFor(
            objectType,
            this.level[this.currentLevelMode]
        );
    }

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
        const {players} = this.context;
        this.initialiseBadShips();
        this.goodShips = players.map(id => new GoodShip({
            game: this,
            settings: this.getSettingsFor("goodShip"),
            eventBus: this.eventBus,
            id
        }));
        this.goodShips.forEach(ship => this.initialiseGoodShip(ship));
        this.initialiseRocks();
        this.startAnimation();
    }

    // TODO: How to handle the movement of the good ship.
    // Run a counter of moves for the good ship and move them, all at once? Need a framerate?
    //   - Max moves for goodship per frame = 1 so just need bool for key press -> move
    startAnimation() {
        this.animation = new GameAnimation();
        this.animation.runFrame(this.frameActions)
    }

    // Keep for now - we will need to change levels
    nextLevel() {
        this.endGame();
        this.level = this.levelData.next().value;
        this.startGame();
    }

    drawObject(object) {
        drawObject({eventBus: this.eventBus, object})
    }

    moveAndDrawObject(object, deltaX, deltaY) {
        moveObject({object, deltaX, deltaY})
        this.drawObject(object)
    }

    destroyObject(object) {
        this.eventBus.publish(CANVAS_REMOVE, object.shapes)
        switch (true) {
            // Rocks damage themselves - this will remove an entire rock from the game
            case object instanceof Rock:
                let rockIndex = this.rocks.indexOf(object);
                this.rocks.splice(rockIndex, 1);
                break;

            case object instanceof Bullet:
                object.owner.bulletInPlay = false;
                object.owner.bullet = "";

                let bulletIndex = this.bullets.indexOf(object);
                this.bullets.splice(bulletIndex, 1);
                break;

            case object instanceof BadShip:
                // Find badShip in this.badShips and remove
                for (let i = 0; i < this.badShips.length; i++) {
                    if (this.badShips[i].indexOf(object) >= 0) {
                        let badShipIndex = this.badShips[i].indexOf(object);
                        this.badShips[i].splice(badShipIndex, 1);
                        break;
                    }
                }
                break;

            case object instanceof GoodShip:
                object.destroy();
                let goodShipIndex = this.goodShips.indexOf(object);
                this.goodShips.splice(goodShipIndex, 1);
                break;

        }
    }

    isColliding(object1, object2) {
        return new CollisionCheck(object1.shapes, object2.shapes).isColliding()
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
                    bullet.owner instanceof GoodShip ? ROCK_SLICE_KILLED_BY_GOOD_BULLET : ROCK_SLICE_KILLED_BY_BAD_BULLET,
                    bullet.owner instanceof GoodShip && {id: bullet.owner.id})
                this.destroyObject(bullet);
                this.eventBus.publish(CANVAS_REMOVE, [shape])
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
                                remainingShipCount: this.badShips.flat(Infinity).length
                            })
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
                            id: goodShip.id
                        })
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

            const {height, width} = this.context;
            if (
                Canvas2D.isAtExtremity({height, width}, "top", bullet.shapes) ||
                Canvas2D.isAtExtremity({height, width}, "bottom", bullet.shapes)
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
        const settings = this.getSettingsFor("badShip")
        const shipsPerRow = this.getSetting("badShipsPerRow")
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
        this.badShips.flat(Infinity).forEach(ship => {
            this.destroyObject(ship)
        })
        this.badShips = [];
    }

    initialiseGoodShip(goodShip) {
        goodShip.init();
        // Draw in centre of canvas
        const {width, height} = this.context;
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
        const {width} = this.context;
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
        this.rocks.flat(Infinity).forEach(rock => {
            this.destroyObject(rock)
        })
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
        this.rocks = this.bullets.reduce(function (empty, bullet) {
            this.destroyObject(bullet);
            return empty;
        }.bind(this), [])
    }

    moveBadShips() {
        for (let row of this.badShips) {
            // As badShips are destroyed rows become empty.
            if (row.length) {
                const {height, width} = this.context
                const firstShip = row[0];
                const lastShip = row[row.length - 1];
                let deltaX, deltaY = 0;

                // Ships have hit left edge of canvas, deltaX needs to be +1
                if (Canvas2D.isAtExtremity({height, width}, "left", firstShip.shapes)) {
                    this.badShipDirection = "right";
                    deltaY = 10;
                    // Ships have hit right side of canvas, deltaX needs to be -1
                } else if (Canvas2D.isAtExtremity({height, width}, "right", lastShip.shapes)) {
                    this.badShipDirection = "left";
                    deltaY = 10;
                }

                deltaX = this.badShipDirection === "right" ? 1 : -1;

                row.forEach(ship => {
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
            let rowIndex = getRandomInt({max: this.badShips.length - 1});
            let shipIndex = getRandomInt({max: this.badShips[rowIndex].length - 1});
            let ship = this.badShips[rowIndex][shipIndex];
            // badShip may have already been destroyed
            if (ship) ship.fireBullet();
        }
    }
}
