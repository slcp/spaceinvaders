let game = new SpaceInvadersGame('game-canvas');
let newGameButton = document.getElementById('new-game');

newGameButton.addEventListener('click', () => {
    game.newGame();
})