import { newShape } from "../canvas/shape";
import { BAD_SHIP_TYPE } from "../entitiies/badShip";
import { newBullet } from "../entitiies/bullet";
import { SHIP_TYPE } from "../entitiies/goodShip";
import { newRock } from "../entitiies/rock";
import * as eventBus from "../events";
import { newEventBus } from "../events";
import {
  BULLET_DESTROYED,
  CANVAS_REMOVE,
  ROCK_SLICE_KILLED_BY_BAD_BULLET,
  ROCK_SLICE_KILLED_BY_GOOD_BULLET,
} from "../events/events";
import { newGame } from "../game";
import { handleIfCollidingWithRock } from "./rocks";

describe("handleIfCollidingWithRock", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  [
    { shipType: BAD_SHIP_TYPE, eventType: ROCK_SLICE_KILLED_BY_BAD_BULLET },
    { shipType: SHIP_TYPE, eventType: ROCK_SLICE_KILLED_BY_GOOD_BULLET },
  ].forEach(({ shipType, eventType }) => {
    it(`should destroy the expected part of the rock and publish ${eventType} event when ship type is ${shipType}`, async () => {
      // Arrange
      const bus = newEventBus();
      const game = newGame();
      const rock = newRock(5);
      const targetShape = {
        _type: "_shape",
        x: 50,
        y: 800,
        width: 50,
        height: 10,
        color: undefined,
      };
      rock.shapes = [
        {
          _type: "_shape",
          x: 0,
          y: 800,
          width: 50,
          height: 10,
          color: undefined,
        },
        targetShape,
      ];
      game.rocks = [rock];
      const bullet = newBullet(shipType, "an id");
      bullet.shapes[0] = newShape(70, 800, 10, 10);
      const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

      // Act
      const is = await handleIfCollidingWithRock(bus, game, bullet);

      // Assert
      expect(is).toEqual(true);
      expect(rock.shapes).toHaveLength(1);
      expect(publishSpy).toHaveBeenCalledWith(bus, CANVAS_REMOVE, [
        targetShape,
      ]);
      expect(publishSpy).toHaveBeenCalledWith(bus, BULLET_DESTROYED, {
        id: bullet.id,
      });
      expect(publishSpy).toHaveBeenCalledWith(bus, eventType, {
        id: bullet.id,
      });
    });
  });
  it("should do nothing when no rock is hit", async () => {
    // Arrange
    const bus = newEventBus();
    const game = newGame();
    const rock = newRock(5);
    rock.shapes = [
      {
        _type: "_shape",
        x: 0,
        y: 800,
        width: 50,
        height: 10,
        color: undefined,
      },
      {
        _type: "_shape",
        x: 50,
        y: 800,
        width: 50,
        height: 10,
        color: undefined,
      },
    ];
    game.rocks = [rock];
    const bullet = newBullet(SHIP_TYPE, "an id");
    bullet.shapes[0] = newShape(70, 300, 10, 10);
    const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

    // Act
    const is = await handleIfCollidingWithRock(bus, game, bullet);

    // Assert
    expect(is).toEqual(false);
    expect(rock.shapes).toHaveLength(2);
    expect(publishSpy).not.toHaveBeenCalled();
  });
});
