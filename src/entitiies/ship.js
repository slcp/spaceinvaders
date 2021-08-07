
// class Ship extends Moveable {
//   constructor(game, settings, eventBus) {
//     super(settings);
//     this.game = game;
//     this.eventBus = eventBus;
//     this.bullet = "";
//     this.bulletInPlay = false;
//     this.width = 80;
//     this.height = 80;
//   }

//   fireBullet() {
//     if (!this.bulletInPlay || this.settings.continuousFire) {
//       let bullet = this.game.createBullet(this);
//       const xValues = this.shapes.map((shape) => shape.x);
//       const minX = Math.min(...xValues);
//       const maxX = Math.max(...xValues);
//       const deltaX =
//         Math.max(...xValues) + this.shapes.find((s) => s.x === maxX).width;
//       const diff = deltaX - minX;
//       moveObject({
//         object: bullet,
//         // TODO: This assumes the bullet has one shape, will need a way to get bullets width
//         deltaX: minX + diff / 2 - bullet.shapes[0].width / 2,
//         deltaY: Math.min(...this.shapes.map((shape) => shape.y)),
//       });
//       this.game.drawObject(bullet);
//     }
//   }
// }

export const newShip = () => ({
  bullet: "",
  bulletInPlay: false,
  width: 80,
  height: 80,
});