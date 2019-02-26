let canvas = document.getElementById('space-invaders');
let context = canvas.getContext("2d");

class TestShip {
    constructor() {
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
    
    draw() {
        for (let shape of this.shapes) {
            context.fillRect(shape.x, shape.y, shape.width, shape.height);
        }
    }
}

ship = new TestShip;
ship.draw();