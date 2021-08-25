import { asyncForEach } from "../functional/asyncArrayMethods";

const animationFrameIds = {};
let lastActionFrame = {};

export const runFrame = async (frames, frameStartTime = 0) => {
  // Request the next frame
  const fid = window.requestAnimationFrame(async (newFrameStartTime) =>
    await runFrame(frames, newFrameStartTime)
  );

  frames.map(({ id }) => (animationFrameIds[id] = fid));

  // Test if milliseconds between time last frame for this action ran and now is greater than how often
  // this action should run. If yes, run the action.
  await asyncForEach(frames, async ({ id, action, ms }) => {
    // If there is no last run time set it and run, it must be the beginning of the game
    if (!lastActionFrame[id] || frameStartTime - lastActionFrame[id] > ms) {
      lastActionFrame[id] = frameStartTime;
      await action();
    }
  });
  // frames.forEach(({ id, action, ms }) => {
  //   // If there is no last run time set it and run, it must be the beginning of the game
  //   if (!lastActionFrame[id] || frameStartTime - lastActionFrame[id] > ms) {
  //     lastActionFrame[id] = frameStartTime;
  //     return action();
  //   }
  // });
};

export const cancelFrame = (actionId, frameIdsByActionId = animationFrameIds) =>
  window.cancelAnimationFrame(frameIdsByActionId[actionId]);
