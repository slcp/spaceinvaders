class Moveable {
    constructor() {
        this.position = {x: 0, y: 0}; // If drawn this is likely going to be a collection of shapes and positions
        this.shapes = [];
        this.width = 0; // TODO: static currently to test if it initialiseBadShips works
        this.height = 0; // TODO: static currently to test if it initialiseBadShips works
    }

    move(deltaX, deltaY) {
        for (let shape of this.shapes) {
            shape.oldX = shape.x;
            shape.oldY = shape.y;
            shape.x += deltaX;
            shape.y += deltaY;
        }   
    }

    getShipColor() {
        // gets random colour
        return "#"+((1<<24)*Math.random()|0).toString(16);
    }

    draw(context) {
        // Clear existing draw of object
        for (let shape of this.shapes) {
            context.clearRect(shape.oldX, shape.oldY, shape.width, shape.height);
        }

        // Draw in new position and update positiong
        for (let shape of this.shapes) {
            context.fillStyle = shape.color ? this.getShipColor() : 'white';
            context.fillRect(shape.x, shape.y, shape.width, shape.height);
        }
    }
}

class Ship extends Moveable {
    constructor() {
        super();
        this.bullet = '';
        this.bulletInPlay = false;
        this.width = 40; // TODO: static currently to test if it initialiseBadShips works
        this.height = 25; // TODO: static currently to test if it initialiseBadShips works
    }

    isAtExtremity(direction) {
        let xValues = '';
        let xValue = '';

        switch(direction) {
            case 'left':
                xValues = this.shapes.map(shape => shape.x);
                xValue = Math.floor(...xValues);
                return (xValue <= 0);
            case 'right':
                xValues = this.shapes.map(shape => shape.x + shape.width);
                xValue = Math.max(...xValues);
                return (xValue >= 300);
            default:
                return 'fail';
        }
        
    }
}

class GoodShip extends Ship {
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

class BadShip extends Ship {
    constructor() {
        super();
        this.shapes = [
            {
                x: 5,
                y: 10,
                width: 15,
                height: 5,
                color: 'white'
            },
            {
                x: 10,
                y: 5,
                width: 5,
                height: 5,
                color: 'white'
            },
            {
                x: 5,
                y: 15,
                width: 5,
                height: 5,
                color: 'white'
            },
            {
                x: 15,
                y: 15,
                width: 5,
                height: 5,
                color: 'white'
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
        this.badShipRows = 3;
        this.badShipsPerRow = 5;
        this.badShipDirection= '';
        this.badShips = [];
        this.rocks = [];
    }

    newGame() {
        this.initialiseBadShips();
        this.players = [new GoodShip];
        this.initialiseGoodShip(this.players[0]);
    }

    startGame() {

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

    drawObject(object) {
        let canvasContext = this.canvasContext
        object.draw(canvasContext);
    }

    isColliding(object1, object2) {
        // Implementation depends on how objects have been drawn
    }

    /*checkForCollisions() {
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
}*/

    // Draw a grid of badShips
    initialiseBadShips() {
        for (let i = 0; i < this.badShipRows; i++) { // Loop for number of rows required
            this.badShips[i] = []; // Initialise row in array
            for (let j = 0; j < this.badShipsPerRow; j ++) { // Loop for ships required on each row
                let newShip = new BadShip;
                this.moveObject(newShip, (newShip.width*j + 5), (newShip.height*i + 5)); // For initialise delta is set relative to 0, 0. newShip.width/height*j/i should offset from the previous ship and produce a gutter
                newShip.draw(this.canvasContext);
                this.badShips[i].push(newShip);
            }
            
        }
    }

    initialiseGoodShip(goodShip) {
        this.moveObject(goodShip, 0, 125);
        this.drawObject(goodShip);
    }

    // This currently just moves ships right --> TODO: hit edge of canvas and come back
    moveBadShips() {
        for (let row of this.badShips) {
            let firstShip = row[0];
            let lastShip = row[row.length-1];
            let maxShipHeight = 40; //Math.max(row.map(ship => ship.height));
            // Ships have hit left edge of canvas, deltaX needs to be +1
            if (firstShip.isAtExtremity('left')) {
                this.badShipDirection = true;
            // Ships have hit right side of canvas, deltaX needs to be -1
            } else if (lastShip.isAtExtremity('right')) {
                this.badShipDirection = false;
            }

            let deltaX = this.badShipDirection ? 5 : -5;
            let deltaY = 0;

            for (let ship of row) {
                this.moveObject(ship, deltaX, deltaY);
                this.drawObject(ship);
            }
        }
    }
}