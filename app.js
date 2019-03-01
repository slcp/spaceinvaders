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
    }

    kill(context) {
        // Clear existing draw of object
        for (let shape of this.shapes) {
            context.clearRect(shape.x, shape.y, shape.width, shape.height);
        }

        // No need to explicity destroy instance but ensure no references to it exist if it needs to be destroyed - garbage collection
        
    }

    draw(context) {
        for (let shape of this.shapes) {
            context.clearRect(shape.oldX, shape.oldY, shape.width, shape.height);
        }

        // Draw in new position
        for (let shape of this.shapes) {
            context.fillStyle = '#21c521';
            context.fillRect(shape.x, shape.y, shape.width, shape.height);
        }
    }

    isAtExtremity(direction, canvasElement) {
        let Values = '';
        let Value = '';

        switch(direction) {
            case 'left':
                Values = this.shapes.map(shape => shape.x);
                Value = Math.floor(...Values);
                return (Value <= 0);

            case 'right':
                Values = this.shapes.map(shape => shape.x + shape.width);
                Value = Math.max(...Values);
                return (Value >= canvasElement.width);

            case 'top':
                Values = this.shapes.map(shape => shape.y);
                Value = Math.max(...Values);
                return (Value <= 0);

            case 'bottom':
                Values = this.shapes.map(shape => shape.y + shape.height);
                Value = Math.max(...Values);
                return (Value >= canvasElement.height);

            default:
            break;
        }
        
    }
}

class Ship extends Moveable {
    constructor() {
        super();
        this.game = game;
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
        this.shootTrigger = 'Space';
    }

    addEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.code === this.shootTrigger){
                if (!this.bulletInPlay) {
                    let bullet = this.game.createBullet(this);
                    this.game.moveObject(bullet, Math.floor(...this.shapes.map(shape => shape.x)), Math.floor(...this.shapes.map(shape => shape.y)));
                    this.game.drawObject(bullet);
                }
            } else if (event.code === 'ArrowLeft') {

            } else if (event.code === 'ArrowRight') {

            }
        });
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
        this.frameRate = 10;
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
        this.players = [new GoodShip(this)];
        this.initialiseGoodShip(this.players[0]);
    }

    startGame() {
        this.runGame();
    }

    runGame() {
        // Arrow funciton here will ensure this is bound to SpaceInvadersGame and not window.
        setInterval(() => {
            this.moveBadShips();
            this.checkForCollisions();
            this.shootBadBullets();
        }, 1000/this.frameRate);
        
        setInterval(() => {
            this.moveBullets();
            this.checkForCollisions();
        }, 1000/(this.frameRate*75));
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

    destroyObject(object) {
        let canvasContext = this.canvasContext

        if (object instanceof Rock) {
            // This is harder depending on what is impacting rock, see Trello task
        } else if (object instanceof Bullet) {
            object.kill(canvasContext);
            object.owner.bulletInPlay = false;
            object.owner.bullet = '';
            let bulletIndex = this.bullets.indexOf(object);
            this.bullets.splice(bulletIndex, 1);
        } else if (object instanceof BadShip) {
            object.kill(canvasContext);
            // Find badShip in this.badShips and remove
            for (let i = 0; i < this.badShips.length; i++) {
                if (this.badShips[i].indexOf(object) >= 0) {
                    let badShipIndex = this.badShips[i].indexOf(object);
                    this.badShips[i].splice(badShipIndex, 1);
                    break;
                }
            }
        } else if (object instanceof GoodShip) {
            object.kill(canvasContext);
            let goodShipIndex = this.players.indexOf(object);
            this.players.splice(goodShipIndex, 1);
        }
    }

    testCollision() {
        let testShip = new GoodShip(this);
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
                    // bullet + rock colliding
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
                            // badShip bullet + badShip colliding
                            // do nothing
                        } else if (bullet.owner instanceof GoodShip) {
                            // goodShip bullet + badShip colliding
                            this.destroyObject(badShip);
                            this.destroyObject(bullet);
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
                        // badShip bullet + goodShip colliding
                        this.destroyObject(goodShip);
                        this.destroyObject(bullet);
                        // remove ship
                        // lose life
                        // check if game is over
                    } else if (bullet.owner instanceof GoodShip) {
                        // goodShip bullet + goodShip colliding
                        // do nothing - this shouldnt be possible
                    }
                    collision = true;
                    break;
                } else {
                    // do nothing
                }
                    
            }

            if (collision) { continue; }

            if (bullet.isAtExtremity('top', this.canvasElement) || bullet.isAtExtremity('bottom', this.canvasElement)) {
                console.log('bullet outof field');
                this.destroyObject(bullet);
            }

        }

        for (let row of this.badShips) {
            for (let badShip of row) {

                for (let rock of this.rocks) {
                    if (this.isColliding(badShip, rock)) {
                        // badShip bullet + rock colliding
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
                let newShip = new BadShip(this);
                this.moveObject(newShip, (newShip.width*j)+5, (newShip.height*i)+5); // For initialise delta is set relative to 0, 0. newShip.width/height*j/i should offset from the previous ship and produce a gutter
                newShip.draw(this.canvasContext);
                this.badShips[i].push(newShip);
            }
            
        }
    }

    initialiseGoodShip(goodShip) {
        goodShip.addEventListeners();
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
            if (firstShip.isAtExtremity('left', this.canvasElement)) {
                this.badShipDirection = true;
            // Ships have hit right side of canvas, deltaX needs to be -1
            } else if (lastShip.isAtExtremity('right', this.canvasElement)) {
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

    // shoot bullets from X random bad ships
    shootBadBullets() {

    }
}