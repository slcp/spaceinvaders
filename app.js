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