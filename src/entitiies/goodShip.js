import GameAnimation from "../animation";
import {ARROW_LEfT, ARROW_RIGHT, SPACE} from "../keyCodes";
import Ship from "./ship";
import Shape from "../canvas/shape";
import {GOOD_SHIP_KILLED_BY_BAD_BULLET, GOOD_SHIP_OUT_OF_LIVES} from "../events/events";
import AnimationFrame from "../animation/animationFrame";
import moveObject from "../functional/moveObject";
import drawObject from "../functional/drawObject";

class GoodShip extends Ship {
    constructor({game, settings, eventBus, id}) {
        super(game, settings, eventBus);
        this.id = id;
        this.keys = [];
        this.shapes = [
            new Shape(20, 40, 60, 20, "#21c521"),
            new Shape(40, 20, 20, 20, "#21c521"),
            new Shape(20, 55, 20, 20, "#21c521"),
            new Shape(60, 55, 20, 20, "#21c521"),
        ];
        this.lives = 3;
        this.shootTrigger = SPACE;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.frameActions = [
            new AnimationFrame(Symbol("moveGoodShip"), 0, () => this.moveShip()),
            new AnimationFrame(Symbol("fireGoodShipBullet"), 800, () => this.fireBullet()),
        ];
    }

    init() {
        this.eventBus.subscribe(GOOD_SHIP_KILLED_BY_BAD_BULLET, this.loseLife.bind(this));
        this.addEventListeners();
    }

    destroy() {
        this.animation.cancel();
        removeEventListener("keydown", this.handleKeyDown);
        removeEventListener("keyup", this.handleKeyUp);
    }

    loseLife() {
        if (!this.lives) {
            this.eventBus.publish(GOOD_SHIP_OUT_OF_LIVES, {id: this.id})
        }
        this.lives -= 1;
    }

    isDead() {
        return this.lives < 0;
    }

    addEventListeners() {
        this.startAnimation();
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
    }

    startAnimation() {
        this.animation = new GameAnimation();
        this.animation.runFrame(this.frameActions)
    }

    moveShip() {
        if (this.keys["RIGHT"]) {
            moveObject({object: this, deltaX: 2, deltaY: 0});
            drawObject({eventBus: this.eventBus, object: this});
            return;
        }
        if (this.keys["LEFT"]) {
            moveObject({object: this, deltaX: -2, deltaY: 0});
            drawObject({eventBus: this.eventBus, object: this});
            return;
        }
    }

    handleKeyDown(event) {
        event.preventDefault();
        if (event.code === this.shootTrigger) {
            const immediateFire = !this.keys["SPACEBAR"];
            this.keys["SPACEBAR"] = true;
            if (immediateFire) {
                this.fireBullet();
            }
            return;
        }
        if (event.code === ARROW_LEfT && !this.direction) {
            this.keys["LEFT"] = true;
            return;
        }
        if (event.code === ARROW_RIGHT && !this.direction) {
            this.keys["RIGHT"] = true;
            return;
        }
    }

    fireBullet() {
        if (!this.keys["SPACEBAR"]) return;
        super.fireBullet();
    }

    handleKeyUp(event) {
        event.preventDefault();
        if (event.code === this.shootTrigger) {
            this.keys["SPACEBAR"] = false;
            return;
        }
        if (event.code === ARROW_LEfT) {
            this.keys["LEFT"] = false;
            return;
        }
        if (event.code === ARROW_RIGHT) {
            this.keys["RIGHT"] = false;
            return;
        }
    }
}

export default GoodShip;
