
import _ from 'underscore';
import config from './config'
import { Emotions } from './models/EmotionalState';
import {EmotionHeader} from './views/Evaluation'

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
            this.evaluationModel = await this.evaluationModelFactory.createEvaluation();
        }
        catch(e) {
            config.mode === "production" ?
            this.evaluationView.renderError("Problem z pobraniem słownika emocji.") :
            console.error(`Game creation or refresh issue: ${e.message}`);
        }

        this._prepareEvaluationBoard();
        this._displayWordingHints();
    }

    _prepareEvaluationBoard() {
        this.evaluationView.activateFeelingsInput();
        this.evaluationView.replaceStartBtnWithRestartBtn();
        this.onStateChange();
    }

    _displayWordingHints() {
        const rosenbergWordsModel = this.evaluationModel.RosenbergWords
        const rosenbergWordsMap = this._parseRosenbergWordsModelToView(rosenbergWordsModel)
        this.evaluationView.showRosenbergWords(rosenbergWordsMap);
    }

    _parseRosenbergWordsModelToView(rosenbergWords) {
        const filterByEmotion = emotion => {
            return rosenbergWords.filter(w => w.emotion === emotion).map(w => w.originalWord);
        }
        const rosenbergWordsMap = new Map();
        rosenbergWordsMap.set(EmotionHeader.Anger, filterByEmotion(Emotions.Anger));
        rosenbergWordsMap.set(EmotionHeader.Disgust, filterByEmotion(Emotions.Disgust));
        rosenbergWordsMap.set(EmotionHeader.Fear, filterByEmotion(Emotions.Fear));
        rosenbergWordsMap.set(EmotionHeader.Happiness, filterByEmotion(Emotions.Happy));
        rosenbergWordsMap.set(EmotionHeader.Sadness, filterByEmotion(Emotions.Sadness));
        return rosenbergWordsMap;
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
            return _.chain(inputValue.split(wordsSeparators))
                    .filter(a=>a).last().value();
        }

        const lastWord = getLastWord(inputValue);
        if(!_.isEmpty(lastWord)){
            this.evaluationModel.addFeeling(lastWord);
        }
    }

    onStateChange = () => {
        const HSV = this.evaluationModel.EmotionalStateHSV;
        const HSL = this._HSVtoHSL(HSV.H, HSV.S/100, HSV.V/100);
        this.evaluationView.renderEmotionalState(HSL.H, HSL.S, HSL.L);
    }

    _HSVtoHSL = (H, S, V) => { 
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
}

export default Controller;