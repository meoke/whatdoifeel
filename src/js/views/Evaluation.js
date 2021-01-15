import $ from "jquery";
import 'jquery-color';
import _ from 'underscore';

/**
 * Describes words displayed for the user to show example of words for expressing different emotions.
 * @param {Array} angerWords - Array of strings that express anger
 * @param {Array} disgustWords -Array of strings that express disgust
 * @param {Array} fearWords -Array of strings that express fear
 * @param {Array} happinessWords -Array of strings that express happiness
 * @param {Array} sadnessWords -Array of strings that express sadness
 */
export class WordsHints {
    constructor(angerWords, disgustWords, fearWords, happinessWords, sadnessWords) {
        this.angerWords = angerWords;
        this.disgustWords = disgustWords;
        this.fearWords = fearWords;
        this.happinessWords = happinessWords;
        this.sadnessWords = sadnessWords;
    }
}

/**
 * Describes Emotional State summary as a HSL color.
 * @param{Number} hue - Integer from range [0,360]
 * @param{Number} saturation - Float from range [0,1]
 * @param{Number} lightness - Float from range [0,1]
 */
export class EmotionalStateSummaryViewModel {
    constructor(hue, saturation, lightness) {
        this.hue = hue;
        this.saturation = saturation;
        this.lightness = lightness;
    }
}

/**
 * Object responsible for rednering Evauluation of EmotionalState
 */
export class EmotionalStateEvaluationView {
    /**
     * Creates EmotionalStateEvaluationView
     */
    constructor() {
        this.elements = {
            title: $("#title"),
            dotsContainer: $("#dotsContainer"),
            evaluationContainer: $('#evaluationContainer'),
            startEvaluationBtn: $('#startEvaluationBtn'),
            restartEvaluationBtn: $('#restartEvaluationBtn'),
            feelingsInput: $('#feelingsInput'),
            wordsHints: $('#wordsHints'),
        
            angerColumn: $("#angerColumn"),
            disgustColumn: $("#disgustColumn"),
            fearColumn: $("#fearColumn"),
            happinessColumn1: $("#happinessColumn1"),
            happinessColumn2: $("#happinessColumn2"),
            sadnessColumn: $("#sadnessColumn"),
        };

        this.elements.feelingsInput.on('paste', e => {
            e.preventDefault();
        });
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
            this._initEvaluationBoard();

            handler();
        });
    }

    /**
     * Initializes all elements needed for the user to use the appplication.
     */
    _initEvaluationBoard() {
        const activateFeelingsInput = () => {
            this.elements.feelingsInput.prop('disabled', false);
            this.elements.feelingsInput.trigger("focus");
        };

        const replaceStartBtnWithRestartBtn = () => {
            this.elements.startEvaluationBtn.hide();
            this.elements.restartEvaluationBtn.css('display', 'block');
        };

        activateFeelingsInput();
        replaceStartBtnWithRestartBtn();
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

    _createDiv(text) {
        return $(`<div>${text}</div>`);
    }

    /**
     * Render WordsHints
     * @param {WordsHints}
     *  
     */
    renderWordsHints (hints) {
        const getColumnContent = (words) => {
            return _.map(words, word => this._createEl("div", word));
        };

        const renderWordsInColumns = (words, columns) => {
            const wordsChunks = _.chunk(words, Math.floor(words.length/columns.length));
            columns.forEach((col, i) => {
                col.append(getColumnContent(wordsChunks[i]));
            });
        };
        
        renderWordsInColumns(hints.angerWords, [this.elements.angerColumn]);
        renderWordsInColumns(hints.disgustWords, [this.elements.disgustColumn]);
        renderWordsInColumns(hints.fearWords, [this.elements.fearColumn]);
        renderWordsInColumns(hints.happinessWords, [this.elements.happinessColumn1, 
                                            this.elements.happinessColumn2]);
        renderWordsInColumns(hints.sadnessWords, [this.elements.sadnessColumn]);

        this.elements.wordsHints.show("slow");
    }

    /**
     * Clears feelingsInput.
     */
    clearFeelingsInput() {
        this.elements.feelingsInput.val("");
    }

    /**
     * Renders EmotionalState summary.
     * @param {EmotionalStateSummaryViewModel}
     */
    renderEmotionalStateSummary(emotionalStateSummary) {
        const c = $.Color({ hue: emotionalStateSummary.hue, 
                            saturation: emotionalStateSummary.saturation, 
                            lightness: emotionalStateSummary.lightness});
        console.log(c);
        this.elements.title.animate( {
            color: c
        }, 1500 );
    }

    renderNewVulgar(strength) {
        const d = this._createEl("div");

        const maxWidth = 20;
        const pies = v => {return Math.max(10, v*maxWidth/7);};

        const randPos = () => {return `${_.random(0,90)}%`;};
        d.css("width", `${pies(strength)}px`);
        d.css("height", `${pies(strength)}px`);
        d.css("left", randPos());
        d.css("top", randPos());
        d.css("display", "none");
        d.addClass('fas fa-asterisk emotionDot');
        this.elements.dotsContainer.append(d);
        d.fadeIn("slow");
    }

    /**
     * Renders new EmotionalState component as a coloured dot.
     * @param {*} H - Hue from range[0,360] 
     * @param {*} S - Saturation from range [0,1]
     * @param {*} L - Lightness from range [0,1]
     * @param {*} strength - strength of the component
     */
    renderNewEmotionalStateComponent(H, S, L, strength){
        const d = this._createEl("div");

        const maxWidth = 20;
        const pies = v => {return Math.max(10, v*maxWidth/7);};

        const randPos = () => {return `${_.random(0,90)}%`;};
        d.addClass("emotionDot");
        d.css("width", `${pies(strength)}px`);
        d.css("height", `${pies(strength)}px`);
        d.css("left", randPos());
        d.css("top", randPos());
        d.css("background-color", `hsl(${H}, ${S}%, ${L}%)`);
        d.css("display", "none");
        this.elements.dotsContainer.append(d);
        d.fadeIn("slow");
    }

    /**
     * Shows intensity of curren Emotional State as bubbles oppasity
     * @param {*} intensity from range [0, 7] 
     */
    renderIntensity(intensity) {
        const opacityMin = 0.3;
        const translatedIntenisty = intensity/7;
        const opacity = _.max([translatedIntenisty, opacityMin]);
        this.elements.dotsContainer.css('opacity', opacity);
    }

    /**
     * Clears all visual elements created during previous Evaluation.
     */
    clearEvaluationStateVisualisation() {
        this.elements.dotsContainer.empty();
    }

    _createEl(elName, value = "") {
        return $(`<${elName}>${value}</${elName}>`);
    }
}