
import _ from 'underscore';
import config from './config'


export class Controller {
    constructor(evaluationModelFactory, evaluationView) {
        this.evaluationModelFactory = evaluationModelFactory;
        console.log("konstruktor", this.evaluationModelFactory)
        this.evaluationModel;

        this.evaluationView = evaluationView;
        this.evaluationView.bindEvaluationStartBtn(this.onEvaluationStart.bind(this));
        this.evaluationView.bindRestartBtn(this.onEvaluationRestart.bind(this));
        this.evaluationView.bindInputChange(this.onInputChange.bind(this));
    }

    async onEvaluationStart() {
        console.log(this);
        
        try{
            this.evaluationModel =  await this.evaluationModelFactory.createEvaluation();
        }
        catch(e) {
            config.mode === "production" ?
            this.evaluationView.renderError("Nie można uruchomić gry...") :
            console.error(`Game creation or refresh issue: ${e.message}`);
        }

        this.evaluationModel.bindOnStateChange(this.onStateChange.bind(this));
        
        this.evaluationView.activateGameInput();
        this.evaluationView.toggleBtnToRestartGame();
        const rosenbergWords = this.evaluationModel.RosenbergWords
        this.evaluationView.showRosenbergWords(rosenbergWords);
    }

    onEvaluationRestart() {
        this.evaluationModel.clearState();
        this.evaluationView.clearGameInput();
    }

    onInputChange(inputValue) {
        const wordsSeparators = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\s]/g;

        const isWordSeparator = char => char.match(wordsSeparators)

        const getLastOfNotEmptyStr = iterable => iterable[iterable.length - 1]

        const lastChar = getLastOfNotEmptyStr(inputValue)
        if(!isWordSeparator(lastChar))
            return;

        const getLastWord = str => {
            const words = str.split(wordsSeparators).filter(a=>a)
            return _.last(words);
        }

        const currentTime = new Date()
        const lastWord = getLastWord(inputValue);

        this.evaluationModel.sendInput(lastWord, currentTime);
    }

    onStateChange(HSV) {
        const HSL = this._HSVtoHSL(HSV);
        this.evaluationView.renderGameScore(HSL.H, HSL.S/100, HSL.V/100);
    }

    // H from [0,360], S from [0,1], V from [0,1]
    /**
     * HSVtoHSL takes Hue, Saturation and Value values from HSV color model.
     * It converts the color to HSL model.
     * The return value is object with properties corresponding to Hue, Saturation and Lightness from HSL color model.
     * @param {number} H - Hue from range [0,360]
     * @param {number} S - Saturation from range [0,1]
     * @param {number} V - Value from range [0,1]
     * @returns {object} Object with properties H, S and L from HSL model.
     */
    _HSVtoHSL(H, S, V) {
        const HSL_hue = H;
        const HSL_lightness = V*(1-S/2);
        let HSL_saturation;
        if(HSL_lightness === 0 || HSL_lightness === 1){
            HSL_saturation = 0
            console.log("zero")
        }
        else {
            const a = V-HSL_lightness
            const b = _.min([HSL_lightness, 1-HSL_lightness])
            console.log(a, b)
            HSL_saturation = a / b
        }
        // const HSL_saturation = (HSL_lightness === 0 || HSL_lightness === 1) ?
        //                         0 :
        //                         (V-HSL_lightness) / _.min(HSL_lightness, 1-HSL_lightness)
        console.log(H, S, V, "->", HSL_hue, HSL_saturation, HSL_lightness)
        return {
            H: HSL_hue,
            S: HSL_saturation,
            L: HSL_lightness
        }
    }
}

export default Controller;