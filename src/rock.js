import Bullet from "./bullet";
import Moveable from "./moveable";

class Rock extends Moveable {
  constructor(width, settings) {
    super(settings);
    this.shapes = false;
    this.rockParticleWidth = 50;
    this.particleHeight = 45;
    this.width = width;
    //this.height = ;
  }

  getShapes() {
    if (!this.shapes) {
      let shapes = new Array();
      for (
        let i = 0;
        i < this.width / ((this.settings.rockParticleWidth / 100) * this.width);
        i++
      ) {
        shapes.push({
          x: i * this.settings.rockParticleWidth,
          y: 800,
          width: this.settings.rockParticleWidth,
          height: this.settings.rockParticleHeight,
        });
      }
      this.shapes = shapes;
    }
  }

  draw(context) {
    this.getShapes();
    // Draw in new position
    for (let shape of this.shapes) {
      context.fillStyle = "#21c521";
      context.fillRect(shape.x, shape.y, shape.width, shape.height);
    }
  }

  move(deltaX, deltaY) {
    this.getShapes();
    super.move(deltaX, deltaY);
  }

  findDamageFrom(object) {
    if (object instanceof Bullet) {
      for (let shape of this.shapes) {
        if (this.isColliding(shape, object)) {
          // Remove the shape from the rock, the game will clear it from the canvas
          this.shapes.splice(this.shapes.indexOf(shape), 1);
          return shape;
        }
      }
      console.log("something has gone wrong, the game thought the rock has collided with the bullet but the rock thinks  otherwise!!")
      return;
    }
  }

  isColliding(shape, object2) {
    let colliding = false;

    for (let j = 0; j < object2.shapes.length; j++) {
      if (
        !(
          shape.x > object2.shapes[j].x + object2.shapes[j].width ||
          shape.x + shape.width < object2.shapes[j].x ||
          shape.y > object2.shapes[j].y + object2.shapes[j].height ||
          shape.y + shape.height < object2.shapes[j].y
        )
      ) {
        colliding = true;
        break;
      }
    }

    return colliding;
  }
}

export default Rock;
