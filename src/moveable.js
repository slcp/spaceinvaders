class Moveable {
  constructor(settings) {
    this.shapes = [];
    this.settings = settings;
  }

  // Update internal x y values
  move(deltaX, deltaY) {
    for (let shape of this.shapes) {
      shape.oldX = shape.x;
      shape.oldY = shape.y;
      shape.x += deltaX;
      shape.y += deltaY;
    }
  }
}

export default Moveable;
