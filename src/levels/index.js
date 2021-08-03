import gameSettingsGenerator from "./generators";

const levelsGenerator = function*() {
    const gameSettings = gameSettingsGenerator();
    while (true) {
        yield {
            standard: {
                game: gameSettings.next().value,
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
        }
    }
}
export default levelsGenerator;
