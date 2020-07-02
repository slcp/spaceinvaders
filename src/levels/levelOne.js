const levelOne = {
  standard: {
    game: {
      numRocks: 3,
      rockWidth: 100,
      rocKheight: 1,
      rockWhiteSpace: 1,
      badShipScale: 0.5,
      badShipRows: 7,
      badShipsPerRow: 5,
      badShipsBulletsPerSecond: 1,
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
      rockParticleWidth: 1,
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

export default levelOne;