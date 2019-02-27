let game = new SpaceInvadersGame('space-invaders');
game.newGame();
setInterval(() => {
    console.log('moving');
    game.moveBadShips();
}, 1000);