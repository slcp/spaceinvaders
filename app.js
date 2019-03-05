class Moveable {
    constructor() {
        this.position = {x: 0, y: 0}; // If drawn this is likely going to be a collection of shapes and positions
        this.shapes = [];
        this.width = 0; // TODO: static currently to test if it initialiseBadShips works
        this.height = 0; // TODO: static currently to test if it initialiseBadShips works
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

    // randomColor() {
    //     // gets random colour
    //     return "#"+((1<<24)*Math.random()|0).toString(16);
    // }

    changeShipColor() {
        // change color of ship depending on which side is hit
        if(this.isAtExtremity('left')) {
            return 'blue';
        } else if (this.isAtExtremity('right')){
            return 'red';
        } else {
            return 'white';
        }
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
            context.fillStyle = shape.color ? this.changeShipColor() : 'gold';
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
                
                if (Value <= 0) {
                    this.lastExtremity = 'left';
                    return true;
                } else {
                    return false;
                };

            case 'right':
                Values = this.shapes.map(shape => shape.x + shape.width);
                Value = Math.max(...Values);
                
                if (Value >= this.game.canvasElement.width) {
                    this.lastExtremity = 'right';
                    return true;
                } else {
                    return false;
                }

            case 'top':
                Values = this.shapes.map(shape => shape.y);
                Value = Math.max(...Values);
                if (Value <= 0) {
                    this.lastExtremity = 'top';
                    return true;
                } else {
                    return false;
                }

            case 'bottom':
                Values = this.shapes.map(shape => shape.y + shape.height);
                Value = Math.max(...Values);
                if (Value >= canvasElement.height) {
                    this.lastExtremity = 'bottom';
                    return true;
                } else {
                    return false;
                }

            default:
            break;
        }
    }
};

class Ship extends Moveable {
    constructor() {
        super();
        this.game = game;
        this.bullet = '';
        this.bulletInPlay = false;
        this.width = 25; // TODO: static currently to test if it initialiseBadShips works
        this.height = 10; // TODO: static currently to test if it 
    }

    fireBullet() {
        if (!this.bulletInPlay) {
            let bullet = this.game.createBullet(this);
            // This does not exactly identify bullet exit point and also needs to be more readable
            this.game.moveObject(bullet, Math.floor(...this.shapes.map(shape => shape.x)), Math.floor(...this.shapes.map(shape => shape.y)));
            this.game.drawObject(bullet);
        }
    }
}

class GoodShip extends Ship {
    constructor(context) {
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
        // this.handleKeyDown = this.handleKeyDown.bind(this);
        // this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    destroy() {
        /*for (let interval of this.intervals) {
            clearInterval(interval);
            removeEventListener('keydown', this.handleKeyDown);
            removeEventListener('keyup', this.handleKeyUp);
        }*/
    }
}

class BadShip extends Ship {
    constructor() {
        super();
        this.shapes = [
            {
                x: 5,
                y: 8,
                width: 15,
                height: 2,
                color: 'white'
            },
            {
                x: 10,
                y: 7,
                width: 5,
                height: 5,
                color: 'white'
            },
            {
                x: 5,
                y: 5,
                width: 3,
                height: 5,
                color: 'white'
            },
            {
                x: 17,
                y: 5,
                width: 3,
                height: 5,
                color: 'white'
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

        window.addEventListener('keydown', (event) => {
            let key_code_space = 32//Space
            // let bullet = new Bullet;
                if (event.keyCode === key_code_space){
                    console.log(event)
                    console.log('fire')
                    // console.log(createBullet(this.ship))
                    // this.createBullet(this.ship)
                   this.GoodShip.createBullet(GoodShip)
                }
            });
    }
}

class Rock {
    constructor(owner) {
        this.shapes = [
            {
                x: 15,
                y: 90,
                width: 1,
                height: 1
            },
        ];
        this.width = 40;
        this.height = 15;
    }

    getShapes() {
        return {
            shapes: [
                {
                    x: this.shapes[0].x,
                    y: this.shapes[0].y,
                    width: this.width,
                    height: this.height
                }
            ]
        };
    }

    draw(context) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                for (let shape of this.shapes) {
                    context.fillStyle = '#21c521';
                    context.fillRect(shape.x+j, shape.y+i, shape.width, shape.height);
                }
            }
            
        }
    }
}

class SpaceInvadersGame {
    constructor(canvasId) {
        this.canvasElement = document.getElementById(canvasId);
        this.canvasContext = this.canvasElement.getContext("2d");
        this.frameRate = 25;
        this.canvasWidth = 1000;
        this.badShipRows = 5;
        this.badShipsPerRow = 7;
        this.badShipDirection= '';
        this.badShipsBulletsPerSecond = 1;
        this.badShips = [];
        this.bullets =[];
        this.rocks = [];
    }

    newGame() {
        this.initialiseBadShips();
        this.players = [new GoodShip(this)];
        this.initialiseGoodShip(this.players[0]);
        this.initialiseRocks();
    }

    startGame() {
        this.runGame();
    }

    runGame() {
        // Arrow funciton here will ensure this is bound to SpaceInvadersGame and not window.
        setInterval(() => {
            this.moveBadShips();
            this.checkForCollisions();
        }, 1000/this.frameRate);

        setInterval(() => {
            this.shootBadBullets();
        }, 1000);
        
        setInterval(() => {
            this.moveBullets('goodShip');
            this.checkForCollisions();
        }, 1000/(this.frameRate*10));

        setInterval(() => {
            this.moveBullets('badShip');
            this.checkForCollisions();
        }, 1000/(this.frameRate));
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
            object.destroy();
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

        // Rock shapes are a bit different
        if (object1 instanceof Rock) {
            object1 = object1.getShapes();
        } else if (object2 instanceof Rock) {
            object2 = object2.getShapes();
        }

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
                    this.destroyObject(bullet);
                    collision = true;
                    break;
                } else {
                    continue;
                }
            }
            if (collision) { continue; }

            for (let row of this.badShips) {
                for (let badShip of row) {
                    if (this.isColliding(bullet, badShip)) {
                        if (bullet.owner instanceof BadShip) {
                            continue;
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
                        continue;
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
                        // do nothing - this shouldnt be possible
                        continue;
                    }
                    collision = true;
                    break;
                } else {
                    continue;
                }
                    
            }
            if (collision) { continue; }

            if (bullet.isAtExtremity('top', this.canvasElement) || bullet.isAtExtremity('bottom', this.canvasElement)) {
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
                        continue;
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
                this.moveObject(newShip, (newShip.width*j)+5, (newShip.height*i)+25); // For initialise delta is set relative to 0, 0. newShip.width/height*j/i should offset from the previous ship and produce a gutter
                newShip.draw(this.canvasContext);
                this.badShips[i].push(newShip);
            }
        }
    }

    initialiseGoodShip(goodShip) {
        // goodShip.addEventListeners();
        this.moveObject(goodShip, (this.canvasElement.width/2)-(goodShip.width/2), (this.canvasElement.height)-(goodShip.height+10));
        this.drawObject(goodShip);
    }

    initialiseRocks() {
        for (let i = 0; i < 3; i++) {
            let rock = new Rock;
            this.rocks.push(rock);
            let canvas = this.canvasContext;
            rock.draw(canvas);
        }
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
            // As badShips are destroyed rows become empty.
            if (row.length > 0) {
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

                let deltaX = this.badShipDirection ? 1 : -1;
                let deltaY = 0;

                for (let ship of row) {
                    this.moveObject(ship, deltaX, deltaY);
                    this.drawObject(ship);
                }
            }
        }
    }

    moveBullets(ownerType) {
        for (let bullet of this.bullets) {
            if (ownerType == 'badShip' && bullet.owner instanceof BadShip) {
                this.moveObject(bullet, 0, 1);
                this.drawObject(bullet);
            } else if (ownerType == 'goodShip' && bullet.owner instanceof GoodShip) {
                this.moveObject(bullet, 0, -1);
                this.drawObject(bullet);
            }
        }
    }

    // shoot bullets from X random bad ships
    shootBadBullets() {
        for (let i = 1; i <= this.badShipsBulletsPerSecond; i++) {
            let rowIndex = Math.floor(Math.random()*this.badShips.length);
            let shipIndex = Math.floor(Math.random()*this.badShips[rowIndex].length);
            let ship = this.badShips[rowIndex][shipIndex];
            // badShip may have already been destroyed
            if (ship) { ship.fireBullet(); }
        }
    }
}