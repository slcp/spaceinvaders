import SpaceInvadersGame from './game';

const game = new SpaceInvadersGame('game-canvas');
const newGameButton = document.getElementById('new-game');
const gameMessage = document.querySelector('.game-message');
const score = document.getElementById('score');

newGameButton.addEventListener('click', () => {
    game.newGame();
})
