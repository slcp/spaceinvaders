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

    randomColor() {
        // gets random colour
        return "#"+((1<<24)*Math.random()|0).toString(16);
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
    }

    draw(context) {
        for (let shape of this.shapes) {
            context.clearRect(shape.oldX, shape.oldY, shape.width, shape.height);
        }
        // Draw in new position
        for (let shape of this.shapes) {
            context.fillStyle = shape.color ? shape.color : this.randomColor();
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
}

class Ship extends Moveable {
    constructor() {
        super();
        this.game = game;
        this.bullet = '';
        this.bulletInPlay = false;
        this.width = 80; // TODO: static currently to test if it initialiseBadShips works
        this.height = 80; // TODO: static currently to test if it 
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
    constructor() {
        super();
        this.shapes = [
            {
                x: 20,
                y: 5,
                width: 60,
                height: 20,
                color: '#21c521'
            },
            {
                x: 45,
                y: -5,
                width: 10,
                height: 40,
                color: '#21c521'
            },
            {
                x: 30,
                y: 15,
                width: 10,
                height: 30,
                color: '#21c521'
            },
            {
                x: 60,
                y: 15,
                width: 10,
                height: 30,
                color: '#21c521'
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
                x: 20,
                y: 32,
                width: 60,
                height: 8,
                color: 'white'
            },
            {
                x: 40,
                y: 28,
                width: 20,
                height: 20,
                color: 'white'
            },
            {
                x: 20,
                y: 20,
                width: 12,
                height: 20,
                color: 'white'
            },
            {
                x: 68,
                y: 20,
                width: 12,
                height: 20,
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
                x: 20,
                y: 10,
                width: 4,
                height: 28
            },
        ];
        this.owner = owner;
    }
}

class Rock {
    constructor() {
        this.shapes = [
            {
                x: 100,
                y: 650,
                width: 30,
                height: 45
            },
        ];
        this.width = 30;
        this.height = 45;
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
        }, 250/this.frameRate);

        setInterval(() => {
            this.shootBadBullets();
        }, 250);
        
        setInterval(() => {
            this.moveBullets('goodShip');
            this.checkForCollisions();
        }, 250/(this.frameRate*10));

        setInterval(() => {
            this.moveBullets('badShip');
            this.checkForCollisions();
        }, 250/(this.frameRate));
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

    killBullet(object) {
        let canvasContext = this.canvasContext
        object.kill(canvasContext);
        object.owner.bulletInPlay = false;
        object.owner.bullet = '';
        let bulletIndex = this.bullets.indexOf(object);
        this.bullets.splice(bulletIndex, 1);
    }

    findBadShip(object) {
        for (let i = 0; i < this.badShips.length; i++) {
            if (this.badShips[i].indexOf(object) >= 0) {
                let badShipIndex = this.badShips[i].indexOf(object);
                this.badShips[i].splice(badShipIndex, 1);
                break;
            }
        }
    }

    destroyGoodShip(object) {
        let canvasContext = this.canvasContext
        object.kill(canvasContext);
        object.destroy();
        let goodShipIndex = this.players.indexOf(object);
        this.players.splice(goodShipIndex, 1);
    }

    destroyObject(object) {
        let canvasContext = this.canvasContext
        if (object instanceof Rock) {
            // This is harder depending on what is impacting rock, see Trello task
        } else if (object instanceof Bullet) {
            this.killBullet(object);
        } else if (object instanceof BadShip) {
            object.kill(canvasContext);
            // Find badShip in this.badShips and remove
            this.findBadShip(object);
        } else if (object instanceof GoodShip) {
            this.destroyGoodShip(object);
        }
    }

    testCollision() {
        let testShip = new GoodShip(this);
        this.moveObject(testShip, 0, 125);
        this.drawObject(testShip);
        this.isColliding(testShip, this.players[0]);
    }

    checkObj(object1, object2) {
        if (object1 instanceof Rock) {
            object1 = object1.getShapes();
        } else if (object2 instanceof Rock) {
            object2 = object2.getShapes();
        }
    }

    isColliding(object1, object2) {
        let colliding = false;
        // Rock shapes are a bit different
        this.checkObj(object1, object2);
        for (let i = 0; i < object1.shapes.length; i++) {
            for (let j = 0; j < object2.shapes.length; j++) {
                return colliding = !(
                    object1.shapes[i].x > (object2.shapes[j].x + object2.shapes[j].width) || 
                    (object1.shapes[i].x + object1.shapes[i].width) < object2.shapes[j].x || 
                    object1.shapes[i].y > (object2.shapes[j].y + object2.shapes[j].height) ||
                    (object1.shapes[i].y + object1.shapes[i].height) <  object2.shapes[j].y
                );
            }
            if (colliding)break;
        }
    }

    updateScore(num) {
        const score = document.querySelector('.score');
        let scoreNum = parseInt(score.textContent);
        scoreNum += num;
        score.textContent = scoreNum;
    }

    decreaseLives() {
        const life = document.getElementsByClassName('life');
        life[0].remove();
    }

    resetScore(num) {
        const score = document.querySelector('.score');
        let scoreNum = parseInt(score.textContent);
        scoreNum = num;
        score.textContent = scoreNum;
    }

    checkGoodShipCollision() {
        for (let row of this.badShips) {
            for (let badShip of row) {
                if (this.isColliding(bullet, badShip)) {
                    if (bullet.owner instanceof BadShip) {
                        continue;
                    } else if (bullet.owner instanceof GoodShip) {
                        // goodShip bullet + badShip colliding
                        this.destroyObject(badShip);
                        this.destroyObject(bullet);
                        this.updateScore(10);
                    }
                    collision = true;
                    break;
                } else {
                    continue;
                }
            }
            if (collision) break;
        }
    }

    destoryBulletAtX(bullet) {
        if (bullet.isAtExtremity('top', this.canvasElement) || bullet.isAtExtremity('bottom', this.canvasElement)) {
            this.destroyObject(bullet);
        }
    }

    isRockCollision(bullet) {
        for (let rock of this.rocks) {
            if (this.isColliding(bullet, rock)) {
                // bullet + rock colliding
                this.destroyObject(bullet);
                let collision = true;
                return collision;
            } else {
                continue;
            }
        }
    }

    goodBulletHasHit(bullet) {
        let collision = false;
        for (let row of this.badShips) {
            for (let badShip of row) {
                if (this.isColliding(bullet, badShip)) {
                    if (bullet.owner instanceof BadShip) {
                        continue;
                    } else if (bullet.owner instanceof GoodShip) {
                        // goodShip bullet + badShip colliding
                        this.destroyObject(badShip);
                        this.destroyObject(bullet);
                        this.updateScore(10);
                    }
                    collision = true;
                    break;
                } else {
                    continue;
                }
            }
            if (collision) break;
        }
    }

    badBulletHasHit(bullet) {
        for (let goodShip of this.players) {
            if (this.isColliding(bullet, goodShip)) {
                if (bullet.owner instanceof BadShip) {
                    // badShip bullet + goodShip colliding
                    this.resetScore(0)
                    this.destroyObject(goodShip);
                    this.destroyObject(bullet);
                    this.decreaseLives();
                } else if (bullet.owner instanceof GoodShip) {
                    // do nothing - this shouldnt be possible
                    continue;
                }
                let collision = true;
                return collision;
            } else {
                continue;
            }  
        }
    }

    badShipHitRock() {
        for (let row of this.badShips) {
            for (let badShip of row) {
                for (let rock of this.rocks) {
                    if (this.isColliding(badShip, rock)) {
                        // badShip bullet + rock colliding
                        // damage rock precisely where positions intersect
                    }  continue;
                }
            }
        }
    }

    checkForCollisions() {
        for (let bullet of this.bullets) {
            let collision = false;
            // TODO:  Break loops if impacts occurs
                this.isRockCollision(bullet);
                this.goodBulletHasHit(bullet);
                this.badBulletHasHit(bullet);
            if (collision) continue;
            this.destoryBulletAtX(bullet) 
        }
        this.badShipHitRock();
}

    // Draw a grid of badShips
    initialiseBadShips() {
        for (let i = 0; i < this.badShipRows; i++) { // Loop for number of rows required
            this.badShips[i] = []; // Initialise row in array
            for (let j = 0; j < this.badShipsPerRow; j ++) { 
                let newShip = new BadShip(this);
                this.moveObject(newShip, (newShip.width*j)+5, (newShip.height*i)+150);
                newShip.draw(this.canvasContext);
                this.badShips[i].push(newShip);
            }   
        }
    }

    initialiseGoodShip(goodShip) {
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

    shipsLeftCanvas(firstShip, lastShip) {
        if (firstShip.isAtExtremity('left', this.canvasElement)) {
            this.badShipDirection = true;
        // Ships have hit right side of canvas, deltaX needs to be -1
        } else if (lastShip.isAtExtremity('right', this.canvasElement)) {
            this.badShipDirection = false;
        }
    }

    moveBadShips() {
        for (let row of this.badShips) {
            let firstShip = row[0];
            let lastShip = row[row.length-1];
            if (row.length > 0) {
                this.shipsLeftCanvas(firstShip, lastShip);
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
            } else if (ownerType == 'goodShip' && bullet.owner instanceof GoodShip) {
                this.moveObject(bullet, 0, -1);
            }
            this.drawObject(bullet);
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