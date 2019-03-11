let game = new SpaceInvadersGame('game-canvas');
let newGameButton = document.getElementById('new-game');
let nextLevelButton = document.getElementById('next-level');

newGameButton.addEventListener('click', () => {
    game.newGame();
})

nextLevelButton.addEventListener('click', () => {
    game.nextLevel();
})