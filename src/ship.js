import Moveable from "./moveable";

class Ship extends Moveable {
  constructor(game, settings, symbol) {
    super(settings);
    this.game = game;
    this.bullet = "";
    this.bulletInPlay = false;
    this.width = 80;
    this.height = 80;
    this.id = symbol
  }

  fireBullet() {
    if (!this.bulletInPlay || this.settings.continuousFire) {
      let bullet = this.game.createBullet(this);
      // This does not exactly identify bullet exit point and also needs to be more readable
      this.game.moveObject(
        bullet,
        Math.floor(...this.shapes.map((shape) => shape.x)),
        Math.floor(...this.shapes.map((shape) => shape.y))
      );
      this.game.drawObject(bullet);
    }
  }
}

export default Ship;
