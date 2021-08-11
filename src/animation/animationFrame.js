// class AnimationFrame {
//   constructor(id, ms, action) {
//     this.id = id;
//     this.ms = ms;
//     this.action = action;
//   }
// }

export const ANIMATION_FRAME_TYPE = "_animationFrame";

export const newAnimationFrame = (id, ms, action) => {
  if (typeof action !== "function") {
    throw new Error("frame action must be callable");
  }
  return {
    _type: ANIMATION_FRAME_TYPE,
    id,
    ms,
    action,
  };
};
