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
 * Describes Emotional State summary presented for the user.
 * @param{Number} hue - Integer from range [0,360] - value from HSL color model
 * @param{Number} saturation - Float from range [0,1] - value from HSL color model
 * @param{Number} lightness - Float from range [0,1] - value from HSL color model
 * @param{Number} density - Integer from range [0, 7] - how dense is the input from user
 */
export class EmotionalStateSummaryViewModel {
    constructor(hue, saturation, lightness, density) {
        this.hue = hue;
        this.saturation = saturation;
        this.lightness = lightness;
        this.density = density;
    }
}

/**
 * Describes Emotional State single Emotional Charge component.
 * @param{number} - hue - value from range [0,360] representing emotion hue from HSL or HSV color model
 * @
 */
export class EmotionalChargeComponentViewModel {
    constructor(hue, saturation, strength, isVulgar) {
        this.hue = hue;
        this.saturation = saturation;
        this.strength = strength;
        this.isVulgar = isVulgar;
    }
}
/**
 * Object responsible for rendering Evauluation of EmotionalState
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
    }

    /**
     * Callback for startEvaluationBtn.
     * @callback startEvaluationCallback
     */

    /**
     * 
     * @param {startEvaluationCallback} Callback to be called when user clicks on the startEvaluationBtn 
     */
    setupStartEvaluationBtn(startEvaluationCallback) {
        const initEvaluationBoard = () => {
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
        };

        const bindOnClickCallback = (callback) => {
            this.elements.startEvaluationBtn.on('click', () => {
                callback();
            });
        };

        bindOnClickCallback(initEvaluationBoard);
        bindOnClickCallback(startEvaluationCallback);
    }

    /**
     * Callback for restartEvaluationBtn.
     * @callback restartEvaluationCallback
     */
    /**
     * 
     * @param {restartEvaluationCallback} Callback to be called when user clicks on the restartEvaluationBtn 
     */
    setupRestartEvaluationBtn(restartEvaluationCallback) {
        const restartEvaluationBoard = () => {
            const clearFeelingsInput = () => {
                this.elements.feelingsInput.val("");
            };

            const clearEvaluationStateVisualisation = () => {
                this.elements.dotsContainer.empty();
            };

            clearFeelingsInput();
            clearEvaluationStateVisualisation();

        };

        const bindOnClickCallback = (callback) => {
            this.elements.restartEvaluationBtn.on('click', () => {
                callback();
            });
        };

        bindOnClickCallback(restartEvaluationBoard);
        bindOnClickCallback(restartEvaluationCallback);
    }


    /**
     * Callback for feelings text input change
     * @callback feelingsInputOnInputCallback
     * @param {string} Whole value of the feelingsInput
     */

    /**
     * 
     * @param {feelingsInputOnInputCallback} Callback to be called when user changes feelingInput
     */
    setupFeelingsInput(feelingsInputOnInputCallback) {
        const disablePaste = () => {
            this.elements.feelingsInput.on('paste', e => {
                e.preventDefault();
            });
        };

        const bindOnInputCallback = (callback) => {
            this.elements.feelingsInput.on('input', event => {
                const inputValue = event.target.value;
                if (_.isEmpty(inputValue))
                    return;
                callback(inputValue);
            });
        };

        disablePaste();
        bindOnInputCallback(feelingsInputOnInputCallback);
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
     * Render WordsHints
     * @param {WordsHints}
     *  
     */
    renderWordsHints(hints) {
        const getColumnContent = (words) => {
            return _.map(words, word => this._createEl("div", word));
        };

        const renderWordsInColumns = (words, columns) => {
            const wordsChunks = _.chunk(words, Math.floor(words.length / columns.length));
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
     * Renders EmotionalState summary.
     * @param {EmotionalStateSummaryViewModel}
     */
    renderEmotionalStateSummary(emotionalStateSummary) {
        const changeTitleColor = (hue, saturation, lightness) => {
            const c = $.Color({
                hue: hue,
                saturation: saturation,
                lightness: lightness
            });
            this.elements.title.animate({
                color: c
            }, 1500);
        };

        const changeDotsOpacity = (intensity) => {
            const minOpacity = 0.3;
            const intencityInOpacityScale = intensity / 7;
            const opacity = _.max([intencityInOpacityScale, minOpacity]);
            this.elements.dotsContainer.css('opacity', opacity);
        };

        changeTitleColor(emotionalStateSummary.hue, emotionalStateSummary.saturation, emotionalStateSummary.lightness);
        changeDotsOpacity(emotionalStateSummary.intensity);
    }

    /**
     * Renders EmotionalChargeComponent summary.
     * @param {EmotionalChargeComponentViewModel}
     */
    renderNewEmotionalChargeComponent(emotionalChargeComponent) {
        const div = this._createEl("div");
        const maxWidth = 20;
        const getElementWidth = v => { return Math.max(10, v * maxWidth / 7); };
        const randPos = () => { return `${_.random(0, 90)}%`; };
        div.css("width", `${getElementWidth(emotionalChargeComponent.strength)}px`);
        div.css("height", `${getElementWidth(emotionalChargeComponent.strength)}px`);
        div.css("left", randPos());
        div.css("top", randPos());
        div.addClass("emotionDot");

        if(emotionalChargeComponent.isVulgar) {
            div.addClass('fas fa-asterisk');
        }
        else {
            div.css("background-color", `hsl(${emotionalChargeComponent.hue}, ${emotionalChargeComponent.saturation}%, 50%)`);
        }

        div.css("display", "none");
        this.elements.dotsContainer.append(div);
        div.fadeIn("slow");

    }

    _createEl(elName, value = "") {
        return $(`<${elName}>${value}</${elName}>`);
    }
}