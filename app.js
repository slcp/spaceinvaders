class Moveable {
    constructor(settings) {
        this.shapes = [];
        this.settings = settings;
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

    // changeShipColor() {
    //     // change color of ship depending on which side is hit
    //     if(this.isAtExtremity('left')) {
    //         return 'blue';
    //     } else if (this.isAtExtremity('right')){
    //         return 'red';
    //     } else {
    //         return 'white';
    //     }
    // }

    kill(context) {
        // Clear existing draw of object
        for (let shape of this.shapes) {
            context.clearRect(shape.x, shape.y, shape.width, shape.height);
            context.clearRect(shape.oldX, shape.oldY, shape.width, shape.height);
        }

        // No need to explicity destroy instance but ensure no references to it exist if it needs to be destroyed - garbage collection
        
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
    constructor(game, settings) {
        super(settings);
        this.game = game;
        this.bullet = '';
        this.bulletInPlay = false;
        this.width = 80;
        this.height = 80;
    }

    fireBullet() {
        if (!this.bulletInPlay || this.settings.continuousFire) {
            let bullet = this.game.createBullet(this);
            // This does not exactly identify bullet exit point and also needs to be more readable
            this.game.moveObject(bullet, Math.floor(...this.shapes.map(shape => shape.x)), Math.floor(...this.shapes.map(shape => shape.y)));
            this.game.drawObject(bullet);
        }
    }
}

class GoodShip extends Ship {
    constructor(game, settings) {
        super(game, settings);
        this.shapes = [
            {
                x: 20,
                y: 40,
                width: 60,
                height: 20,
                color: '#21c521'
            },
            {
                x: 40,
                y: 20,
                width: 20,
                height: 20,
                color: '#21c521'
            },
            {
                x: 20,
                y: 55,
                width: 20,
                height: 20,
                color: '#21c521'
            },
            {
                x: 60,
                y: 55,
                width: 20,
                height: 20,
                color: '#21c521'
            }
        ];
        this.score = 0;
        this.shootTrigger = 'Space';
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    destroy() {
        for (let interval of this.intervals) {
            clearInterval(interval);
            removeEventListener('keydown', this.handleKeyDown);
            removeEventListener('keyup', this.handleKeyUp);
        }
    }

    updateScore(delta) {
        this.score += delta;
    }

    addEventListeners() {
        this.intervals = [];
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyDown(event) {
        event.preventDefault();
        if (event.code === this.shootTrigger) {
            this.fireBullet();
            if (!this.intervals[event.keyCode]) {
                this.intervals[event.keyCode] = setInterval(() => this.fireBullet(), 100);
            }
        } else if (event.code === 'ArrowLeft') {
            if (!this.intervals[event.keyCode]) {
                this.intervals[event.keyCode] = setInterval(() => {
                    this.game.moveObject(this, -1, 0);
                    this.game.drawObject(this);
                }, 1000/300);
            }
        } else if (event.code === 'ArrowRight') {
            if (!this.intervals[event.keyCode]) {
                this.intervals[event.keyCode] = setInterval(() => {
                    this.game.moveObject(this,1, 0);
                    this.game.drawObject(this);
                }, 1000/300);
            }
        }
    };

    handleKeyUp(event) {
        event.preventDefault();
        clearInterval(this.intervals[event.keyCode]);
        this.intervals[event.keyCode] = false;
    };
}

class BadShip extends Ship {
    constructor(game, settings) {
        super(game, settings);
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
    constructor(owner, settings) {
        super(settings);
        this.shapes = [
            {
                x: 20,
                y: 10,
                width: 2,
                height: 10
            },
        ];
        this.owner = owner;
    }
}

class Rock extends Moveable {
    constructor(width, settings) {
        super(settings)
        this.shapes = false;
        this.rockParticleWidth = 50;
        this.particleHeight = 45;
        this.width = width;
        //this.height = ;
    }

    getShapes() {
        if (!this.shapes) {
            let shapes = new Array;
            for (let i = 0; i < this.width/(this.settings.rockParticleWidth/100 * this.width); i++) {
                shapes.push({
                    x: (i*this.settings.rockParticleWidth),
                    y: 800,
                    width: this.settings.rockParticleWidth,
                    height: this.settings.rockParticleHeight
                });
            }
            
            this.shapes = shapes;
        }
    }

    draw(context) {
        this.getShapes();
        // Draw in new position
        for (let shape of this.shapes) {
            context.fillStyle = '#21c521';
            context.fillRect(
                shape.x,
                shape.y,
                shape.width,
                shape.height);
        }
    }

    move(deltaX, deltaY) {
        this.getShapes();
        super.move(deltaX, deltaY);
    }

    takeDamageFrom(object, context) {
        if (object instanceof Bullet) {
            let damageTaken = false;
            for (let shape of this.shapes) {
                if (this.isColliding(shape, object)) {
                    context.clearRect(shape.x, shape.y, shape.width, shape.height);
                    this.shapes.splice(this.shapes.indexOf(shape), 1);
                    damageTaken = true
                }
            }
            return damageTaken;
        }
    }

    isColliding(shape, object2) {
        let colliding = false;

        for (let j = 0; j < object2.shapes.length; j++) {
            if (!(
                shape.x > (object2.shapes[j].x + object2.shapes[j].width) || 
                (shape.x + shape.width) < object2.shapes[j].x || 
                shape.y > (object2.shapes[j].y + object2.shapes[j].height) ||
                (shape.y + shape.height) <  object2.shapes[j].y
            )) { colliding = true; break; }
        }

        return colliding;
    }
}

class SpaceInvadersGame {
    constructor(canvasId) {
        this.canvasElement = document.getElementById(canvasId);
        this.canvasContext = this.canvasElement.getContext("2d");
        this.gameIntervals = [];
        this.badShips = [];
        this.players = [];
        this.bullets =[];
        this.rocks = [];
        this.currentLevel = 0;
        this.currentLevelMode = 'standard';
        this.levelData = [
            {
                standard: {
                    game: {
                        numRocks: 3,
                        rockWidth: 100,
                        rocKheight: 1,
                        rockWhiteSpace: 1,
                        badShipScale: 0.5,
                        badShipRows: 7,
                        badShipsPerRow: 5,
                        badShipsBulletsPerSecond: 25,
                        badShipFramerate: 400,
                        goodBulletFramerate: 800,
                        badBulletFramerate: 50
                    },
                    goodShip: {
                        continuousFire: false,
                    },
                    badShip: {
                        continuousFire: true,
                    },
                    rock: {
                        rockParticleWidth: 1,
                        rockParticleHeight: 45,
                    }
                },
                special: {
                    goodShip: {
                        continuousFire: true,
                    },
                    game: {
                        badShipsBulletsPerSecond: 10,
                    }
                }
            },
            {
                standard: {
                    game: {
                        numRocks: 3,
                        rockWidth: 50,
                        rocKheight: 1,
                        rockWhiteSpace: 2,
                        badShipScale: 0.5,
                        badShipRows: 1,
                        badShipsPerRow: 1,
                        badShipsBulletsPerSecond: 25,
                        badShipFramerate: 200,
                        goodBulletFramerate: 800,
                        badBulletFramerate: 100
                    },
                    goodShip: {
                        continuousFire: true,
                    },
                    badShip: {
                        continuousFire: true,
                    },
                    rock: {
                        rockParticleWidth: 20,
                        rockParticleHeight: 45,
                    }
                },
                special: {
                    goodShip: {
                        continuousFire: true,
                    },
                    game: {
                        badShipsBulletsPerSecond: 10,
                    }
                }
            }
        ]
    }

    getSetting(setting) {
        let currentLevelData = this.levelData[this.currentLevel][this.currentLevelMode];

        switch (setting) {
            case 'numRocks': 
            case 'rockWidth':
            case 'rockWhiteSpace':
            case 'badShipRows':
            case 'badShipsPerRow':
            case 'badShipsBulletsPerSecond':
            case 'badShipFramerate':
            case 'goodBulletFramerate':
            case 'badBulletFramerate':
                return currentLevelData['game'][setting];

            case 'continuousFire':
                return currentLevelData['goodShip'][setting];

            case 'rockHeight':
            case 'rockWidth':
            case 'rockParticleWidth':
            case 'rockParticleHeight':
                return currentLevelData['rock'][setting]
        }
    }

    getSettingsFor(objectType) {
        let currentLevelData = this.levelData[this.currentLevel][this.currentLevelMode];

        return currentLevelData[objectType];
    }

    newGame() {
        this.endGame();
        this.gameState = 'NEW_GAME';
        this.players.push(new GoodShip(this, this.getSettingsFor('goodShip')));
        this.startGame();
    }

    endGame() {
        this.clearGameIntervals();
        this.destroyGoodShips();
        this.destroyRocks();
        this.destroyBullets();
        this.destroyBadShips();
    }

    startGame() {
        this.gameState = 'START_GAME';
        this.initialiseBadShips();
        for (let goodShip of this.players) {
            this.initialiseGoodShip(goodShip);
        }
        this.initialiseRocks();
        this.runGame();
    }

    gameWon() {
        this.clearGameIntervals();
        this.destroyBullets();
        this.setGameMessage();
    }

    runGame() {
        this.gameState = 'GAME_RUNNING'
        // Arrow funciton here will ensure this is bound to SpaceInvadersGame and not window.
        this.gameIntervals.push(setInterval(() => {
            this.moveBadShips();
        }, 1000/this.getSetting('badShipFramerate')));

        this.gameIntervals.push(setInterval(() => {
            this.shootBadBullets();
        }, 1000));
        
        this.gameIntervals.push(setInterval(() => {
            this.moveBullets('goodShip');
        }, 1000/this.getSetting('goodBulletFramerate')));

        this.gameIntervals.push(setInterval(() => {
            this.moveBullets('badShip');
            this.checkForCollisions();
            
            switch (this.gameState) {
                case 'LEVEL_WON':
                    if (this.currentLevel === this.levelData.length-1) {
                        this.gameState = 'GAME_WON';
                        this.gameWon();
                        // Check highscore status
                    } else {
                        this.nextLevel();
                    }
                break;

                case 'PLAYER_DEAD':

                break;

                default:
                break;
            }
        }, 1000/this.getSetting('badBulletFramerate')));

        this.gameIntervals.push(setInterval(() => {
            
        }, 100));
    }

    nextLevel() {
        this.currentLevel++;
        this.endGame();
        this.startGame();
    }

    clearGameIntervals() {
        for (let interval of this.gameIntervals) {
            clearInterval(interval);
        }
    }

    setGameMessage() {
        switch(this.gameState) {
            case 'GAME_WON':
                gameMessage.textContent = 'Well done, you have won!';
                break;
        }
    }

    updateScore(player, delta) {
        player.updateScore(delta);
        score.textContent = player.score;
    }

    moveObject(object, deltaX, deltaY) {
        let canvasContext = this.canvasContext
        object.move(deltaX, deltaY, canvasContext);
    }

    drawObject(object) {
        let canvasContext = this.canvasContext
        object.draw(canvasContext);
    }

    destroyObject(object) {
        let canvasContext = this.canvasContext

        // Rocks damage themselves - this will remove an entire rock from the game
        if (object instanceof Rock) {
            object.kill(canvasContext);

            if (this.gameState == 'GAME_RUNNING') {
                let rockIndex = this.rocks.indexOf(object);
                this.rocks.splice(rockIndex, 1);
            }
        } else if (object instanceof Bullet) {
            object.kill(canvasContext);
            object.owner.bulletInPlay = false;
            object.owner.bullet = '';

            if (this.gameState === 'GAME_RUNNING') {
                let bulletIndex = this.bullets.indexOf(object);
                this.bullets.splice(bulletIndex, 1);
            }
        } else if (object instanceof BadShip) {
            object.kill(canvasContext);
            // Find badShip in this.badShips and remove
            for (let i = 0; i < this.badShips.length; i++) {
                if (this.badShips[i].indexOf(object) >= 0) {
                    if (this.gameState === 'GAME_RUNNING') {
                        let badShipIndex = this.badShips[i].indexOf(object);
                        this.badShips[i].splice(badShipIndex, 1);
                    }
                    break;
                }
            }
        } else if (object instanceof GoodShip) {
            
            switch(this.gameState) {
                case 'GAME_WON':

                    break;
                
                case 'LEVEL_WON':
                    break;

                case 'GAME_RUNNING':
                    object.kill(canvasContext);
                    object.destroy();
                    let goodShipIndex = this.players.indexOf(object);
                    this.players.splice(goodShipIndex, 1);
                    break;
                
                default:
                    break;
            }
        }
    }

    testCollision() {
        let testShip = new GoodShip(this, this.getSettingsFor('goodShip'));
        this.moveObject(testShip, 0, 125);
        this.drawObject(testShip);
        this.isColliding(testShip, this.players[0]);
    }

    isColliding(object1, object2) {
        let colliding = false;

        for (let i = 0; i < object1.shapes.length; i++) {
            for (let j = 0; j < object2.shapes.length; j++) {
                if (!(
                    object1.shapes[i].x > (object2.shapes[j].x + object2.shapes[j].width) || 
                    (object1.shapes[i].x + object1.shapes[i].width) < object2.shapes[j].x || 
                    object1.shapes[i].y > (object2.shapes[j].y + object2.shapes[j].height) ||
                    (object1.shapes[i].y + object1.shapes[i].height) < object2.shapes[j].y
                )) { colliding = true;  break; }
            }
            if (colliding) { break; }
        }

        return colliding;
    }

    checkForCollisions() {
        for (let bullet of this.bullets) {
            let collision = false;
            
            // TODO:  Break loops if impacts occurs
            for (let rock of this.rocks) {
                if (this.isColliding(bullet, rock)) {
                    // bullet + rock colliding
                    let passThrough = !rock.takeDamageFrom(bullet, this.canvasContext);
                    if (!passThrough) {
                        this.destroyObject(bullet);
                    }

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
                            badShip.draw(this.canvasContext);
                            continue;
                        } else if (bullet.owner instanceof GoodShip) {
                            // goodShip bullet + badShip colliding
                            this.destroyObject(badShip);
                            this.destroyObject(bullet);
                            this.updateScore(bullet.owner, 100);

                            let badShipCount = 0;
                            for (row of this.badShips) {
                                badShipCount += row.length;
                            }

                            this.gameState = badShipCount === 0 ? 'LEVEL_WON' : this.gameState;
                            
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
                        
                        if (goodShip.hasLives()) {
                            this.initialiseGoodShip(goodship);
                        }
                    } else if (bullet.owner instanceof GoodShip) {
                        // do nothing - this shouldnt be possible
                        goodShip.draw(this.canvasContext);
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
                        // badShip + rock colliding
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
        for (let i = 0; i < this.getSetting('badShipRows'); i++) { // Loop for number of rows required
            this.badShips[i] = []; // Initialise row in array
            for (let j = 0; j < this.getSetting('badShipsPerRow'); j ++) { // Loop for ships required on each row
                let newShip = new BadShip(this, this.getSettingsFor('badShip'));
                this.moveObject(newShip, (newShip.width*j)+5, (newShip.height*i)+150); // For initialise delta is set relative to 0, 0. newShip.width/height*j/i should offset from the previous ship and produce a gutter
                newShip.draw(this.canvasContext);
                this.badShips[i].push(newShip);
            }  
        }
    }

    destroyBadShips() {
        for (let row of this.badShips) {
            for (let ship of row) {
                this.destroyObject(ship);
            }
        }

        this.badShips = [];
    }

    initialiseGoodShip(goodShip) {
        goodShip.addEventListeners();
        // Draw in centre of canvas
        this.moveObject(goodShip, (this.canvasElement.width/2)-(goodShip.width/2), (this.canvasElement.height)-(goodShip.height+10));
        this.drawObject(goodShip);
    }

    destroyGoodShips() {
        for (let ship of this.players) {
            this.destroyObject(ship);
        }

        this.players = [];
    }

    // Lower levels will have a central rock protecting goodPlayer spawn point
    // Higher levels will not have a central
    // Draw from middle and switch between positive/negative offset
    initialiseRocks() {
        let canvasCentre = this.canvasElement.width/2;
        let canvas = this.canvasContext;
        let counter = 0;
        let offSetNegative = false;

        for (let i = 0; i < this.getSetting('numRocks'); i++) {
            let offSet = offSetNegative ? -counter : counter;
            let rock = new Rock(this.getSetting('rockWidth'), this.getSettingsFor('rock'));

            rock.move(canvasCentre-(this.getSetting('rockWidth')/2), 0);
            
            if (offSetNegative) { counter++; }
            
            if (i !== 0) {
                rock.move((offSet*this.getSetting('rockWidth'))+(offSet*this.getSetting('rockWidth')*this.getSetting('rockWhiteSpace')), 0);
                offSetNegative = !offSetNegative;
            } else {
                counter++;
            }

            this.rocks.push(rock);
            rock.draw(canvas);
        }
    }

    destroyRocks() {
        for (let rock of this.rocks) {
            this.destroyObject(rock);
        }

        this.rocks = [];
    }

    createBullet(ship) {
        let bullet = new Bullet(this.getSettingsFor('bullet'));
        bullet.owner = ship;
        ship.bulletInPlay = true;
        this.bullets.push(bullet);
        return bullet;
    }

    destroyBullets() {
        for (let bullet of this.bullets) {
            this.destroyObject(bullet);
        }

        this.bullets = [];
    }

    // This currently just moves ships right --> TODO: hit edge of canvas and come back
    moveBadShips() {
        for (let row of this.badShips) {
            // As badShips are destroyed rows become empty.
            if (row.length > 0) {
                let firstShip = row[0];
                let lastShip = row[row.length-1];
                let maxShipHeight = 40; //Math.max(row.map(ship => ship.height));
                let deltaX = 0;
                let deltaY = 0;

                // Ships have hit left edge of canvas, deltaX needs to be +1
                if (firstShip.isAtExtremity('left', this.canvasElement)) {
                    this.badShipDirection = 'right';
                    deltaY = 10;
                // Ships have hit right side of canvas, deltaX needs to be -1
                } else if (lastShip.isAtExtremity('right', this.canvasElement)) {
                    this.badShipDirection = 'left';
                    deltaY = 10;
                }

                deltaX = this.badShipDirection === 'right' ? 1 : -1;

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
                this.moveObject(bullet, 0, 5);
                this.drawObject(bullet);
            } else if (ownerType == 'goodShip' && bullet.owner instanceof GoodShip) {
                this.moveObject(bullet, 0, -5);
                this.drawObject(bullet);
            }
        }
    }

    // shoot bullets from X random bad ships
    shootBadBullets() {
        for (let i = 1; i <= this.getSetting('badShipsBulletsPerSecond'); i++) {
            let rowIndex = Math.floor(Math.random()*this.badShips.length);
            let shipIndex = Math.floor(Math.random()*this.badShips[rowIndex].length);
            let ship = this.badShips[rowIndex][shipIndex];
            // badShip may have already been destroyed
            if (ship) { ship.fireBullet(); }
        }
    }
}