let canvas = document.getElementById('space-invaders');
let context = canvas.getContext("2d");

let game = new SpaceInvadersGame(context);
game.initialiseBadShips();