import { v4 as uuid } from "uuid";
import { runFrame } from "../animation";
import {
  initialiseAnimationFrame,
  newAnimationFrame,
} from "../animation/animationFrame";
import { newShape } from "../canvas/shape";
import { publishToEventBus, subscribeToEventBus } from "../events";
import {
  BULLET_CREATED,
  BULLET_DESTROYED,
  CANVAS_DRAW,
} from "../events/events";
import moveObject from "../functional/moveObject";
import { ARROW_LEFT, ARROW_RIGHT, SPACE } from "../keyCodes";
import { fireBullet } from "./bullet";
import { newShip } from "./ship";

// class GoodShip extends Ship {
//   constructor({ game, settings, eventBus, id }) {
//     super(game, settings, eventBus);
//     this.id = id;
//     this.keys = [];
//     this.shapes = [
//       new Shape(20, 40, 60, 20, "#21c521"),
//       new Shape(40, 20, 20, 20, "#21c521"),
//       new Shape(20, 55, 20, 20, "#21c521"),
//       new Shape(60, 55, 20, 20, "#21c521"),
//     ];
//     this.lives = 3;
//     this.shootTrigger = SPACE;
//     this.handleKeyDown = this.handleKeyDown.bind(this);
//     this.handleKeyUp = this.handleKeyUp.bind(this);
//     this.frameActions = [
//       new AnimationFrame(Symbol("moveGoodShip"), 0, () => this.moveShip()),
//       new AnimationFrame(Symbol("fireGoodShipBullet"), 800, () =>
//         this.fireBullet()
//       ),
//     ];
//   }

//   init() {
//     this.eventBus.subscribe(
//       GOOD_SHIP_KILLED_BY_BAD_BULLET,
//       this.loseLife.bind(this)
//     );
//     this.addEventListeners();
//   }

//   destroy() {
//     this.animation.cancel();
//     removeEventListener("keydown", this.handleKeyDown);
//     removeEventListener("keyup", this.handleKeyUp);
//   }

//   loseLife() {
//     if (!this.lives) {
//       this.eventBus.publish(GOOD_SHIP_OUT_OF_LIVES, { id: this.id });
//     }
//     this.lives -= 1;
//   }

//   isDead() {
//     return this.lives < 0;
//   }

//   addEventListeners() {
//     this.startAnimation();
//     window.addEventListener("keydown", this.handleKeyDown);
//     window.addEventListener("keyup", this.handleKeyUp);
//   }

//   startAnimation() {
//     this.animation = new GameAnimation();
//     this.animation.runFrame(this.frameActions);
//   }

//   moveShip() {
//     if (this.keys["RIGHT"]) {
//       moveObject({ object: this, deltaX: 2, deltaY: 0 });
//       drawObject({ eventBus: this.eventBus, object: this });
//       return;
//     }
//     if (this.keys["LEFT"]) {
//       moveObject({ object: this, deltaX: -2, deltaY: 0 });
//       drawObject({ eventBus: this.eventBus, object: this });
//       return;
//     }
//   }

//   handleKeyDown(event) {
//     event.preventDefault();
//     if (event.code === this.shootTrigger) {
//       const immediateFire = !this.keys["SPACEBAR"];
//       this.keys["SPACEBAR"] = true;
//       if (immediateFire) {
//         this.fireBullet();
//       }
//       return;
//     }
//     if (event.code === ARROW_LEfT && !this.direction) {
//       this.keys["LEFT"] = true;
//       return;
//     }
//     if (event.code === ARROW_RIGHT && !this.direction) {
//       this.keys["RIGHT"] = true;
//       return;
//     }
//   }

//   () {
//     if (!this.keys["SPACEBAR"]) return;
//     super.fireBullet();
//   }

//   handleKeyUp(event) {
//     event.preventDefault();
//     if (event.code === this.shootTrigger) {
//       this.keys["SPACEBAR"] = false;
//       return;
//     }
//     if (event.code === ARROW_LEfT) {
//       this.keys["LEFT"] = false;
//       return;
//     }
//     if (event.code === ARROW_RIGHT) {
//       this.keys["RIGHT"] = false;
//       return;
//     }
//   }
// }

export const SHIP_TYPE = "_goodShip";

const handleShoot = (bus, goodShip) => {
  const immediateFire = !goodShip.keys[SPACE];
  if (immediateFire) {
    fireBullet(bus, goodShip);
  }
  goodShip.keys[SPACE] = true;
};

const fireIfPossible = (bus, goodShip) => {
  if (!goodShip.keys[SPACE]) return;
  fireBullet(bus, goodShip);
};

const handleMoveLeft = (_, goodShip) => {
  if (!goodShip.direction) goodShip.keys[ARROW_LEFT] = true;
};

const handleMoveRight = (_, goodShip) => {
  if (!goodShip.direction) goodShip.keys[ARROW_RIGHT] = true;
};

const keyHandlers = {
  [SPACE]: {
    keyup: (_, goodShip) => (goodShip.keys[SPACE] = false),
    keydown: handleShoot,
  },
  [ARROW_LEFT]: {
    keyup: (_, goodShip) => (goodShip.keys[ARROW_LEFT] = false),
    keydown: handleMoveLeft,
  },
  [ARROW_RIGHT]: {
    keyup: (_, goodShip) => (goodShip.keys[ARROW_RIGHT] = false),
    keydown: handleMoveRight,
  },
};

const handleKeyEvent = (
  bus,
  { type, code, preventDefault },
  goodShip,
  handlers = keyHandlers
) => {
  preventDefault();
  if (!handlers[code] || !handlers[code][type]) {
    throw new Error(`No handler know for key code: ${code}`);
  }
  const handler = handlers[code][type];
  handler(bus, goodShip);
};

export const moveShip = async (bus, goodShip) => {
  if (goodShip.keys["RIGHT"]) {
    moveObject({ object: goodShip, deltaX: 2, deltaY: 0 });
    publishToEventBus(bus, CANVAS_DRAW, goodShip.shapes);
    return;
  }
  if (goodShip.keys["LEFT"]) {
    moveObject({ object: goodShip, deltaX: -2, deltaY: 0 });
    publishToEventBus(bus, CANVAS_DRAW, goodShip.shapes);
    return;
  }
};

export const initialiseGoodShip = async (bus, goodShip) => {
  // this.startAnimation();
  // addEventListeners
  window.addEventListener("keydown", (event) =>
    handleKeyEvent(bus, event, goodShip)
  );
  window.addEventListener("keyup", (event) =>
    handleKeyEvent(bus, event, goodShip)
  );
  await subscribeToEventBus(bus, BULLET_CREATED, (bullet) => {
    if (bullet.ownerId != goodShip.id || bullet.ownerType != goodShip._type) {
      return;
    }
    goodShip.bulletInPlay = true;
    goodShip.bullet = bullet;
  });
  await subscribeToEventBus(bus, BULLET_DESTROYED, (bullet) => {
    if (bullet.ownerId != goodShip.id || bullet.ownerType != goodShip._type) {
      return;
    }
    goodShip.bulletInPlay = false;
    goodShip.bullet = null;
  });
  // createAnimationFrames
  runFrame([
    newAnimationFrame(uuid(), 0, () => moveShip(bus, goodShip)),
    newAnimationFrame(uuid(), 800, () => fireIfPossible(bus, goodShip)),
  ]);
};

export const newGoodShip = (id) => ({
  ...newShip(),
  _type: SHIP_TYPE,
  id,
  keys: [],
  shapes: [
    newShape(20, 40, 60, 20, "#21c521"),
    newShape(40, 20, 20, 20, "#21c521"),
    newShape(20, 55, 20, 20, "#21c521"),
    newShape(60, 55, 20, 20, "#21c521"),
  ],
  lives: 3,
  shootTrigger: SPACE,
});
