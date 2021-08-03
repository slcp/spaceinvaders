// class GameAnimation {
//   constructor() {
//     this.frameId = null;
//     this.lastActionFrame = {};
//   }

//   cancel() {
//     window.cancelAnimationFrame(this.frameId);
//   }

//   runFrame(actions, shouldCancelAnimation, frameStartTime = 0) {
//     // Request the next frame
//     this.frameId = window.requestAnimationFrame((newFrameStartTime) =>
//       this.runFrame(actions, shouldCancelAnimation, newFrameStartTime)
//     );

//     // Test if milliseconds between time last frame for this action ran and now is greater than how often
//     // this action should run. If yes, run the action.
//     actions.forEach((frame) => {
//       // If there is no last run time set it and run, it must be the beginning of the game
//       if (!this.lastActionFrame[frame.id]) {
//         this.lastActionFrame[frame.id] = frameStartTime;
//         frame.action();
//         return;
//       }
//       if (frameStartTime - this.lastActionFrame[frame.id] > frame.ms) {
//         this.lastActionFrame[frame.id] = frameStartTime;
//         frame.action();
//         return;
//       }
//     });
//   }
// }

export const GAME_ANIMATION_TYPE = "_gameAnimation";

export const newGameAnimation = () => ({
  frameId: null,
  lastActionFrame: {},
});

export default GameAnimation;
