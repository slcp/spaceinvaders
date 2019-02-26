class Moveable {
    constructor() {
        this.position = {x: 0, y: 0}; // If drawn this is likely going to be a collection of shapes and positions
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

    isColliding(object1, object2) {
        // Implementation depends on how objects have been drawn
    }

    checkForCollisions() {
        for (bullet of this.bullets)
            
            // TODO:  Break loops if impacts occurs
            for (rocks of this.rocks) {
                if (this.isColliding(bullet, rock)) {
                    damage rock
                    remove bullet
                } else {
                    do nothing
                }
            }

            for (badShip of this.badShips) {
                if (this.isColliding(bullet, badShip)) {
                    if (bullet.owner instanceof BadShip) {
                        do nothing
                    } else if (bullet.owner instanceof GoodShip) {
                        update score
                        remove ship
                        remove bullet
                        enable shoot addEventListener
                    }
                } else {
                    do nothing
                }
            }

            for (goodShip of goodShips) {
                if (this.isColliding(bullet, goodShip)) {
                    if (bullet.owner instanceof BadShip) {
                        remove ship
                        lose life
                        check if game is over
                    } else if (bullet.owner instanceof GoodShip) {
                        do nothing - this shouldnt be possible
                    }
                } else {
                    do nothing
                }
                    
            }
        
        }

        for (badShip of this.badShips) {

            for (rock of this.rocks) {
                if (this.isColliding(badShip, rock)) {
                    damage rock precisely where positions intersect
                } else {
                    do nothing
                }
            }

        }
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