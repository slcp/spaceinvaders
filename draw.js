let game = new SpaceInvadersGame('game-canvas');
game.newGame();
setInterval(() => {
    game.moveBadShips();
}, 50);