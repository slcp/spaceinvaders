let canvas = document.getElementById('game-canvas');
let goodShip = canvas.getContext('2d');
let badShip = canvas.getContext('2d');


badShip.fillStyle = 'white';
badShip.fillRect(10, 10, 75, 50);


goodShip.fillStyle = '#21c521';
goodShip.fillRect(350, 500, 100, 75);