let game = new SpaceInvadersGame('space-invaders');
game.newGame();
setInterval(() => {
    game.moveBadShips();
}, 100);