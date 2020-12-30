import $ from "jquery";
import 'jquery-color';
import _ from 'underscore';

const elements = {
    gameContainer: $('#gameContainer'),
    gameInstruction: $('#instruction'),
    startEvaluationBtn: $('#startEvaluationBtn'),
    restartEvaluationBtn: $('#restartEvaluationBtn'),
    inputGameText: $('#angerInput'),
    lastHueInfo: $('#lastHueInfo'),
    gameResult: $('#gameResult'),

    angerHeader: $("#angerHeader"),
    disgustHeader: $("#disgustHeader"),
    fearHeader: $("#fearHeader"),
    happyHeader: $("#happyHeader"),
    sadnessHeader: $("#sadnessHeader"),

    angerColumn: $("#angerColumn"),
    disgustColumn: $("#disgustColumn"),
    fearColumn: $("#fearColumn"),
    happyColumn1: $("#happyColumn1"),
    happyColumn2: $("#happyColumn2"),
    sadnessColumn: $("#sadnessColumn"),
};

export class EvaluationView {
    constructor() {
        
    }

    bindEvaluationStartBtn(handler) {
        elements.startEvaluationBtn.on('click', () => {
            handler();
        })
    }

    bindRestartBtn(handler) {
        elements.restartEvaluationBtn.on('click', () => {

            handler();
        })
    }

    bindInputChange(handler) {
        elements.inputGameText.on('input', event => {
            const inputValue = event.target.value;
            if(_.isEmpty(inputValue))
                return;
            handler(inputValue);
        })
    }

    renderError(errorMessage) {
        const markup = `${errorMessage}`
        elements.gameContainer.html(markup);
    }

    activateGameInput() {
        elements.inputGameText.prop('disabled', false);
        elements.inputGameText.focus()
    }

    toggleBtnToRestartGame () {
        console.log(elements)
        elements.startEvaluationBtn.hide();
        elements.restartEvaluationBtn.show();
    }

    showRosenbergWords (rosenbergWords) {
        // const pies = (rosenbergWords, type) => {
        //     const a = rosenbergWords.filter(w => w.hue === type)
        //     return a.map(hw => $( "<span/>", {
        //         "text": hw.originalWord,
        //         "style": "display: block"
        //     }))
        // }

        // elements.angerColumn.append(pies(rosenbergWords, Emotions.Anger));
        // elements.disgustColumn.append(pies(rosenbergWords, Emotions.Disgust));
        // elements.fearColumn.append(pies(rosenbergWords, Emotions.Fear));
        // elements.sadnessColumn.append(pies(rosenbergWords, Emotions.Sadness));
        
        // const happySpans = pies(rosenbergWords, Emotions.Happy)
        // const halfLength = Math.floor(happySpans.length/2)
        // const happyPart1 = happySpans.slice(0, halfLength)
        // const happyPart2 = happySpans.slice(halfLength)
        // elements.happyColumn1.append(happyPart1);
        // elements.happyColumn2.append(happyPart2);
    }

    clearGameInput() {
        elements.inputGameText.val("");
    }

    renderGameScore(ColorHSL) {
        const color = $.Color({ hue: ColorHSL.H, saturation: ColorHSL.S, lightness: ColorHSL.L})
        elements.inputGameText.animate( {
            borderBottomColor: color,
            borderLeftColor: color,
            borderRightColor: color,
            borderTopColor: color
        }, 1500 );
    }

    renderLastScore (lastHue) {
        console.log(lastHue);
        // let elToAnimate;
        // switch(lastHue){
        //     case Emotions.Anger:
        //         elToAnimate = elements.angerHeader;
        //         break;
        //     case Emotions.Disgust:
        //         elToAnimate = elements.disgustHeader;
        //         break;
        //     case Emotions.Fear:
        //         elToAnimate = elements.fearHeader;
        //         break;
        //     case Emotions.Happy:
        //         console.log(lastHue)
        //         elToAnimate = elements.happyHeader;
        //         break;
        //     case Emotions.Sadness:
        //         elToAnimate = elements.sadnessHeader;
        //         break;
        //     default:
        //         return
        // }
    
        // elToAnimate.addClass("bold")
        // setTimeout(() => {
        //     elToAnimate.addClass("unbold")
        //     elToAnimate.removeClass("bold")
        //     elToAnimate.removeClass("unbold")
        // }, 500)}
    }
}