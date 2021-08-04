import { newShape } from "../canvas/shape";

//   move(deltaX, deltaY) {
//     this.getShapes();
//     super.move(deltaX, deltaY);
//   }

//   findDamageFrom(object) {
//     if (object instanceof Bullet) {
//       for (let shape of this.shapes) {
//         if (this.isColliding(shape, object)) {
//           // Remove the shape from the rock, the game will clear it from the canvas
//           this.shapes.splice(this.shapes.indexOf(shape), 1);
//           return shape;
//         }
//       }
//       console.log(
//         "something has gone wrong, the game thought the rock has collided with the bullet but the rock thinks otherwise!!"
//       );
//       return;
//     }
//   }

//   isColliding(shape, object2) {
//     return new CollisionCheck(shape, object2.shapes).isColliding();
//   }
// }

export const ROCK_TYPE = "_rock";

export const initialiseRock = (rock, settings) => {
  if (!rock.width) {
    throw new Error("rock width must be set");
  }

  const shapes = [];
  const { rockParticleWidth, rockParticleHeight } = settings;
  for (
    let i = 0;
    i < rock.width / ((rockParticleWidth / 100) * rock.width);
    i++
  ) {
    const shape = newShape(
      i * rockParticleWidth, // inset from left edge
      800, // inset from top
      rockParticleWidth,
      rockParticleHeight
    );
    shapes.push(shape);
    rock.shapes = shapes;
  }
};

export const newRock = (width) => ({
  _type: ROCK_TYPE,
  shapes: false,
  width,
  // height,
});
