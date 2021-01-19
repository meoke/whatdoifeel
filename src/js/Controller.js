
import _ from 'underscore';
import config from './config';
import { Emotion, WordType } from './models/EmotionalCharge';
import { EmotionHue } from './models/EmotionalStateSummarizer';
import { WordsHintsVM, EmotionalStateSummaryVM, EmotionalChargeVM} from './views/EmotionalStateEvaluation';
import convert from 'color-convert';

class Controller {
    constructor(evaluationModelFactory, evaluationView) {
        this.evaluationModelFactory = evaluationModelFactory;

        this.evaluationView = evaluationView;
        this.evaluationView.setupFeelingsInput(this.onInputChange);
    }

    start = async () => {
        const initModel = async () => {
            try {
                this.evaluationModel = await this.evaluationModelFactory.createEvaluation();
            }
            catch (e) {
                this.showError("Problem z pobraniem słownika emocji.", `Game creation or refresh issue: ${e.message}`);
            }
        };

        const initView = () => {
            this.evaluationView.initEvaluationBoard();
        };

        const showWordsHints = () => {
            const wordsHintsModel = this.evaluationModel.RosenbergWords;
            const wordsHintsByEmotion = _.chain(wordsHintsModel)
                .groupBy("emotion")
                .mapObject((val) => {
                    return _.map(val, ratedWordEntry => { return ratedWordEntry.originalWord; });
                })
                .value();
            const wordsHintsViewModel = new WordsHintsVM(wordsHintsByEmotion[Emotion.ANGER],
                wordsHintsByEmotion[Emotion.DISGUST],
                wordsHintsByEmotion[Emotion.FEAR],
                wordsHintsByEmotion[Emotion.HAPPY],
                wordsHintsByEmotion[Emotion.SADNESS]
            );
            this.evaluationView.renderWordsHints(wordsHintsViewModel);
        };

        await initModel();
        initView();
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
            return new EmotionalStateSummaryVM(stateHSL[0],
                                                      stateHSL[1]/100, 
                                                      stateHSL[2]/100,
                                                      intensity);
        };
        const stateViewModel = getStateViewModel();     
        this.evaluationView.renderEmotionalStateSummary(stateViewModel);
    }

    onInputChange = inputValue => {
        const wordsSeparators = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\s]/g;
        const inputValues = inputValue.split(wordsSeparators);
        if(!_.isEmpty(inputValues[inputValues.length-1])){
            return;
        }
        const words = inputValues.filter(a=>a);
        const emotionalCharges = this.evaluationModel.evaluate(words);
        this.onEmotionalChargesChange(emotionalCharges);
        this._updateEmotionalStateSummary();
    }

    onEmotionalChargesChange = emotionalCharges => {
        const getEmotionalChargeVM = emotionalCharge => {
            const saturation = emotionalCharge.emotion === Emotion.NEUTRAL ? 0 : 100;
            const isVulgar = emotionalCharge.wordType === WordType.VULGAR ? true : false;
            return new EmotionalChargeVM(EmotionHue[emotionalCharge.emotion], 
                saturation,
                emotionalCharge.power,
                isVulgar);
        };
        const emotionalChargesVMs = _.map(emotionalCharges, eCh => getEmotionalChargeVM(eCh));
        this.evaluationView.renderEmotionalCharges(emotionalChargesVMs);
    }

    showError = (productionErrorMessage, developmentErrorMessage) => {
        config.mode === "production" ?
                    this.evaluationView.renderErrorMessage(productionErrorMessage) :
                    console.error(developmentErrorMessage);
    }
}

export {Controller};