import { elements } from './base';

export const activateGameInput = () => {
    elements.inputGameText.prop('disabled', false);
    elements.startGameBtn.hide();
}

export const renderGameScore = gameState => {
    const markup = `
        <span>Wynik: ${gameState.points}</span>
    `;
    elements.scoreInfo.html(markup);
};

export const renderLastScore = lastScore => {
    const markup = `
        <span>Ostatni wynik: ${lastScore}</span>
    `;
    elements.lastScoreInfo.html(markup);
};

export const renderGameFinish = gameState => {
    const markup = `
    <span>Gratulacje!: ${gameState.points}</span>
    `;
    elements.gameResult.html(markup);
}

export const renderError = message => {
    const markup = `
        Cannot run game at the moment :( ${message}
    `
    elements.gameContainer.html(markup);
}

export const extractLastWord = str => {
    if (typeof str !== "string"){
        return ""
    }
    const words = str.trim().split(" ")
    return words[words.length-1]
}