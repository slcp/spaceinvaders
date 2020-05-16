const getSetting = (setting, data) => {
  switch (setting) {
    case "numRocks":
    case "rockWidth":
    case "rockWhiteSpace":
    case "badShipRows":
    case "badShipsPerRow":
    case "badShipsBulletsPerSecond":
    case "badShipFramerate":
    case "goodBulletFramerate":
    case "badBulletFramerate":
      return data["game"][setting];

    case "continuousFire":
      return getSettingFor("goodShip", data)[setting];

    case "rockHeight":
    case "rockWidth":
    case "rockParticleWidth":
    case "rockParticleHeight":
      return getSettingFor("rock", data)[setting];
  }
};

export const getSettingFor = (type, data) => {
    return data[type];
}

export default getSetting;
