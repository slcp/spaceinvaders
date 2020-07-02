import Shape from "../shape";

class CollisionCheck {
    constructor(obj1, obj2) {
        // TODO: Clean this up - the log is correct
        if ((!obj1 instanceof Shape && !Array.isArray(obj1)) || (Array.isArray(obj1) && obj1.every(x => x instanceof Shape))) {
            throw new Error("collision object must be shapes or array of shapes")
        }
        this.obj1 = obj1 instanceof Shape ? new Array(obj1) : obj1.shapes
        if ((!obj2 instanceof Shape && !Array.isArray(obj2)) || (Array.isArray(obj2) && obj2.every(x => x instanceof Shape))) {
            throw new Error("collision object must be shapes or array of shapes")
        }
        this.obj2 = obj2 instanceof Shape ? new Array(obj2) : obj2.shapes
        this.colliding = false;
    }

    isColliding() {
        for (let i = 0; i < this.obj1.length; i++) {
            for (let j = 0; j < this.obj2.length; j++) {
                if (this.checkForCollision(this.obj1[i], this.obj2[j])) {
                    this.colliding = true;
                    break;
                }
            }
            if (this.colliding) {
                break;
            }
        }
        return this.colliding;
    }

    checkForCollision(shape1, shape2) {
        return !(
            shape1.x >
            shape2.x + shape2.width ||
            shape1.x + shape1.width <
            shape2.x ||
            shape1.y >
            shape2.y + shape2.height ||
            shape1.y + shape1.height < shape2.y
        )
    }
}

export default CollisionCheck;
