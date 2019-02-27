// function draw() {
//     // Cache a reference to the html element
//     let canvas = document.getElementById('game-canvas');
    
//     // Set the drawing surface dimensions to match the canvas
//     canvas.width = canvas.scrollWidth;
//     canvas.height =  canvas.scrollHeight;

//     // bad ship recetangle placeholder
//     // ctx.fillStyle = 'white';
//     // ctx.fillRect(10, 10, 75, 50);

//     //Get a reference to the 2nd drawing context /api
//     let ctx = canvas.getContext('2d');

//     // good ship rectangle placeholder
//     // ctx.fillStyle = '#21c521';
//     // ctx.fillRect(350, 500, 100, 75);
//     var goodShip = new Image();
//     goodShip.src = "./img/PNG/playerShip1_blue.png"

//     ctx.drawImage(goodShip, 20, 20, 300, 160)
// }

const key_code_left = 37;
const key_code_right = 39;
const key_code_space = 32;

//Area of the game using width and hieght 
const game_width = 800;
const game_height = 600;

//
const game_state = {
    playerX: 0,
    playerY: 0
}

function setPosition($el, x, y) {
    $el.style.transform = `translate(${x}px), ${y}px`;
}

function createPlayer($container) {
    game_state.playerX = game_width /2;
    game_state.playerY = game_height - 50;

    const $player = document.createElement("img");
    $player.src = "./img/PNG/playerShip1_red.png";
    $player.className = "player";
    $container.appendChild($player);
    setPosition($player, game_state.playerX, game_state.playerY);
}
// Init function initialize all entaties in the game both players and enemies
function init() {
    //Select the emlement that we would like to put our entaties in
    const $container = document.querySelector(".game");
    createPlayer($container);
     
}

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

// function onkeydown(e){
//     console.log(e.keyCode === key_code_space)
//     if (e.keyCode === key_code_space){
//         console.log("firing")
//         Movable.Bullet += 36;
//     }
// }

// calling Init function
init();
window.addEventListener("keydown", onkeydown);