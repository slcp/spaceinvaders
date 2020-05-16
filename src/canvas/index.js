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
    const context = this.getContext();
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
    let Values = "";
    let Value = "";

    switch (direction) {
      case "left":
        Values = shapes.map((shape) => shape.x);
        Value = Math.floor(...Values);

        if (Value <= 0) {
          //   this.lastExtremity = "left";
          return true;
        } else {
          return false;
        }

      case "right":
        Values = shapes.map((shape) => shape.x + shape.width);
        Value = Math.max(...Values);

        if (Value >= this.getWidth()) {
          //   this.lastExtremity = "right";
          return true;
        } else {
          return false;
        }

      case "top":
        Values = shapes.map((shape) => shape.y);
        Value = Math.max(...Values);
        if (Value <= 0) {
          //   this.lastExtremity = "top";
          return true;
        } else {
          return false;
        }

      case "bottom":
        Values = shapes.map((shape) => shape.y + shape.height);
        Value = Math.max(...Values);
        if (Value >= this.getHeight()) {
          //   this.lastExtremity = "bottom";
          return true;
        } else {
          return false;
        }

      default:
        break;
    }
  }
}

export default Canvas;
