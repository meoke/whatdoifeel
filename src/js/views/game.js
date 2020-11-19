import { elements } from './base';
import {EmoHue} from '../models/EmoElement'

import * as _ from 'underscore'

export const activateGameInput = () => {
    elements.inputGameText.prop('disabled', false);
    elements.startGameBtn.hide();
}

export const renderGameScore = emoState => {
    console.log(emoState)
    const [hue, sat, val] = emoState
    const color = `hsl(${hue}, ${sat}%, ${val/2+50}%)`
    elements.inputGameText.animate( {
		borderBottomColor: color,
		borderLeftColor: color,
		borderRightColor: color,
		borderTopColor: color
	}, 1500 );
};

export const renderLastScore = lastHue => {
    let elToAnimate;
    switch(lastHue){
        case EmoHue.Anger:
            elToAnimate = elements.angerHeader;
            break;
        case EmoHue.Disgust:
            elToAnimate = elements.disgustHeader;
            break;
        case EmoHue.Fear:
            elToAnimate = elements.fearHeader;
            break;
        case EmoHue.Happy:
            console.log(lastHue)
            elToAnimate = elements.happyHeader;
            break;
        case EmoHue.Sadness:
            elToAnimate = elements.sadnessHeader;
            break;
        default:
            return
    }

    elToAnimate.addClass("bold")
    setTimeout(() => {
        elToAnimate.addClass("unbold")
        elToAnimate.removeClass("bold")
        elToAnimate.removeClass("unbold")
    }, 500)
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