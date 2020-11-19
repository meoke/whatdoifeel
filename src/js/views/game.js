import { elements } from './base';

export const activateGameInput = () => {
    elements.inputGameText.prop('disabled', false);
    elements.startGameBtn.hide();
}

export const renderGameScore = emoState => {
    const markup = `
        <span>Wynik: H: ${emoState[0]}, S: ${emoState[1]}, V: ${emoState[2]}</span>
    `;
    const [hue, sat, val] = emoState
    const color = `hsl(${hue}, ${sat}%, ${val/2+50}%)`
    elements.inputGameText.animate( {
		borderBottomColor: color,
		borderLeftColor: color,
		borderRightColor: color,
		borderTopColor: color
	}, 1500 );
    elements.scoreInfo.html(markup);
};

export const renderLastScore = lastHue => {
    const markup = `
        <span>Ostatni hue: ${lastHue}</span>
    `;
    elements.lastHueInfo.html(markup);
};

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