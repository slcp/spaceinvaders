let frameId = null;
let lastActionFrame = {};

export const runFrame = (frames, frameStartTime = 0) => {
  // Request the next frame
  frameId = window.requestAnimationFrame((newFrameStartTime) =>
    runFrame(frames, newFrameStartTime)
  );

  // Test if milliseconds between time last frame for this action ran and now is greater than how often
  // this action should run. If yes, run the action.
  frames.forEach(({ id, action, ms }) => {
    // If there is no last run time set it and run, it must be the beginning of the game
    if (!lastActionFrame[id]) {
      lastActionFrame[id] = frameStartTime;
      return action();
    }
    if (frameStartTime - lastActionFrame[id] > ms) {
      lastActionFrame[id] = frameStartTime;
      return action();
    }
  });
}