class Shape {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }
}

export const SHAPE_TYPE = "_shape";

export const newShape = (x, y, width, height, color) => ({
  _type: SHAPE_TYPE,
  x,
  y,
  width,
  height,
  color,
});

export default Shape;
