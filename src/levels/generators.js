const gameSettingsGenerator = function* () {
    while (true) {
        yield {
            numRocks: getRandomInt({max: 5}),
            rockWidth: getRandomInt({min: 10, max: 150}),
            rockHeight: 1,
            rockWhiteSpace: getRandomInt({min: 1, max: 3}),
            badShipScale: 0.5,
            badShipRows: getRandomInt({min: 1, max: 7}),
            badShipsPerRow: getRandomInt({min: 3, max: 9}),
            badShipsBulletsPerSecond: getRandomInt({min: 1, max: 3}),
            badShipFramerate: getRandomInt({min: 100, max: 800}),
            goodBulletFramerate: getRandomInt({min: 500, max: 1000}),
            badBulletFramerate: getRandomInt({min: 100, max: 400}),
        }
    }
}

const getRandomInt = ({min, max}) => {
    min = Math.ceil(min) || 0;
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default gameSettingsGenerator;
