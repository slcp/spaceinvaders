import { newShape } from "../canvas/shape";

// class BadShip extends Ship {
//   constructor(game, settings) {
//     super(game, settings);
//     this.shapes = [
//       new Shape(20, 32, 60, 9, "white"),
//       new Shape(40, 28, 20, 20, "white"),
//       new Shape(20, 20, 12, 20, "white"),
//       new Shape(68, 20, 12, 20, "white"),
//     ];
//   }
// }

export const BAD_SHIP_TYPE = "_badShip";

export const newBadShip = () => ({
  type: BAD_SHIP_TYPE,
  shapes: [
    newShape(20, 32, 60, 9, "white"),
    newShape(40, 28, 20, 20, "white"),
    newShape(20, 20, 12, 20, "white"),
    newShape(68, 20, 12, 20, "white"),
  ],
});

export default BadShip;
