
import _ from 'underscore';
import config from './config'


export class Controller {
    constructor(evaluationModelFactory, evaluationView) {
        this.evaluationModel;
        this.evaluationModelFactory = evaluationModelFactory;

        this.evaluationView = evaluationView;
        this.evaluationView.bindStartEvaluationBtn(this.onEvaluationStart);
        this.evaluationView.bindRestartEvaluationBtn(this.onEvaluationRestart);
        this.evaluationView.bindFeelingsInputChange(this.onInputChange);
    }

    onEvaluationStart = async () => {
        try{
            this.evaluationModel = await this.evaluationModelFactory.createEvaluation(this.onStateChange);
        }
        catch(e) {
            config.mode === "production" ?
            this.evaluationView.renderError("Problem z pobraniem słownika emocji.") :
            console.error(`Game creation or refresh issue: ${e.message}`);
        }

        this.evaluationView.activateFeelingsInput();
        this.evaluationView.replaceStartBtnWithRestartBtn();
        const rosenbergWords = this.evaluationModel.RosenbergWords
        this.evaluationView.showRosenbergWords(rosenbergWords);
    }

    onEvaluationRestart = () => {
        this.evaluationModel.restartEvaluation();
        this.evaluationView.clearFeelingsInput();
    }

    onInputChange = inputValue => {
        const wordsSeparators = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\s]/g;

        const isWordSeparator = char => char.match(wordsSeparators)

        const lastChar = _.last(inputValue)
        if(!isWordSeparator(lastChar))
            return;

        const getLastWord = str => {
            const words = str.split(wordsSeparators).filter(a=>a)
            return _.last(words);
        }

        const lastWord = getLastWord(inputValue);

        this.evaluationModel.addFeeling(lastWord);
    }

    onStateChange = HSV => {
        const HSL = this._HSVtoHSL(HSV.H, HSV.S/100, HSV.V/100);
        this.evaluationView.renderEmotionalState(HSL.H, HSL.S, HSL.L);
    }

    // H from [0,360], S from [0,1], V from [0,1]
    /**
     * HSVtoHSL takes HSV color and returns it as HSL.
     * The return value is object with properties H, S, L corresponding 
     * to Hue, Saturation and Lightness from HSL color model.
     * @param {number} H - Hue from range [0,360]
     * @param {number} S - Saturation from range [0,1]
     * @param {number} V - Value from range [0,1]
     * @returns {object} Object with properties H, S and L from HSL model.
     */
    _HSVtoHSL(H, S, V) {
        const lightness = V*(1-S/2);
        const saturation = (lightness === 0 || lightness === 1) ?
                            0 :
                            V-lightness / _.min([lightness, 1-lightness])
        return {
            H: H,
            S: saturation,
            L: lightness
        }
    }
}

export default Controller;