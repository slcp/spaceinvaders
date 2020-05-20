class GameAnimation {
  constructor() {
    this.lastActionFrame = {};
  }

  runFrame(frameStartTime, actions, shouldCancelAnimation) {
    // Request the next frame
    const animation = window.requestAnimationFrame((newFrameStartTime) =>
      this.runFrame(newFrameStartTime, actions, shouldCancelAnimation)
    );

    // Test if milliseconds between time last frame for this action ran and now is greater than how often
    // this action should run. If yes, run the action.
    actions.forEach((def) => {
      // If there is no last run time set it and run, it must be the beginning of the game
      if (!this.lastActionFrame[def.id]) {
        this.lastActionFrame[def.id] = frameStartTime;
        def.action();
      } else if (frameStartTime - this.lastActionFrame[def.id] > def.ms) {
        this.lastActionFrame[def.id] = frameStartTime;
        def.action();
      }
    });

    // Check game state - Check at start and end of frame?
    // Possible cancel next animation frame if game has ended
    if (shouldCancelAnimation()) {
      window.cancelAnimationFrame(animation);
    }
  }
}

export default GameAnimation;
