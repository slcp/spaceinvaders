class Moveable {
    constructor() {
        this.position = {x: 0, y: 0};
    }

    move(deltaX, deltaY) {
        for (let shape of this.shapes) {
            shape.oldX = shape.x;
            shape.oldY = shape.y;
            shape.x += deltaX;
            shape.y += deltaY;
            console.log("moving")
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
        this.width = 7;
        this.heightt = 5;
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
        const key_code_left = 37;
        const key_code_right = 39;
        const key_code_space = 32;

        const x = this

        window.addEventListener('keydown', (event) => {
            if (event.keyCode === key_code_left){
                x.move(-5, 0)
                console.log(event)
                console.log('left')
            } else if (event.keyCode === key_code_right){
                x.move(+5, 0)
                console.log(event)
                console.log('RIGHT')
            }
        });
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

const key_code_left = 37;
const key_code_right = 39;
const key_code_space = 32;

class SpaceInvadersGame {
    constructorn(canvasId) {
        this.canvasElement = document.getElementById(canvasId);
        this.canvasWidth = 100;
        this.players = [new GoodShip];
        this.badShipRows = 4;
        this.badShipsPerRow = 4;
        this.badShips = { // Object of rows, each row is an array of badShips
            0: []
        };
        this.rocks = [];
    }

    newGame() {
        this.initialiseBadShips();
    }

    moveObject(object, deltaX, deltaY) {
        object.move(deltaX, deltaY);
        this.drawObject(object);
    }

    drawObject() {
        // Draw on canvas <-- Luke
    }
    
    onkeydown(e){
        let gShip = new GoodShip 
        if(e.keyCode === key_code_left){
            console.log("left")
            this.moveObject(gShip, 5, 0) -= 5;
            const $player = document.querySelector(".player")
            console.log($player)
            setPosition($player, game_state.playerX, game_state.playerY);
            
        } else if (e.keyCode === key_code_right){
            console.log("right")
            this.moveObject(gShip, 5, 0) += 5;
            const $player = document.querySelector(".player");
            console.log($player)
            setPosition($player, game_state.playerX, game_state.playerY);
        }
    }

    

    // Draw a grid of badShips
    initialiseBadShips() {
        for (let i = 0; i < this.badShipRows; i++) { // Loop for number of rows required
            for (let j = 0; j < this.badShipsPerRow; j ++) { // Loop for ships required on each row
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

    
    checkForCollisions() {

    }
}