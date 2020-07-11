import levelOne from './levelOne'
import levelTwo from './levelTwo'
import gameSettingsGenerator from "./generators";

// const levels = [levelOne,  levelTwo];
//
// export default levels;

const levelsGenerator = function*() {
    const gameSettings = gameSettingsGenerator();
    console.log("gameSettings: ", typeof gameSettings);
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
