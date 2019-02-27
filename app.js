class Moveable {
    constructor() {
        this.position = {x: 0, y: 0}; // If drawn this is likely going to be a collection of shapes and positions
        this.shapes = [];
        this.width = 0; // TODO: static currently to test if it initialiseBadShips works
        this.height = 0; // TODO: static currently to test if it initialiseBadShips works
    }

    move(deltaX, deltaY, ) {
        for (let shape of this.shapes) {
            shape.oldX = shape.x;
            shape.oldY = shape.y;
            shape.x += deltaX;
            shape.y += deltaY;
        }   
    }

    draw(context) {
        // Clear existing draw of object
        for (let shape of this.shapes) {
            context.clearRect(shape.oldX, shape.oldY, shape.width, shape.height);
        }

        // Draw in new position and update positiong
        for (let shape of this.shapes) {
            context.fillRect(shape.x, shape.y, shape.width, shape.height);
        }
    }
}

class Ship extends Moveable {
    constructor() {
        super();
        this.bullet = '';
        this.bulletInPlay = false;
        this.width = 20; // TODO: static currently to test if it initialiseBadShips works
        this.height = 20; // TODO: static currently to test if it initialiseBadShips works
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
        this.frameRate = 2;
        this.canvasWidth = 1000;
        this.badShipRows = 5;
        this.badShipsPerRow = 15;
        this.badShips = [];
        this.rocks = [];
    }

    

    newGame() {
        this.initialiseBadShips();
    }

    startGame() {
        this.players = [new GoodShip];
    }

    runGame() {
        // Arrow funciton here will ensure this is bound to SpaceInvadersGame and not window.
        setInterval(() => {
        }, 1000/this.frameRate);
    }

    moveObject(object, deltaX, deltaY) {
        let canvasContext = this.canvasContext
        object.move(deltaX, deltaY, canvasContext);
       // this.drawObject(object);
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
        for (let i = 0; i < this.badShipRows; i++) { // Loop for number of rows required
            for (let j = 0; j < this.badShipsPerRow; j ++) { // Loop for ships required on each row
                let newShip = new BadShip;
                this.moveObject(newShip, (newShip.width*j)+5, (newShip.height*i)+5); // For initialise delta is set relative to 0, 0. newShip.width/height*j/i should offset from the previous ship and produce a gutter
                newShip.draw(this.canvasContext);
                this.badShips[i] = []; // Initialise array
                this.badShips[i].push(newShip);
            }
            
        }
    }

    // This currently just moves ships right --> TODO: hit edge of canvas and come back
    moveBadShips() {
        for (let row of this.badShips) {
            let firstShip = row[0];
            let lastShip = row[row.length-1];
            let maxShipHeight = Math.max(row.map(ship => ship.height));
            let deltaX = 0;
            let deltaY = 0;

            // Ships have hit left edge of canvas, deltaX needs to be +1
            if (firstShip.position.x === 0) {
                deltaX = 1;
                deltaY = maxShipHeight+5;
            // Ships have hit right side of canvas, deltaX needs to be -1
            } else if (lastShip.position.x === this.canvasWidth) {
                deltaX = -1;
                deltaY = maxShipHeight+5;
            }

            for (let ship of row) {
                this.moveObject(ship, deltaX, deltaY);
            }
        }
    }
}