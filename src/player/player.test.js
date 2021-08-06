import { v4 } from "uuid";
import * as eventBus from "../events";
import { initialisePlayer, newPlayer } from "./player";

jest.mock("uuid", () => {
  let callCount = 1;
  return {
    v4: jest.fn(() => {
      const value = `uuid${callCount}`;
      callCount = callCount + 1;
      return value;
    }),
  };
});

describe("player", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("newPlayer", () => {
    it("should create a new player object", () => {
      // Arrange
      const expected = {
        _type: "_player",
        lives: 3,
        score: 0,
        id: "uuid1",
      };

      // Act
      const actual = newPlayer();

      // Assert
      expect(v4).toHaveBeenCalled();
      expect(actual).toEqual(expected);
    });
  });
  describe("initialisePlayer", () => {
    it("should call subscribeToEventBus", async () => {
      // Arrange
      const player = newPlayer();
      const subscribeSpy = jest.spyOn(eventBus, "subscribeToEventBus");
      const bus = eventBus.newEventBus();

      // Act
      await initialisePlayer(player, bus);

      // Assert
      expect(subscribeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          events: {
            GOOD_SHIP_KILLED_BY_BAD_BULLET: [expect.any(Function)],
            BAD_SHIP_KILLED_BY_GOOD_BULLET: [expect.any(Function)],
          },
        }),
        "GOOD_SHIP_KILLED_BY_BAD_BULLET",
        expect.any(Function)
      );
      expect(subscribeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          events: {
            BAD_SHIP_KILLED_BY_GOOD_BULLET: [expect.any(Function)],
            GOOD_SHIP_KILLED_BY_BAD_BULLET: [expect.any(Function)],
          },
        }),
        "BAD_SHIP_KILLED_BY_GOOD_BULLET",
        expect.any(Function)
      );
    });
    it("should deduct one life from player and publish PLAYER_LOST_LIFE event when responding to GOOD_SHIP_KILLED_BY_BAD_BULLET event", async () => {
      // Arrange
      const player = newPlayer();
      const publishSpy = jest.spyOn(eventBus, "publishToEventBus");
      const bus = eventBus.newEventBus();

      // Act
      await initialisePlayer(player, bus);

      await eventBus.publishToEventBus(bus, "GOOD_SHIP_KILLED_BY_BAD_BULLET", {
        id: "uuid3",
      });

      // Assert
      expect(player.lives).toEqual(2);
      expect(publishSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          events: {
            BAD_SHIP_KILLED_BY_GOOD_BULLET: [expect.any(Function)],
            GOOD_SHIP_KILLED_BY_BAD_BULLET: [expect.any(Function)],
          },
        }),
        "PLAYER_LOST_LIFE",
        { id: "uuid3", remainingLives: 2 }
      );
      expect(publishSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          events: {
            BAD_SHIP_KILLED_BY_GOOD_BULLET: [expect.any(Function)],
            GOOD_SHIP_KILLED_BY_BAD_BULLET: [expect.any(Function)],
          },
        }),
        "RESPAWN_GOOD_SHIP",
        { id: "uuid3" }
      );
    });
    it("should not publish RESPAWN_GOOD_SHIP event when responding to GOOD_SHIP_KILLED_BY_BAD_BULLET event and player has no lives left", async () => {
      // Arrange
      const player = newPlayer();
      player.lives = 1;
      const publishSpy = jest.spyOn(eventBus, "publishToEventBus");
      const bus = eventBus.newEventBus();

      // Act
      await initialisePlayer(player, bus);

      await eventBus.publishToEventBus(bus, "GOOD_SHIP_KILLED_BY_BAD_BULLET", {
        id: "uuid4",
      });

      // Assert
      expect(player.lives).toEqual(0);
      expect(publishSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({
          events: {
            BAD_SHIP_KILLED_BY_GOOD_BULLET: [expect.any(Function)],
            GOOD_SHIP_KILLED_BY_BAD_BULLET: [expect.any(Function)],
          },
        }),
        "RESPAWN_GOOD_SHIP",
        { id: "uuid4" }
      );
    });
  });
});
