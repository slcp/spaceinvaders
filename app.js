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

class SpaceInvadersGame {
    constructorn(canvasId) {
        this.canvasElement = document.getElementById(canvasId);
        this.canvasWidth = 100;
        this.players = [new GoodShip];
        this.badShipRows = 4;
        this.badShipsPerRow = 4;
        this.badShips = { // Object of rows, each row is an array of badShips
            0: [

            ]

        };
        this.rocks = [];
    }

    newGame() {
        this.initialiseBadShips();
    }

    moveObject(object, deltaX, deltaY) {
        object.move(deltaX, deltaY);
        this.drawObject(object);
    }

    drawObject() {
        // Draw on canvas <-- Luke
    }

    // Draw a grid of badShips
    initialiseBadShips() {
        for (i = 0; i < this.badShipRows; i++) { // Loop for number of rows required
            for (j = 0; j < this.badShipsPerRow; j ++) { // Loop for ships required on each row
                newShip = new BadShip;
                this.moveObject(newShip, (newShip.width*j)+5, (newShip.height*i)+5); // For initialise delta is set relative to 0, 0. newShip.width/height*j/i should offset from the previous ship and produce a gutter
                this.badShip[i] = []; // Initialise array
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

    checkForCollisions() {

    }
}