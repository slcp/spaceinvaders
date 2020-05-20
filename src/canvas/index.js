class Canvas {
  constructor(id) {
    // #id of html canvas the game will be drawn onto
    this.id = id;
  }

  getWidth() {
    return this.htmlCanvas.width;
  }

  getHeight() {
    return this.htmlCanvas.height;
  }

  init() {
    this.htmlCanvas = document.getElementById(this.id);
    // The context that will be used ot drawn to the canvas
    this.context = this.htmlCanvas.getContext("2d");
  }

  getContext() {
    if (!this.context) {
      this.init();
    }
    return this.context;
  }

  clearShape(shape) {
    const context = this.getContext();
    context.clearRect(shape.oldX, shape.oldY, shape.width, shape.height);
    context.clearRect(shape.x, shape.y, shape.width, shape.height);
}

  fillShape(shape) {
    const context = this.getContext();
    context.fillStyle = shape.color ? shape.color : "green";
    context.fillRect(shape.x, shape.y, shape.width, shape.height);
  }

  remove(shapes) {
    for (let shape of shapes) {
      this.clearShape(shape);
    }
  }

  draw(shapes) {
    // Remove from canvas
    for (let shape of shapes) {
      this.clearShape(shape);
    }
    // Draw in new position
    for (let shape of shapes) {
      this.fillShape(shape);
    }
  }

  isAtExtremity(direction, shapes) {
    switch (direction) {
      case "left":
        const leftMostXValue = Math.floor(...shapes.map((shape) => shape.x));
        return leftMostXValue <= 0;

      case "right":
        const rightMostXValue = Math.max(
          ...shapes.map((shape) => shape.x + shape.width)
        );
        return rightMostXValue >= this.getWidth();

      case "top":
        const topMostYValue = Math.max(...shapes.map((shape) => shape.y));
        return topMostYValue <= 0;

      case "bottom":
        const bottomMostYValue = Math.max(
          ...shapes.map((shape) => shape.y + shape.height)
        );
        return bottomMostYValue >= this.getHeight();

      default:
        break;
    }
  }
}

export default Canvas;
