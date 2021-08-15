import { newGame } from ".";
import { newEventBus } from "../events";
import * as eventBus from "../events";
import * as draw from "../functional/drawObject";
import * as move from "../functional/moveObject";
import { initialiseBadShips, initialiseGame, initialiseRocks } from "./initialise";
import { runFrame } from "../animation";
import { BAD_SHIP_CREATED, BULLET_CREATED, END_GAME, NEW_GAME, START_NEXT_LEVEL } from "../events/events";

jest.mock("../animation", () => ({
  runFrame: jest.fn(),
}));

describe("initialiseRocks", () => {
  it("should move the rocks to the expected positions and draw them", async () => {
    // Arrange
    const bus = newEventBus();
    const game = newGame();
    const context = { width: 1000 };
    const settings = {
      standard: {
        game: {
          rockWidth: 10,
          numRocks: 2,
          rockWhiteSpace: 1,
        },
        rock: { rockParticleWidth: 100, rockParticleHeight: 10 },
      },
    };
    game.level = settings;
    const moveObjectSpy = jest.spyOn(move, "default");
    const drawObjectSpy = jest.spyOn(draw, "default");
    const expectedFirstRock = expect.objectContaining({
      _type: "_rock",
      shapes: [
        {
          _type: "_shape",
          color: undefined,
          height: 10,
          oldX: 0,
          oldY: 800,
          width: 100,
          x: 495,
          y: 800,
        },
      ],
      width: 10,
    });
    const expectedSecondRock = expect.objectContaining({
      _type: "_rock",
      shapes: [
        {
          _type: "_shape",
          color: undefined,
          height: 10,
          oldX: 0,
          oldY: 800,
          width: 100,
          x: 475,
          y: 800,
        },
      ],
      width: 10,
    });

    // Act
    await initialiseRocks(bus, game, context);

    // Assert
    expect(moveObjectSpy).toHaveBeenCalledTimes(2);
    expect(moveObjectSpy).toHaveBeenNthCalledWith(1, {
      deltaX: 495,
      deltaY: 0,
      object: expectedFirstRock,
    });
    expect(drawObjectSpy).toHaveBeenNthCalledWith(1, {
      eventBus: bus,
      object: expectedFirstRock,
    });
    expect(moveObjectSpy).toHaveBeenCalledWith({
      deltaX: 475,
      deltaY: 0,
      object: expectedSecondRock,
    });
    expect(drawObjectSpy).toHaveBeenCalledWith({
      eventBus: bus,
      object: expectedSecondRock,
    });
  });
});

describe("initialiseBadShips", () => {
  it("should X", async () => {
    // Arrange
    const bus = newEventBus();
    const game = newGame();
    game.level = {
      standard: {
        game: {
          badShipRows: 2,
          badShipsPerRow: 3,
        },
      },
    };
    const publishSpy = jest.spyOn(eventBus, "publishToEventBus");
    const moveAndDrawSpy = jest.spyOn(draw, "moveAndDrawObject");

    // Act
    await initialiseBadShips(bus, game);

    // Assert
    expect(publishSpy).toHaveBeenCalledTimes(12); // 6 for CANVAS_DRAW + 6 for BAD_SHIP_CREATED
    expect(moveAndDrawSpy).toHaveBeenCalledTimes(6);
    // Assert calls for each expected ship
    expect(moveAndDrawSpy).toHaveBeenCalledWith(
      bus,
      expect.objectContaining({
        _type: "_badShip",
        shapes: [
          {
            _type: "_shape",
            color: "white",
            height: 9,
            oldX: 20,
            oldY: 32,
            width: 60,
            x: 25,
            y: 182,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 40,
            oldY: 28,
            width: 20,
            x: 45,
            y: 178,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 20,
            oldY: 20,
            width: 12,
            x: 25,
            y: 170,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 68,
            oldY: 20,
            width: 12,
            x: 73,
            y: 170,
          },
        ],
        width: 80,
      }),
      5,
      150
    );
    expect(moveAndDrawSpy).toHaveBeenCalledWith(
      bus,
      expect.objectContaining({
        _type: "_badShip",
        shapes: [
          {
            _type: "_shape",
            color: "white",
            height: 9,
            oldX: 20,
            oldY: 32,
            width: 60,
            x: 105,
            y: 182,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 40,
            oldY: 28,
            width: 20,
            x: 125,
            y: 178,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 20,
            oldY: 20,
            width: 12,
            x: 105,
            y: 170,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 68,
            oldY: 20,
            width: 12,
            x: 153,
            y: 170,
          },
        ],
        width: 80,
      }),
      85,
      150
    );
    expect(moveAndDrawSpy).toHaveBeenCalledWith(
      bus,
      expect.objectContaining({
        _type: "_badShip",
        shapes: [
          {
            _type: "_shape",
            color: "white",
            height: 9,
            oldX: 20,
            oldY: 32,
            width: 60,
            x: 185,
            y: 182,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 40,
            oldY: 28,
            width: 20,
            x: 205,
            y: 178,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 20,
            oldY: 20,
            width: 12,
            x: 185,
            y: 170,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 68,
            oldY: 20,
            width: 12,
            x: 233,
            y: 170,
          },
        ],
        width: 80,
      }),
      165,
      150
    );
    expect(moveAndDrawSpy).toHaveBeenCalledWith(
      bus,
      expect.objectContaining({
        _type: "_badShip",
        shapes: [
          {
            _type: "_shape",
            color: "white",
            height: 9,
            oldX: 20,
            oldY: 32,
            width: 60,
            x: 25,
            y: 262,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 40,
            oldY: 28,
            width: 20,
            x: 45,
            y: 258,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 20,
            oldY: 20,
            width: 12,
            x: 25,
            y: 250,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 68,
            oldY: 20,
            width: 12,
            x: 73,
            y: 250,
          },
        ],
        width: 80,
      }),
      5,
      230
    );
    expect(moveAndDrawSpy).toHaveBeenCalledWith(
      bus,
      expect.objectContaining({
        _type: "_badShip",
        shapes: [
          {
            _type: "_shape",
            color: "white",
            height: 9,
            oldX: 20,
            oldY: 32,
            width: 60,
            x: 105,
            y: 262,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 40,
            oldY: 28,
            width: 20,
            x: 125,
            y: 258,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 20,
            oldY: 20,
            width: 12,
            x: 105,
            y: 250,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 68,
            oldY: 20,
            width: 12,
            x: 153,
            y: 250,
          },
        ],
        width: 80,
      }),
      85,
      230
    );
    expect(moveAndDrawSpy).toHaveBeenCalledWith(
      bus,
      expect.objectContaining({
        _type: "_badShip",
        shapes: [
          {
            _type: "_shape",
            color: "white",
            height: 9,
            oldX: 20,
            oldY: 32,
            width: 60,
            x: 185,
            y: 262,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 40,
            oldY: 28,
            width: 20,
            x: 205,
            y: 258,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 20,
            oldY: 20,
            width: 12,
            x: 185,
            y: 250,
          },
          {
            _type: "_shape",
            color: "white",
            height: 20,
            oldX: 68,
            oldY: 20,
            width: 12,
            x: 233,
            y: 250,
          },
        ],
        width: 80,
      }),
      165,
      230
    );
  });
});

describe("initaliseGame", () => {
  it("should do subscribe to the correct events and set up animation frames", async () => {
    // Arrange
    const bus = newEventBus();
    const game = newGame();
    game.level = {
      standard: {
        game: {
          goodBulletFramerate: 1,
          badShipsBulletsPerSecond: 2,
          badBulletFramerate: 3,
          badShipFramerate: 4,
        },
      },
    };
    window.addEventListener = jest.fn((option, handler) => {
      handlers = [...handlers, handler];
    });
    const subscribeSpy = jest.spyOn(eventBus, "subscribeToEventBus");
    const expectedMoveGoodBulletsAnimationFrame = {
      _type: "_animationFrame",
      id: "moveGoodBullets",
      ms: 1000 / game.level.standard.game.goodBulletFramerate,
      action: expect.any(Function),
    };
    const expectedMoveBadBulletsAnimationFrame = {
      _type: "_animationFrame",
      id: "moveBadBullets",
      ms: 1000 / game.level.standard.game.badBulletFramerate,
      action: expect.any(Function),
    };
    const expectedShootBadBulletsAnimationFrame = {
      _type: "_animationFrame",
      id: "shootBadBullets",
      ms: 1000 / game.level.standard.game.badShipsBulletsPerSecond,
      action: expect.any(Function),
    };
    const expectedCheckForCollisionsAnimationFrame = {
      _type: "_animationFrame",
      id: "checkForCollisions",
      ms: 0,
      action: expect.any(Function),
    };
    // Act
    await initialiseGame(bus, game, {});

    // Assert
    expect(runFrame).toHaveBeenCalledWith(
      expect.arrayContaining([
        expectedMoveGoodBulletsAnimationFrame,
        expectedMoveBadBulletsAnimationFrame,
        expectedShootBadBulletsAnimationFrame,
        expectedCheckForCollisionsAnimationFrame,
      ])
    );
    expect(subscribeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        events: expect.objectContaining({
          [BULLET_CREATED]: expect.arrayContaining([expect.any(Function)]),
        }),
      }),
      BULLET_CREATED,
      expect.any(Function)
    );
    expect(subscribeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        events: expect.objectContaining({
          [BAD_SHIP_CREATED]: expect.arrayContaining([expect.any(Function)]),
        }),
      }),
      BAD_SHIP_CREATED,
      expect.any(Function)
    );
    expect(subscribeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        events: expect.objectContaining({
          [NEW_GAME]: expect.arrayContaining([expect.any(Function)]),
        }),
      }),
      NEW_GAME,
      expect.any(Function)
    );
    expect(subscribeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        events: expect.objectContaining({
          [START_NEXT_LEVEL]: expect.arrayContaining([expect.any(Function)]),
        }),
      }),
      START_NEXT_LEVEL,
      expect.any(Function)
    );
    expect(subscribeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        events: expect.objectContaining({
          [END_GAME]: expect.arrayContaining([expect.any(Function)]),
        }),
      }),
      END_GAME,
      expect.any(Function)
    );
  });
});
