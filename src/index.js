import SpaceInvadersGame from './game';

let game = new SpaceInvadersGame('game-canvas');
let newGameButton = document.getElementById('new-game');
let gameMessage = document.querySelector('.game-message');
let score = document.querySelector('.score');

newGameButton.addEventListener('click', () => {
    game.newGame();
})