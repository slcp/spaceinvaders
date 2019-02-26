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
    constructor(canvasId) {
        this.canvasElement = document.getElementById(canvasId);
        this.canvasWidth = 100;
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

    startGame() {
        this.players = [new GoodShip];
    }

    moveObject(object, deltaX, deltaY) {
        object.move(deltaX, deltaY);
        this.drawObject(object);
    }

    drawObject() {
        // Draw on canvas <-- Luke
    }

    checkForCollisions() {
        for bullets

            for rocks
                if bullet and rock in same place
                    damage rock
                    remove bullet
                if bullet and rock not in same place
                    do nothing
            end for rocks

            for badShips
                if bullet and badShip in same place
                    if enemy bullet
                        do nothing
                    if player bullet
                        update score
                        remove ship
                        remove bullet
                        enable shoot addEventListener
                if bullet and badShip not in same place
                    do nothing
            end for badShips

            for goodShips
                if bullet and goodShip in same place
                    if enemy bullet
                        remove ship
                        lose life
                        check if game is over
                    if player bullet
                        do nothing - this shouldn't be possible
                if bullet and goodShip not in same place
                    do nothing
            end for goodShips

        end for bullets

        for badShips

            for rocks
                if rock and badShip in same position
                    damage rock precisely where positions intersect
                if rock and badShip not in same place
                    do nothing
            end for rocks

        end for badShips
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
}