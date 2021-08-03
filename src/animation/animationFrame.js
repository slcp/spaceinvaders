// class AnimationFrame {
//   constructor(id, ms, action) {
//     this.id = id;
//     this.ms = ms;
//     this.action = action;
//   }
// }

export const ANIMATION_FRAME_TYPE = "_animationFrame";

export const newAnimationFrame = (id, ms, action) => ({
  type: ANIMATION_FRAME_TYPE,
  id,
  ms,
  action,
});

export default AnimationFrame;
