import Ship from './ship';

class BadShip extends Ship {
  constructor(game, settings) {
    super(game, settings);
    this.shapes = [
      {
        x: 20,
        y: 32,
        width: 60,
        height: 8,
        color: "white",
      },
      {
        x: 40,
        y: 28,
        width: 20,
        height: 20,
        color: "white",
      },
      {
        x: 20,
        y: 20,
        width: 12,
        height: 20,
        color: "white",
      },
      {
        x: 68,
        y: 20,
        width: 12,
        height: 20,
        color: "white",
      },
    ];
  }
}

export default BadShip;