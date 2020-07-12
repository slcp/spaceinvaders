export const makeScoreUI = suffix => {
    const el = makeElement({type: 'div', classes: ['scoreboard'], id: `scoreboard-${suffix}`});
    el.appendChild(makeScoreLabel(suffix))
    el.appendChild(makeScoreContent(suffix))
    return el;
}
const makeScoreLabel = suffix => makeElement({type: 'span', classes: ['score-label'], id: `score-label-${suffix}`})

const makeScoreContent = suffix => {
    const el = makeElement({type: 'span', classes: ['score'], id: `score-${suffix}`})
    el.textContent = 0;
    return el;
}

export const makeLifeUI = (suffix, numLives) => {
    const el = makeElement({type: 'div', classes: ['lives'], id: `lives-${suffix}`});
    Array.from(new Array(numLives)).forEach((_, i) => el.appendChild(makeLifeRepresentation(i)));
    return el;
}

const makeLifeRepresentation = suffix => {
    const el = makeElement({type: 'img', classes: ['life'], id: `life-${suffix}`})
    el.src = 'alien.svg';
    return el;
}

const makeElement = ({type, classes, id}) => {
    const el = document.createElement(type);
    classes.forEach(c => el.classList.add(c));
    el.id = id;
    return el;
}


export const makeUI = (p) => {
    const gameContainer = document.getElementById('game');
    const scoreContainers = p.map((_, i) => {
        const el = makeScoreUI(i)
        gameContainer.prepend(el);
        return el
    })
    const lifeContainers = p.map((_, i) => {
        const el = makeLifeUI(i, 3)
        gameContainer.prepend(el);
        return el
    })
    return [scoreContainers, lifeContainers];
}
