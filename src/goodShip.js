import GameAnimation from "./game/animation";
import {ARROW_LEfT, ARROW_RIGHT, SPACE} from "./keyCodes";
import Ship from "./ship";
import Shape from "./shape";

class GoodShip extends Ship {
    constructor(game, settings) {
        super(game, settings);
        this.keys = [];
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
        this.animation.cancel();
        removeEventListener("keydown", this.handleKeyDown);
        removeEventListener("keyup", this.handleKeyUp);
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
        this.startAnimation();
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
    }

    startAnimation() {
        // Pass in a callback to the game to check the frame
        // can you use to know when to stop animating
        this.animation = new GameAnimation();
        this.animation.runFrame(this.frameActions)
    }

    moveShip() {
        let deltaX = this.direction === "LEFT" ? -1 : 1;
        if (this.keys["RIGHT"]) {
            deltaX = 1
            this.game.moveObject(this, deltaX, 0);
            this.game.drawObject(this);
            return;
        }
        if (this.keys["LEFT"]) {
            deltaX = -1
            this.game.moveObject(this, deltaX, 0);
            this.game.drawObject(this);
            return;
        }
    }

    handleKeyDown(event) {
        event.preventDefault();
        if (event.code === this.shootTrigger) {
            this.fireBullet();
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

    handleKeyUp(event) {
        event.preventDefault();
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
