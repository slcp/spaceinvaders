import CollisionCheck from "./collision";
import Shape from "../canvas/shape";

const makeShape = ({x = 0, y = 0, width = 100, height = 100} = {}) => new Shape(x, y, width, height, undefined);
const makeNotAShape = () => "string";

describe('Collision check', () => {
    [
        [makeShape(), makeNotAShape()],
        [makeNotAShape(), makeShape()],
        [makeNotAShape(), makeNotAShape()]
    ].forEach(args => {
        it('should throw when initialised with non Shape args in any position', () => {
            expect(() => new CollisionCheck(...args)).toThrow("collision object must be shapes or array of shapes");
        })
    })
    it('should not throw when initialised with Shape args in all positions', () => {
        expect(() => new CollisionCheck(makeShape(), makeShape())).not.toThrow();
    })
})
