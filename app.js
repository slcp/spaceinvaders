class Moveable {
    constructor() {
        this.shapes = [];
    }

    move(deltaX, deltaY, canvas) {
        // Clear existing draw of object
        for (let shape of this.shapes) {
            context.clearRect(shape.x, shape.y, shape.width, shape.height);
        }

        // Draw in new position and update positiong
        for (let shape of this.shapes) {
            context.fillRect(shape.x+deltaX, shape.y+deltaY, shape.width, shape.height);
            shape.x += deltaX;
            shape.y += deltaY;
        }
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
        this.shapes = [
            {
                x: 5,
                y: 10,
                width: 15,
                height: 5
            },
            {
                x: 10,
                y: 5,
                width: 5,
                height: 5
            },
            {
                x: 5,
                y: 15,
                width: 5,
                height: 5
            },
            {
                x: 15,
                y: 15,
                width: 5,
                height: 5
            }
        ];
    }
}

class Bullet extends Moveable {
    constructor(owner) {
        super();
        this.owner = owner;
    }
}

class Rock {

}

class SpaceInvadersGame {
    constructor(canvasId) {
        this.canvasElement = document.getElementById(canvasId);
        this.canvasContext = this.canvasElement.getContext("2d");
        this.canvasWidth = 1000;
        this.badShipRows = 4;
        this.badShipsPerRow = 4;
        this.badShips = [];
        this.rocks = [];
    }

    newGame() {
        this.initialiseBadShips();
    }

    startGame() {
        this.players = [new GoodShip];
    }

    moveObject(object, deltaX, deltaY) {
        object.move(deltaX, deltaY, this.canvasElement);
        console.log(this.canvasElement);
       // this.drawObject(object);
    }

    drawObject() {
        // Draw on canvas <-- Luke
    }

    // Draw a grid of badShips
    initialiseBadShips() {
        for (let i = 0; i < this.badShipRows; i++) { // Loop for number of rows required
            for (let j = 0; j < this.badShipsPerRow; j ++) { // Loop for ships required on each row
                let newShip = new BadShip;
                this.moveObject(newShip, (newShip.width*j)+5, (newShip.height*i)+5); // For initialise delta is set relative to 0, 0. newShip.width/height*j/i should offset from the previous ship and produce a gutter
                this.badShips[i] = []; // Initialise array
                this.badShips[i].push(newShip);
            }
            
        }
    }

    // This currently just moves ships right --> TODO: hit edge of canvas and come back
    moveBadShips() {
        for (row of this.badShips) {
            firstShip = row[0];
            lastShip = row[row.length-1];
            maxShipHeight = Math.max(row.map(ship => ship.height));
            deltaX = 0;
            deltaY = 0;

            // Ships have hit left edge of canvas, deltaX needs to be +1
            if (firstShip.position.x === 0) {
                deltaX = 1;
                deltaY = maxShipHeight+5;
            // Ships have hit right side of canvas, deltaX needs to be -1
            } else if (lastShip.position.x === this.canvasWidth) {
                deltaX = -1;
                deltaY = maxShipHeight+5;
            }

            for (ship of row) {
                this.moveObject(ship, deltaX, deltaY);
            }
        }
    }
}