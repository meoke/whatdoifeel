import { elements } from './base';
import {EmoHue} from '../models/EmoElement'
import $ from 'jquery'

import * as _ from 'underscore'

export const activateGameInput = () => {
    elements.inputGameText.prop('disabled', false);
    elements.inputGameText.focus()

}

export const clearGameInput = () => {
    elements.inputGameText.val("");
}

export const toggleBtnToRestartGame = () => {
    // const btnVal = $('<span/>', {text: 'Od nowa     '}).append(
    //     $( "<i/>", {
    //         "class": "fas fa-undo",
    //     })
    // )
    const btnVal = $( "<i/>", {
            "class": "fas fa-undo",
        })
    elements.toggleGameBtn.html(btnVal)
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

export const showRosenbergWords = (rosenbergWords) => {
    elements.angerColumn.append(pies(rosenbergWords, EmoHue.Anger));
    elements.disgustColumn.append(pies(rosenbergWords, EmoHue.Disgust));
    elements.fearColumn.append(pies(rosenbergWords, EmoHue.Fear));
    elements.sadnessColumn.append(pies(rosenbergWords, EmoHue.Sadness));
    
    const happySpans = pies(rosenbergWords, EmoHue.Happy)
    const halfLength = Math.floor(happySpans.length/2)
    const happyPart1 = happySpans.slice(0, halfLength)
    const happyPart2 = happySpans.slice(halfLength)
    elements.happyColumn1.append(happyPart1);
    elements.happyColumn2.append(happyPart2);
}

const pies = (rosenbergWords, type) => {
    const a = rosenbergWords.filter(w => w.hue === type)
    return a.map(hw => $( "<span/>", {
        "text": hw.originalWord,
        "style": "display: block"
    }))
}