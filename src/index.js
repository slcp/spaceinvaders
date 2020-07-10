import SpaceInvadersGame from './game';

const gameContext = {
    canvas: document.getElementById("game-canvas"),
    scoreBoard: document.getElementById('score'),
    newGameButton: document.getElementById('new-game'),
    gameMessage: document.getElementById('game-message'),
}

new SpaceInvadersGame(gameContext).init();
