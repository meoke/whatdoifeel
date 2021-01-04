import $ from "jquery";
import 'jquery-color';
import _ from 'underscore';

export const EmotionHeader = Object.freeze({
    "Anger": 0,
    "Disgust": 1,
    "Fear": 2,
    "Happiness": 3,
    "Sadness": 4
});

export class Evaluation {
    constructor() {
        this.elements = {
            evaluationContainer: $('#evaluationContainer'),
            evaluationInstruction: $('#instruction'),
            startEvaluationBtn: $('#startEvaluationBtn'),
            restartEvaluationBtn: $('#restartEvaluationBtn'),
            feelingsInput: $('#feelingsInput'),
            rosenbergFeelings: $('#rosenbergFeelings'),
        
            angerHeader: $("#angerHeader"),
            disgustHeader: $("#disgustHeader"),
            fearHeader: $("#fearHeader"),
            happinessHeader: $("#happinessHeader"),
            sadnessHeader: $("#sadnessHeader"),
        
            angerColumn: $("#angerColumn"),
            disgustColumn: $("#disgustColumn"),
            fearColumn: $("#fearColumn"),
            happinessColumn1: $("#happinessColumn1"),
            happinessColumn2: $("#happinessColumn2"),
            sadnessColumn: $("#sadnessColumn"),
        }

        this.elements.feelingsInput.on('keydown', e => {
            if( e.key === "Backspace"){
                e.preventDefault();
            }
        })
    }

    bindStartEvaluationBtn(handler) {
        this.elements.startEvaluationBtn.on('click', () => {
            handler();
        })
    }

    bindRestartEvaluationBtn(handler) {
        this.elements.restartEvaluationBtn.on('click', () => {
            handler();
        })
    }

    bindFeelingsInputChange(handler) {
        this.elements.feelingsInput.on('input', event => {
            const inputValue = event.target.value;
            if(_.isEmpty(inputValue))
                return;
            handler(inputValue);
        })
    }

    renderErrorMessage(errorMessage) {
        const markup = `<h2>Wystąpił błąd...</h2>
                        <p>${errorMessage}</p>
                        <p>Odśwież stronę i spróbuj ponownie!</p>`
        this.elements.evaluationContainer.html(markup);
    }

    activateFeelingsInput() {
        this.elements.feelingsInput.prop('disabled', false);
        this.elements.feelingsInput.focus();
    }

    replaceStartBtnWithRestartBtn () {
        this.elements.startEvaluationBtn.hide();
        this.elements.restartEvaluationBtn.css('display', 'block');
    }

    _createDiv(text) {
        return $(`<div>${text}</div>`);
    }

    /**
     * 
     * @param {Map} rosenbergWords EmotionHeader values to Array of String values
     *  
     */
    showRosenbergWords (rosenbergWords) {
        const getColumnContent = (words) => {
            return _.map(words, w => this._createDiv(w));
        };
        
        this.elements.angerColumn.append(getColumnContent(rosenbergWords.get(EmotionHeader.Anger)));
        this.elements.disgustColumn.append(getColumnContent(rosenbergWords.get(EmotionHeader.Disgust)));
        this.elements.fearColumn.append(getColumnContent(rosenbergWords.get(EmotionHeader.Fear)));
        this.elements.sadnessColumn.append(getColumnContent(rosenbergWords.get(EmotionHeader.Sadness)));
        
        const happinessWords = rosenbergWords.get(EmotionHeader.Happiness)
        console.log(rosenbergWords)
        const happyParts = _.chunk(happinessWords, Math.floor(happinessWords.length/2));
        if(happyParts.length >=2){
            this.elements.happinessColumn1.append(getColumnContent(happyParts[0]))
            this.elements.happinessColumn2.append(getColumnContent(happyParts[1]))
        }
    }

    clearFeelingsInput() {
        this.elements.feelingsInput.val("");
    }

    renderEmotionalState(H, S, L) {
        const color = $.Color({ hue: H, saturation: S, lightness: L})
        this.elements.feelingsInput.animate( {
            borderBottomColor: color,
            borderLeftColor: color,
            borderRightColor: color,
            borderTopColor: color
        }, 1500 );
    }

    renderEmotion(emotion) {
        console.log(emotion);
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