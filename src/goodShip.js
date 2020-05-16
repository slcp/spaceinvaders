import Ship from './ship'

class GoodShip extends Ship {
  constructor(game, settings) {
    super(game, settings);
    this.shapes = [
      {
        x: 20,
        y: 40,
        width: 60,
        height: 20,
        color: "#21c521",
      },
      {
        x: 40,
        y: 20,
        width: 20,
        height: 20,
        color: "#21c521",
      },
      {
        x: 20,
        y: 55,
        width: 20,
        height: 20,
        color: "#21c521",
      },
      {
        x: 60,
        y: 55,
        width: 20,
        height: 20,
        color: "#21c521",
      },
    ];
    this.score = 0;
    this.lives = 3;
    this.shootTrigger = "Space";
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
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

  handleKeyDown(event) {
    event.preventDefault();
    if (event.code === this.shootTrigger) {
      this.fireBullet();
      if (!this.intervals[event.keyCode]) {
        this.intervals[event.keyCode] = setInterval(
          () => this.fireBullet(),
          100
        );
      }
    } else if (event.code === "ArrowLeft") {
      if (!this.intervals[event.keyCode]) {
        this.intervals[event.keyCode] = setInterval(() => {
          this.game.moveObject(this, -1, 0);
          this.game.drawObject(this);
        }, 1000 / 300);
      }
    } else if (event.code === "ArrowRight") {
      if (!this.intervals[event.keyCode]) {
        this.intervals[event.keyCode] = setInterval(() => {
          this.game.moveObject(this, 1, 0);
          this.game.drawObject(this);
        }, 1000 / 300);
      }
    }
  }

  handleKeyUp(event) {
    event.preventDefault();
    clearInterval(this.intervals[event.keyCode]);
    this.intervals[event.keyCode] = false;
  }
}

export default GoodShip;