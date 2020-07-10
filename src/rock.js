import Bullet from "./bullet";
import Moveable from "./moveable";
import Shape from "./shape";
import CollisionCheck from "./game/collision";

class Rock extends Moveable {
    constructor(width, settings) {
        super(settings);
        this.shapes = false;
        this.width = width;
        //this.height = ;
    }

    getShapes() {
        if (!this.shapes) {
            this.shapes = [];
            const {rockParticleWidth: particleWidth, rockParticleHeight: height} = this.settings;
            for (
                let i = 0;
                i < this.width / ((particleWidth / 100) * this.width);
                i++
            ) {
                const shape = new Shape(i * particleWidth, 800, particleWidth, height);
                this.shapes.push(shape);
            }
        }
    }

    move(deltaX, deltaY) {
        this.getShapes();
        super.move(deltaX, deltaY);
    }

    findDamageFrom(object) {
        if (object instanceof Bullet) {
            for (let shape of this.shapes) {
                if (this.isColliding(shape, object)) {
                    // Remove the shape from the rock, the game will clear it from the canvas
                    this.shapes.splice(this.shapes.indexOf(shape), 1);
                    return shape;
                }
            }
            console.log("something has gone wrong, the game thought the rock has collided with the bullet but the rock thinks otherwise!!")
            return;
        }
    }

    isColliding(shape, object2) {
        return new CollisionCheck(shape, object2.shapes).isColliding()
    }
}

export default Rock;
