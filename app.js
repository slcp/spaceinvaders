class Moveable {
    constructor() {
        this.position = {x: 0, y: 0}; // If drawn this is likely going to be a collection of shapes and positions
        this.shapes = [];
        this.width = 0; // TODO: static currently to test if it initialiseBadShips works
        this.height = 0; // TODO: static currently to test if it initialiseBadShips works
        this.lastExtremity = '';
    }

    // Update internal x y values
    move(deltaX, deltaY) {
        for (let shape of this.shapes) {
            shape.oldX = shape.x;
            shape.oldY = shape.y;
            shape.x += deltaX;
            shape.y += deltaY;
        }
        
        this.isAtExtremity('left');
        this.isAtExtremity('right');
    }

    draw(context) {
        // Clear existing draw of object
        for (let shape of this.shapes) {
            context.clearRect(shape.oldX, shape.oldY, shape.width, shape.height);
        }

        // Draw in new position
        for (let shape of this.shapes) {
            context.fillStyle = '#21c521';
            context.fillRect(shape.x, shape.y, shape.width, shape.height);
        }
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
        this.shapes = [
            {
                x: 10,
                y: 5,
                width: 2,
                height: 7
            },
        ];
        this.owner = owner;
    }
}

class Rock {

}

class SpaceInvadersGame {
    constructor(canvasId) {
        this.canvasElement = document.getElementById(canvasId);
        this.canvasContext = this.canvasElement.getContext("2d");
        this.frameRate = 3;
        this.canvasWidth = 1000;
        this.badShipRows = 3;
        this.badShipsPerRow = 10;
        this.badShipDirection= '';
        this.badShips = [];
        this.bullets =[];
        this.rocks = [];
    }

    newGame() {
        this.initialiseBadShips();
        this.players = [new GoodShip];
        this.initialiseGoodShip(this.players[0]);
    }

    startGame() {
        this.runGame();
        let bullet = this.createBullet(this.players[0]);
        this.moveObject(bullet, 50, 125);
        this.drawObject(bullet);
        bullet = this.createBullet(this.badShips[0][0]);
        this.moveObject(bullet, 70, 5);
        this.drawObject(bullet);
    }

    runGame() {
        // Arrow funciton here will ensure this is bound to SpaceInvadersGame and not window.
        setInterval(() => {
            this.moveBadShips();
            this.checkForCollisions();
        }, 1000/this.frameRate);
        
        setInterval(() => {
            this.moveBullets();
            this.checkForCollisions();
        }, 1000/100);
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

    testCollision() {
        let testShip = new GoodShip;
        this.moveObject(testShip, 0, 125);
        this.drawObject(testShip);
        this.isColliding(testShip, this.players[0]);
    }

    isColliding(object1, object2) {
        let colliding = false;

        for (let i = 0; i < object1.shapes.length; i++) {
            for (let j = 0; j < object2.shapes.length; j++) {
                return colliding = !(
                    object1.shapes[i].x > (object2.shapes[j].x + object2.shapes[j].width) || 
                    (object1.shapes[i].x + object1.shapes[i].width) < object2.shapes[j].x || 
                    object1.shapes[i].y > (object2.shapes[j].y + object2.shapes[j].height) ||
                    (object1.shapes[i].y + object1.shapes[i].height) <  object2.shapes[j].y
                );
                
                if (colliding) { break; }
            }
            if (colliding) { break; }
        }
    }

    checkForCollisions() {
        for (let bullet of this.bullets) {
            let collision = false;
            
            // TODO:  Break loops if impacts occurs
            for (let rock of this.rocks) {
                if (this.isColliding(bullet, rock)) {
                    console.log('bullet + rock colliding');
                    // damage rock
                    // remove bullet
                    collision = true;
                    break;
                } else {
                    // do nothing
                }
            }

            if (collision) { continue; }

            for (let row of this.badShips) {
                for (let badShip of row) {
                    if (this.isColliding(bullet, badShip)) {
                        if (bullet.owner instanceof BadShip) {
                            console.log('badShip bullet + badShip colliding');
                            // do nothing
                        } else if (bullet.owner instanceof GoodShip) {
                            console.log('goodShip bullet + badShip colliding');
                            // update score
                            // remove ship
                            // remove bullet
                            // enable shoot addEventListener
                        }
                        collision = true;
                        break;
                    } else {
                        // do nothing
                    }
                }
                if (collision) { break; }
            }

            if (collision) { continue; }

            for (let goodShip of this.players) {
                if (this.isColliding(bullet, goodShip)) {
                    if (bullet.owner instanceof BadShip) {
                        console.log('badShip bullet + goodShip colliding');
                        // remove ship
                        // lose life
                        // check if game is over
                    } else if (bullet.owner instanceof GoodShip) {
                        console.log('goodShip bullet + goodShip colliding');
                        // do nothing - this shouldnt be possible
                    }
                    collision = true;
                    break;
                } else {
                    // do nothing
                }
                    
            }

            if (collision) { continue; }

        }

        for (let row of this.badShips) {
            for (let badShip of row) {

                for (let rock of this.rocks) {
                    if (this.isColliding(badShip, rock)) {
                        console.log('badShip bullet + rock colliding');
                        // damage rock precisely where positions intersect
                    } else {
                        // do nothing
                    }
                }

            }
        }
}

    // Draw a grid of badShips
    initialiseBadShips() {
        for (let i = 0; i < this.badShipRows; i++) { // Loop for number of rows required
            this.badShips[i] = []; // Initialise row in array
            for (let j = 0; j < this.badShipsPerRow; j ++) { // Loop for ships required on each row
                let newShip = new BadShip;
                this.moveObject(newShip, (newShip.width*j)+5, (newShip.height*i)+5); // For initialise delta is set relative to 0, 0. newShip.width/height*j/i should offset from the previous ship and produce a gutter
                newShip.draw(this.canvasContext);
                this.badShips[i].push(newShip);
            }
            
        }
    }

    initialiseGoodShip(goodShip) {
        this.moveObject(goodShip, 65, 125);
        this.drawObject(goodShip);
    }

    createBullet(ship) {
        let bullet = new Bullet;
        bullet.owner = ship;
        ship.bulletInPlay = true;
        this.bullets.push(bullet);
        return bullet;
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

    moveBullets() {
        for (let bullet of this.bullets) {
            if (bullet.owner instanceof BadShip) {
                this.moveObject(bullet, 0, 1);
                this.drawObject(bullet);
            } else if (bullet.owner instanceof GoodShip) {
                this.moveObject(bullet, 0, -1);
                this.drawObject(bullet);
            } else {
                // destroy bullet - this bullet has an invalid owner
            }
        }
    }
}