function draw() {
    let canvas = document.getElementById('game-canvas');
    let ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'white';
    ctx.fillRect(10, 10, 75, 50);
    
    ctx.fillStyle = '#21c521';
    ctx.fillRect(350, 500, 100, 75);
}

draw();
