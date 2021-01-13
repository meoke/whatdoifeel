import $ from "jquery";
import 'jquery-color';
import _ from 'underscore';

/**
 * Represents all headers for lists of words connected with a given emotion
 * @readonly
 * @enum {number} Emotion
 */
export const EmotionHeader = Object.freeze({
    "ANGER": 0,
    "DISGUST": 1,
    "FEAR": 2,
    "HAPPINESS": 3,
    "SADNESS": 4
});

/**
 * Object responsible for rednering Evauluation of EmotionalState
 */
export class EmotionalStateEvaluationView {
    /**
     * Creates EmotionalStateEvaluationView
     */
    constructor() {
        this.elements = {
            evaluationContainer: $('#evaluationContainer'),
            evaluationInstruction: $('#instruction'),
            startEvaluationBtn: $('#startEvaluationBtn'),
            restartEvaluationBtn: $('#restartEvaluationBtn'),
            feelingsInput: $('#feelingsInput'),
            rosenbergFeelings: $('#rosenbergFeelings'),
            wordsHints: $('#wordsHints'),
            emotionalStateIndicator: $('#emotionalStateIndicator'),
        
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
        };
    }

    /**
     * Callback for startEvaluationBtn.
     *
     * @callback startEvaluationCallback
     */

    /**
     * 
     * @param {startEvaluationCallback} Callback to be called when user clicks on the startEvaluationBtn 
     */
    bindStartEvaluationBtn(handler) {
        this.elements.startEvaluationBtn.on('click', () => {
            handler();
        });
    }

    /**
     * Callback for restartEvaluationBtn.
     *
     * @callback restartEvaluationCallback
     */

    /**
     * 
     * @param {restartEvaluationCallback} Callback to be called when user clicks on the restartEvaluationBtn 
     */
    bindRestartEvaluationBtn(handler) {
        this.elements.restartEvaluationBtn.on('click', () => {
            handler();
        });
    }

    /**
     * Callback for feelings text input change
     *
     * @callback feelingsInputChangeCallback
     * @param {string} Whole value of the feelingsInput
     */

    /**
     * 
     * @param {feelingsInputChangeCallback} Callback to be called when user changes feelingInput
     */
    bindFeelingsInputChange(handler) {
        this.elements.feelingsInput.on('input', event => {
            const inputValue = event.target.value;
            if(_.isEmpty(inputValue))
                return;
            handler(inputValue);
        });
    }

    /**
     * Render error massage to the user
     * @param {string} errorMessage 
     */
    renderErrorMessage(errorMessage) {
        const markup = `<h2>Wystąpił błąd...</h2>
                        <p>${errorMessage}</p>
                        <p>Odśwież stronę i spróbuj ponownie!</p>`;
        this.elements.evaluationContainer.html(markup);
    }

    /**
     * Activates feelingsInput and set focus.
     */
    activateFeelingsInput() {
        this.elements.feelingsInput.prop('disabled', false);
        this.elements.feelingsInput.trigger("focus");
    }

    /**
     * Show restartEvaluationBtn instead of startEvaluationBtn
     */
    replaceStartBtnWithRestartBtn () {
        this.elements.startEvaluationBtn.hide();
        this.elements.restartEvaluationBtn.css('display', 'block');
    }

    _createDiv(text) {
        return $(`<div>${text}</div>`);
    }

    /**
     * Render list of emotional words based on M.Roseneberg source
     * @param {Map} rosenbergWords EmotionHeader values to Array of String values
     *  
     */
    showRosenbergWords (rosenbergWords) {
        const getColumnContent = (words) => {
            return _.map(words, w => this._createDiv(w));
        };
        
        this.elements.angerColumn.append(getColumnContent(rosenbergWords.get(EmotionHeader.ANGER)));
        this.elements.disgustColumn.append(getColumnContent(rosenbergWords.get(EmotionHeader.DISGUST)));
        this.elements.fearColumn.append(getColumnContent(rosenbergWords.get(EmotionHeader.FEAR)));
        this.elements.sadnessColumn.append(getColumnContent(rosenbergWords.get(EmotionHeader.SADNESS)));
        
        const happinessWords = rosenbergWords.get(EmotionHeader.HAPPINESS);
        const happyParts = _.chunk(happinessWords, Math.floor(happinessWords.length/2));
        if(happyParts.length >=2){
            this.elements.happinessColumn1.append(getColumnContent(happyParts[0]));
            this.elements.happinessColumn2.append(getColumnContent(happyParts[1]));
        }

        this.elements.wordsHints.show("slow");
    }

    /**
     * Clears feelingsInput.
     */
    clearFeelingsInput() {
        this.elements.feelingsInput.val("");
    }

    /**
     * Renders EmotionalState given as HSL color.
     * @param {number} H - Hue from range [0,360]
     * @param {number} S - Saturation from range [0,1]
     * @param {number} L - Lightness from range [0,1]
     */
    renderEmotionalStateHSL(H, S, L) {
        const color = $.Color({ hue: H, saturation: S, lightness: L});
        this.elements.feelingsInput.animate( {
            borderBottomColor: color,
            borderLeftColor: color,
            borderRightColor: color,
            borderTopColor: color
        }, 1500 );
    }

    /**
     * Renders EmotionalState given as its intensity and percentage breakdown of emotional components.
     * @param {number} intensity - Percentage value from range [0,100], where 0 is 0 intensity and 100 max intensity
     * @param {number} anger - Percentage value range [0,100]
     * @param {number} disgust - Percentage value range [0,100]
     * @param {number} fear - Percentage value range [0,100]
     * @param {number} happiness - Percentage value range [0,100]
     * @param {number} sadness - Percentage value range [0,100]
     */
    renderEmotionalState(intensity, anger, disgust, fear, happiness, sadness) {
        const border1 = happiness; 
        const border2 = border1 + anger; 
        const border3 = border2 + disgust; 
        const border4 = border3 + fear; 
        const border5 = border4 + sadness; 

        const col = c => {return `hsl(${c}, ${intensity}%, 50%) `;};
        this.elements.emotionalStateIndicator.css('background',
            `linear-gradient(to right, 
                             ${col("var(--happinessHue)")} 0% ${border1}%, 
                             ${col("var(--angerHue)")} ${border1}% ${border2}%,
                             ${col("var(--disgustHue)")} ${border2}% ${border3}%,
                             ${col("var(--fearHue)")} ${border3}% ${border4}%,
                             ${col("var(--sadnessHue)")} ${border4}% ${border5}%,
                             ${"hsl(var(--neutralHue), 0%, 50%)"} ${border5}% 100%)`
        );
        
    }
}