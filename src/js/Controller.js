
import _ from 'underscore';
import config from './config';
import { Emotion, EmotionHue, WordType } from './models/EmotionalState';
import { WordsHints, EmotionalStateSummaryViewModel, EmotionalChargeComponentViewModel} from './views/Evaluation';
import convert from 'color-convert';

class Controller {
    constructor(evaluationModelFactory, evaluationView) {
        this.evaluationModelFactory = evaluationModelFactory;

        this.evaluationView = evaluationView;
        this.evaluationView.setupStartEvaluationBtn(this.onEvaluationStart);
        this.evaluationView.setupRestartEvaluationBtn(this.onEvaluationRestart);
        this.evaluationView.setupFeelingsInput(this.onInputChange);
    }

    onEvaluationStart = async () => {
        const initModel = async () => {
            try {
                this.evaluationModel = await this.evaluationModelFactory.createEvaluation();
            }
            catch (e) {
                config.mode === "production" ?
                    this.evaluationView.renderError("Problem z pobraniem słownika emocji.") :
                    console.error(`Game creation or refresh issue: ${e.message}`);
            }
        };

        const showWordsHints = () => {
            const wordsHintsModel = this.evaluationModel.RosenbergWords;
            const wordsHintsByEmotion = _.chain(wordsHintsModel)
                .groupBy("emotion")
                .mapObject((val) => {
                    return _.map(val, ratedWordEntry => { return ratedWordEntry.originalWord; });
                })
                .value();
            const wordsHintsViewModel = new WordsHints(wordsHintsByEmotion[Emotion.ANGER],
                wordsHintsByEmotion[Emotion.DISGUST],
                wordsHintsByEmotion[Emotion.FEAR],
                wordsHintsByEmotion[Emotion.HAPPY],
                wordsHintsByEmotion[Emotion.SADNESS]
            );
            this.evaluationView.renderWordsHints(wordsHintsViewModel);
        };

        await initModel();
        showWordsHints();
        this._updateEmotionalStateSummary();
    }

    _updateEmotionalStateSummary() {
        const getStateViewModel = () => {
            const stateModel = this.evaluationModel.EmotionalStateHSV;
            const stateHSL = convert.hsv.hsl(stateModel.H,
                                             stateModel.S,
                                             stateModel.V);
            const intensity = this.evaluationModel.EmotionalStateIntensity;
            return new EmotionalStateSummaryViewModel(stateHSL[0],
                                                      stateHSL[1]/100, 
                                                      stateHSL[2]/100,
                                                      intensity);
        };
        const stateViewModel = getStateViewModel();     
        this.evaluationView.renderEmotionalStateSummary(stateViewModel);
    }

    onEvaluationRestart = () => {
        this.evaluationModel.restartEvaluation();
        this._updateEmotionalStateSummary();
    }

    onInputChange = inputValue => {
        const lastIsWord = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\s]*\p{Script_Extensions=Latin}+[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\s]$/gu;

        const lastWordPos = inputValue.search(lastIsWord);
        if (lastWordPos === -1) {
            return;
        }

        const lastWord = inputValue.substring(lastWordPos).trim();
        const emotionalCharge = this.evaluationModel.addWord(lastWord);
        this.onEmotionalChargeAdded(emotionalCharge);
        this._updateEmotionalStateSummary();
    }

    onEmotionalChargeAdded = (emotionalCharge) => {
        const saturation = emotionalCharge.emotion === Emotion.NEUTRAL ? 0 : 100;
        const isVulgar = emotionalCharge.wordType === WordType.VULGAR ? true : false;
        const a = new EmotionalChargeComponentViewModel(EmotionHue[emotionalCharge.emotion], 
            saturation,
            emotionalCharge.power,
            isVulgar);
        this.evaluationView.renderNewEmotionalChargeComponent(a);
    }
}

export {Controller};