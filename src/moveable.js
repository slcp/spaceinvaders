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

  kill(context) {
    // Clear existing draw of object
    for (let shape of this.shapes) {
      context.clearRect(shape.x, shape.y, shape.width, shape.height);
      context.clearRect(shape.oldX, shape.oldY, shape.width, shape.height);
    }
    // No need to explicity destroy instance but ensure no references to it exist if it needs to be destroyed - garbage collection
  }
}

export default Moveable;