import { mark } from 'regenerator-runtime';
import { elements } from './base';

export const activateGameInput = () => {
    elements.inputGameText.disabled = false
}

export const renderGameScore = gameState => {
    const markup = `
        <span>Wynik: ${gameState.points}</span>
    `;
    elements.scoreInfo.innerHTML = markup;
};

export const renderLastScore = lastScore => {
    const markup = `
        <span>Ostatni wynik: ${lastScore}</span>
    `;
    elements.lastScoreInfo.innerHTML = markup;
};

export const renderError = message => {
    const markup = `
        Cannot run game at the moment :( ${message}
    `
    elements.gameContainer.innerHTML = markup;
}

export const extractLastWord = str => {
    if (typeof str !== "string"){
        return ""
    }
    const words = str.trim().split(" ")
    return words[words.length-1]
}