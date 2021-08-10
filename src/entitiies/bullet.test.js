import { newShape } from "../canvas/shape";
import * as eventBus from "../events";
import { BAD_SHIP_TYPE } from "./badShip";
import { fireBullet, newBullet } from "./bullet";
import { newGoodShip } from "./goodShip";
import drawObject from "../functional/drawObject";
import * as moveObject from "../functional/moveObject";

jest.mock("../functional/drawObject", () => jest.fn());

describe("Bullet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("newBullet", () => {
    it("should create a new bullet object", () => {
      // Arrange
      // Act
      const actual = newBullet(BAD_SHIP_TYPE);

      // Assert
      expect(actual._type).toEqual("_bullet");
      expect(actual.ownerType).toEqual("_badShip");
      expect(actual.shapes).toEqual([newShape(0, 10, 4, 20)]);
    });
  });
  describe("fireBullet", () => {
    it("should calcuate new bullet shape x,y and move/draw object", () => {
      // Arrange
      const bus = eventBus.newEventBus();
      const ship = newGoodShip("an id");
      ship.shapes = [
        { x: 10, y: 15, width: 100 },
        { x: 20, y: 35, width: 12 },
      ];
      const moveObjectSpy = jest.spyOn(moveObject, "default");
      const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

      // Act
      fireBullet(bus, ship);

      // Assert
      expect(moveObjectSpy).toHaveBeenCalledWith({
        deltaX: 19, // loads of math
        deltaY: 15, // minY
        object: expect.objectContaining({
          _type: "_bullet",
          ownerId: "an id",
          ownerType: "_goodShip",
        }),
      });
      expect(drawObject).toHaveBeenCalledWith({
        eventBus: bus,
        object: expect.objectContaining({
          _type: "_bullet",
          ownerId: "an id",
          ownerType: "_goodShip",
          shapes: [
            {
              _type: "_shape",
              color: undefined,
              height: 20,
              width: 4,
              x: 19, // TODO: Floating points are bad with canvas operations
              y: 25,
              oldX: 0,
              oldY: 10,
            },
          ],
        }),
      });
      expect(publishSpy).toHaveBeenCalledWith(
        bus,
        "BULLET_CREATED",
        expect.objectContaining({
          _type: "_bullet",
          ownerId: "an id",
          ownerType: "_goodShip",
        })
      );
    });
    it("should not call move or draw object when ship has bullet in play", () => {
      // Arrange
      const bus = eventBus.newEventBus();
      const ship = newGoodShip("an id");
      ship.bulletInPlay = true;
      const moveObjectSpy = jest.spyOn(moveObject, "default");

      // Act
      fireBullet(bus, ship);

      // Assert
      expect(moveObjectSpy).not.toHaveBeenCalled();
      expect(drawObject).not.toHaveBeenCalled();
    });
  });
});
