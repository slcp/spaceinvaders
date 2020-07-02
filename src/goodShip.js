import GameAnimation from "./game/animation";
import {ARROW_LEfT, ARROW_RIGHT, SPACE} from "./keyCodes";
import Ship from "./ship";
import Shape from "./shape";

class GoodShip extends Ship {
  constructor(game, settings) {
    super(game, settings);
    this.shapes = [
      new Shape(20, 40, 60, 20, "#21c521"),
      new Shape(40, 20, 20, 20, "#21c521"),
      new Shape(20, 55, 20, 20, "#21c521"),
      new Shape(60, 55, 20, 20, "#21c521"),
    ];
    this.score = 0;
    this.lives = 3;
    this.shootTrigger = SPACE;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.frameActions = [
      {
        id: Symbol("moveGoodShip"),
        ms: 4,
        action: () => this.moveShip(),
      },
    ];
  }

  destroy() {
    for (let interval of this.intervals) {
      clearInterval(interval);
      removeEventListener("keydown", this.handleKeyDown);
      removeEventListener("keyup", this.handleKeyUp);
    }
  }

  updateScore(delta) {
    this.score += delta;
  }

  loseLife() {
    this.lives -= 1;
  }

  gainLife() {
    this.lives += 1;
  }

  isDead() {
    return this.lives > 0;
  }

  addEventListeners() {
    this.intervals = [];
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  startAnimation() {
    // Pass in a callback to the game to check the frame
    // can you use to know when to stop animating
    const animation = new GameAnimation();
    window.requestAnimationFrame((frameStartTime) =>
      animation.runFrame(frameStartTime, this.frameActions, () =>
        this.shouldMove()
      )
    );
  }

  shouldMove() {
    return !this.direction;
  }

  moveShip() {
    const deltaX = this.direction === "LEFT" ? -1 : 1;
    this.game.moveObject(this, deltaX, 0);
    this.game.drawObject(this);
  }

  handleKeyDown(event) {
    event.preventDefault();
    if (event.code === this.shootTrigger) {
      this.fireBullet();
      // TODO: how to throttle fire rate, should be using settings
      if (!this.intervals[event.keyCode]) {
        this.intervals[event.keyCode] = setInterval(
          () => this.fireBullet(),
          100
        );
      }
      return;
      // TODO: Inspect sequencee of keyup/down events
    }
    if (event.code === ARROW_LEfT && !this.direction) {
      this.direction = "LEFT";
      this.startAnimation();
      return;
    }
    if (event.code === ARROW_RIGHT && !this.direction) {
      this.direction = "RIGHT";
      this.startAnimation();
      return;
    }
  }

  handleKeyUp(event) {
    event.preventDefault();
    if (event.code === this.shootTrigger) {
      clearInterval(this.intervals[event.keyCode]);
      this.intervals[event.keyCode] = false;
      return;
    }
    if (event.code === ARROW_LEfT && this.direction === "LEFT") {
      this.direction = null;
      return;
    }
    if (event.code === ARROW_RIGHT && this.direction === "RIGHT") {
      this.direction = null;
      return;
    }
  }
}

export default GoodShip;
