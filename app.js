const key_code_left = 37;
const key_code_right = 39;
const key_code_space = 32;
//Area of the game using width and hieght 
const game_width = 800;
const game_height = 600;

//
const game_state = {
    playerX: 0,
    playerY: 0,
}

function setPosition($el, x, y) {
    $el.style.transform = `translate(${x}px), ${y}px`;
}

function createPlayer($container) {
    game_state.playerX = game_width /2;
    game_state.playerY = game_height - 50;

    const $player = document.createElement("img");
    $player.src = "img/spaceplayer.png";
    $player.className = "player";
    $container.appendChild($player);
    setPosition($player, game_state.playerX, game_state.playerY);
}
// Init function initialize all entaties in the game both players and enemies
function init() {
    //Select the emlement that we would like to put our entaties in
    const $container = document.querySelector(".game");
    createPlayer($container);
    const  
}

function onkeydown(e){
    console.log(e)
    if(e.keycode === key_code_left){
        game_state.playerX -= 5;
        const $player = document.querySelector(".player")
        setPosition($player, game_state.playerX, game_state.playerY);
    } else if (e.keycode === key_code_right){
        game_state.playerX += 5;
        const $player = document.querySelector(".player");
        setPosition($player, game_state.playerX, game_state.playerY);
    }
}

// calling Init function
init();
window.addEventListener("keydown", onkeydown);