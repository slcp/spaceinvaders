import { newShape } from "../canvas/shape";
import { newShip } from "./ship";

export const BAD_SHIP_TYPE = "_badShip";

export const newBadShip = () => ({
  ...newShip(),
  _type: BAD_SHIP_TYPE,
  shapes: [
    newShape(20, 32, 60, 9, "white"),
    newShape(40, 28, 20, 20, "white"),
    newShape(20, 20, 12, 20, "white"),
    newShape(68, 20, 12, 20, "white"),
  ],
});