class Moveable {
    constructor() {
        this.position = {x: 0, y: 0};
    }

    move(deltaX, deltaY) {
        // Redrawing canvas
        // Update this.position
    }
}

class Ship extends Moveable {
    constructor() {
        super();
        this.bullet = '';
        this.bulletInPlay = false;
        this.width = 7;
        this.heightt = 5;
    }
}

class GoodShip extends Ship {
    constructor() {
        super();
    }
}

class BadShip extends Ship {
    constructor() {
        super();
    }
}

class Bullet extends Moveable {
    constructor() {
        super();
    }
}

class Rock {

}
}