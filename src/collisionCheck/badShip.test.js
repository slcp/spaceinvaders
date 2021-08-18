import { newShape } from "../canvas/shape";
import { BAD_SHIP_TYPE, newBadShip } from "../entitiies/badShip";
import { newBullet } from "../entitiies/bullet";
import { newEventBus } from "../events";
import { newGame } from "../game";
import { handleIfCollidingWithBadShip } from "./badShip";
import * as eventBus from "../events";
import { SHIP_TYPE } from "../entitiies/goodShip";
import {
  BAD_SHIP_DESTROYED,
  BAD_SHIP_KILLED_BY_GOOD_BULLET,
  BULLET_DESTROYED,
} from "../events/events";

describe("handleIfCollidingWithBadShip", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return false when bullet is not owned by a goodShip", async () => {
    // Arrange
    const bus = newEventBus();
    const game = newGame();
    const bullet = newBullet(BAD_SHIP_TYPE, "an id");

    // Act
    const is = await handleIfCollidingWithBadShip(bus, game, bullet);

    // Assert
    expect(is).toEqual(false);
  });
  it("should destroy bullet and ship if good bullet hits bad ship", async () => {
    // Arrange
    const bus = newEventBus();
    const game = newGame();
    const badShip = newBadShip();
    badShip.shapes = [newShape(75, 74, 7, 21)];
    game.badShips = [badShip];
    const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

    const bullet = newBullet(SHIP_TYPE, "an id");
    bullet.shapes = [newShape(75, 75, 4, 20)];

    // Act
    const is = await handleIfCollidingWithBadShip(bus, game, bullet);

    // Assert
    expect(is).toEqual(true);
    expect(publishSpy).toHaveBeenCalledWith(bus, BULLET_DESTROYED, bullet);
    expect(publishSpy).toHaveBeenCalledWith(bus, BAD_SHIP_DESTROYED, {
      id: badShip.id,
    });
    expect(publishSpy).toHaveBeenCalledWith(
      bus,
      BAD_SHIP_KILLED_BY_GOOD_BULLET,
      {
        id: badShip.id,
      }
    );
  });
  it("should do nothing if good bullet hits no bad ships", async () => {
    // Arrange
    const bus = newEventBus();
    const game = newGame();
    const badShip = newBadShip();
    badShip.shapes = [newShape(1, 1, 7, 21)];
    game.badShips = [badShip];
    const publishSpy = jest.spyOn(eventBus, "publishToEventBus");

    const bullet = newBullet(SHIP_TYPE, "an id");
    bullet.shapes = [newShape(75, 75, 4, 20)];

    // Act
    const is = await handleIfCollidingWithBadShip(bus, game, bullet);

    // Assert
    expect(is).toEqual(false);
    expect(publishSpy).not.toHaveBeenCalledWith(bus, BULLET_DESTROYED, {
      id: bullet.id,
    });
    expect(publishSpy).not.toHaveBeenCalledWith(bus, BAD_SHIP_DESTROYED, {
      id: badShip.id,
    });
    expect(publishSpy).not.toHaveBeenCalledWith(
      bus,
      BAD_SHIP_KILLED_BY_GOOD_BULLET,
      {
        id: badShip.id,
      }
    );
  });
});
