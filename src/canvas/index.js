// class Canvas2D {
//   constructor(eventBus, element) {
//     this.element = element;
//     this.eventBus = eventBus;
//     this.width = element.width;
//     this.height = element.height;
//   }

import { subscribeToEventBus } from "../events";
import { CANVAS_DRAW, CANVAS_REMOVE } from "../events/events";

//   init() {
//     // The context that will be used ot drawn to the canvas
//     this.context = this.element.getContext("2d");
//     this.eventBus.subscribe(CANVAS_DRAW, this.draw.bind(this));
//     this.eventBus.subscribe(CANVAS_REMOVE, this.remove.bind(this));
//   }

//   getContext() {
//     return this.context;
//   }

//   clearShape(shape) {
//     const context = this.getContext();
//     context.clearRect(shape.oldX, shape.oldY, shape.width, shape.height);
//     context.clearRect(shape.x, shape.y, shape.width, shape.height);
//   }

//   fillShape(shape) {
//     const context = this.getContext();
//     context.fillStyle = shape.color ? shape.color : "green";
//     context.fillRect(shape.x, shape.y, shape.width, shape.height);
//   }

//   remove(shapes) {
//     for (let shape of shapes) {
//       this.clearShape(shape);
//     }
//   }

//   draw(shapes) {
//     // Remove from canvas
//     for (let shape of shapes) {
//       this.clearShape(shape);
//     }
//     // Draw in new position
//     for (let shape of shapes) {
//       this.fillShape(shape);
//     }
//   }

//   static isAtExtremity({ height, width }, direction, shapes) {
//     switch (direction) {
//       case "left":
//         const leftMostXValue = Math.floor(...shapes.map((shape) => shape.x));
//         return leftMostXValue <= 0;

//       case "right":
//         const rightMostXValue = Math.max(
//           ...shapes.map((shape) => shape.x + shape.width)
//         );
//         return rightMostXValue >= width;

//       case "top":
//         const topMostYValue = Math.max(...shapes.map((shape) => shape.y));
//         return topMostYValue <= 0;

//       case "bottom":
//         const bottomMostYValue = Math.max(
//           ...shapes.map((shape) => shape.y + shape.height)
//         );
//         return bottomMostYValue >= height;

//       default:
//         break;
//     }
//   }
// }

export const CANVAS_TYPE = "_canvas2D";

const clearShape = ({ element }, { width, height, oldX = 0, oldY = 0, x, y }) => {
  const context = element.getContext("2d");
  context.clearRect(oldX, oldY, width, height);
  context.clearRect(x, y, width, height);
};

const fillShape = ({ element }, { width, height, color, x, y }) => {
  const context = element.getContext("2d");
  context.fillStyle = color ? color : "green";
  context.fillRect(x, y, width, height);
};

const drawOnCanvas = (canvas) => (shapes) => {
  // Remove from canvas
  for (let shape of shapes) {
    clearShape(canvas, shape);
  }
  // Draw in new position
  for (let shape of shapes) {
    fillShape(canvas, shape);
  }
};

const removeFromCanvas = (canvas) => (shapes) => {
  for (let shape of shapes) {
    clearShape(canvas, shape);
  }
};

export const intialiseCanvas = async (canvas, bus) => {
  subscribeToEventBus(bus, CANVAS_DRAW, drawOnCanvas(canvas));
  subscribeToEventBus(bus, CANVAS_REMOVE, removeFromCanvas(canvas));
};

export const new2DCanvas = (element) => ({
  _type: CANVAS_TYPE,
  element,
});
