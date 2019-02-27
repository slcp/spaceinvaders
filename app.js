<<<<<<< HEAD
function draw() {
    let canvas = document.getElementById('game-canvas');
    let ctx = canvas.getContext('2d');
    
    // bad ship recetangle placeholder
    ctx.fillStyle = 'white';
    ctx.fillRect(10, 10, 75, 50);
    
    // good ship rectangle placeholder
    ctx.fillStyle = '#21c521';
    ctx.fillRect(350, 500, 100, 75);
}

let game = new SpaceInvadersGame('game-canvas');
game.newGame();
setInterval(() => {
    game.moveBadShips();
}, 100);

const key_code_left = 37;
const key_code_right = 39;
const key_code_space = 32;

function onkeydown(e){
    console.log(e.keyCode === key_code_left)
    if(e.keyCode === key_code_left){
        console.log("left")
        game_state.playerX -= 5;
        const $player = document.querySelector(".player")
        console.log($player)
        setPosition($player, game_state.playerX, game_state.playerY);
    } else if (e.keyCode === key_code_right){
        console.log("right")
        game_state.playerX += 5;
        const $player = document.querySelector(".player");
        console.log($player)
        setPosition($player, game_state.playerX, game_state.playerY);
    }
}

draw();
window.addEventListener("keydown", onkeydown);
=======
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

    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

    draw(context) {
        // Clear existing draw of object
        for (let shape of this.shapes) {
            context.clearRect(shape.oldX, shape.oldY, shape.width, shape.height);
        }

        // Draw in new position and update positiong
        for (let shape of this.shapes) {
            context.fillStyle = this.getRandomColor();
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
        this.badShipRows = 3;
        this.badShipsPerRow = 10;
        this.badShipDirection= '';
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
                this.moveObject(newShip, (newShip.width*j)+5, (newShip.height*i)+5); // For initialise delta is set relative to 0, 0. newShip.width/height*j/i should offset from the previous ship and produce a gutter
                newShip.draw(this.canvasContext);
                this.badShips[i].push(newShip);
            }
            
        }
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
                console.log(deltaX);
                this.moveObject(ship, deltaX, deltaY);
                this.drawObject(ship);
            }
        }
    }
}
>>>>>>> 49d6bb26be2b7f21cfcd8b9ae41ba6eccf4b8f27
