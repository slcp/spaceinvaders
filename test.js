function* animate(frameActions) {
    let frame = window.requestAnimationFrame((frameStartTime) =>
        animation.runFrame(frameStartTime, this.frameActions, () =>
            this.shouldCancelAnimation()
        )
    );
    const reply = yield 'What is your favorite color?';
    console.log(reply);
    if (reply !== 'yellow') return 'Wrong!'
    return 'You may pass.';
}
