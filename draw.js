let game = new SpaceInvadersGame('game-canvas');
let newGameButton = document.getElementById('new-game');
let gameMessage = document.querySelector('.game-message');

newGameButton.addEventListener('click', () => {
    game.newGame();
})