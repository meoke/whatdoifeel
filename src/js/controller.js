
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
        if(!isWordSeparator(_.last(inputValue)))
            return;

        const getLastWord = () => {
            return _.chain(inputValue.split(wordsSeparators)).filter(a=>a).last().value();
        }

        const lastWord = getLastWord(inputValue);
        if(!_.isEmpty(lastWord)){
            this.evaluationModel.addFeeling(lastWord);
        }
    }

    onStateChange = HSV => {
        const HSVtoHSL = (H, S, V) => { 
            // H from [0,360], S from [0,1], V from [0,1]
            const lightness = V*(1-S/2);
            const saturation = (lightness === 0 || lightness === 1) ?
                                0 :
                                (V-lightness) / _.min([lightness, 1-lightness])
            return {
                H: H,
                S: saturation,
                L: lightness
            }
        }
        const HSL = HSVtoHSL(HSV.H, HSV.S/100, HSV.V/100);
        this.evaluationView.renderEmotionalState(HSL.H, HSL.S, HSL.L);
    }
}

export default Controller;