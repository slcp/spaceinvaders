export const SHAPE_TYPE = "_shape";

export const newShape = (x, y, width, height, color) => ({
  _type: SHAPE_TYPE,
  x,
  y,
  width,
  height,
  color,
});