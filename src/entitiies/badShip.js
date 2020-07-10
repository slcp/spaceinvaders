import Ship from './ship';
import Shape from '../canvas/shape';

class BadShip extends Ship {
    constructor(game, settings) {
        super(game, settings);
        this.shapes = [
            new Shape(20, 32, 60, 9, "white"),
            new Shape(40, 28, 20, 20, "white"),
            new Shape(20, 20, 12, 20, "white"),
            new Shape(68, 20, 12, 20, "white"),
        ];
    }
}

export default BadShip;
