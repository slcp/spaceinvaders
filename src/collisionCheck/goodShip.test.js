import { newShape } from "../canvas/shape";
import { BAD_SHIP_TYPE } from "../entitiies/badShip";
import { newBullet } from "../entitiies/bullet";
import { newGoodShip, SHIP_TYPE } from "../entitiies/goodShip";
import * as eventBus from "../events";
import { newEventBus } from "../events";
import {
  BULLET_DESTROYED,
  GOOD_SHIP_DESTROYED,
  GOOD_SHIP_KILLED_BY_BAD_BULLET,
} from "../events/events";
import { newGame } from "../game";
import { handleIfCollidingWithGoodShip } from "./goodShip";

describe("handleIfCollidingWithGoodShip", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return false when bullet is not owned by a goodShip", async () => {
    // Arrange
    const bus = newEventBus();
    const game = newGame();
    const bullet = newBullet(SHIP_TYPE, "an id");

    // Act
    const is = await handleIfCollidingWithGoodShip(bus, game, bullet);

    // Assert
    expect(is).toEqual(false);
  });
  it("should destroy bullet and ship if bad bullet hits good ship", async () => {
    // Arrange
    const bus = newEventBus();
    const game = newGame();
    const ship = newGoodShip();
    ship.shapes = [newShape(75, 74, 7, 21)];
    game.goodShips = [ship];
    const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

    const bullet = newBullet(BAD_SHIP_TYPE, "an id");
    bullet.shapes = [newShape(75, 75, 4, 20)];

    // Act
    const is = await handleIfCollidingWithGoodShip(bus, game, bullet);

    // Assert
    expect(is).toEqual(true);
    expect(publishSpy).toHaveBeenCalledWith(bus, BULLET_DESTROYED, bullet);
    expect(publishSpy).toHaveBeenCalledWith(bus, GOOD_SHIP_DESTROYED, {
      id: ship.id,
    });
    expect(publishSpy).toHaveBeenCalledWith(
      bus,
      GOOD_SHIP_KILLED_BY_BAD_BULLET,
      {
        id: ship.id,
      }
    );
  });
  it("should do nothing if bad bullet hits no good ships", async () => {
    // Arrange
    const bus = newEventBus();
    const game = newGame();
    const ship = newGoodShip("an id");
    ship.shapes = [newShape(1, 1, 7, 21)];
    game.badShips = [ship];
    const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

    const bullet = newBullet(BAD_SHIP_TYPE, "an id");
    bullet.shapes = [newShape(75, 75, 4, 20)];

    // Act
    const is = await handleIfCollidingWithGoodShip(bus, game, bullet);

    // Assert
    expect(is).toEqual(false);
    expect(publishSpy).not.toHaveBeenCalledWith(bus, BULLET_DESTROYED, {
      id: bullet.id,
    });
    expect(publishSpy).not.toHaveBeenCalledWith(bus, GOOD_SHIP_DESTROYED, {
      id: ship.id,
    });
    expect(publishSpy).not.toHaveBeenCalledWith(
      bus,
      GOOD_SHIP_KILLED_BY_BAD_BULLET,
      {
        id: ship.id,
      }
    );
  });
});
