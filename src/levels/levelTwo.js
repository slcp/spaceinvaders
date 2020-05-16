const levelTwo = {
  standard: {
    game: {
      numRocks: 3,
      rockWidth: 50,
      rocKheight: 1,
      rockWhiteSpace: 2,
      badShipScale: 0.5,
      badShipRows: 1,
      badShipsPerRow: 1,
      badShipsBulletsPerSecond: 25,
      badShipFramerate: 200,
      goodBulletFramerate: 800,
      badBulletFramerate: 100,
    },
    goodShip: {
      continuousFire: true,
    },
    badShip: {
      continuousFire: true,
    },
    rock: {
      rockParticleWidth: 20,
      rockParticleHeight: 45,
    },
  },
  special: {
    goodShip: {
      continuousFire: true,
    },
    game: {
      badShipsBulletsPerSecond: 10,
    },
  },
};

export default levelTwo;