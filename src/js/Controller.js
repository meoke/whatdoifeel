
import _ from 'underscore';
import config from './config';
import { Emotion, EmotionHue, WordType } from './models/EmotionalState';
import { WordsHints, EmotionalStateSummaryViewModel} from './views/Evaluation';
import convert from 'color-convert';

export class Controller {
    constructor(evaluationModelFactory, evaluationView) {
        this.evaluationModel;
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
        // const intensity = Math.min(100, 100*this.evaluationModel.EmotionalStateIntensity/7+10);
        const s = emotionalCharge.emotion === Emotion.NEUTRAL ? 0 : 100;
        if (emotionalCharge.wordType === WordType.VULGAR) {
            this.evaluationView.renderNewVulgar(emotionalCharge.strength);
        }
        else {
            this.evaluationView.renderNewEmotionalStateComponent(EmotionHue[emotionalCharge.emotion],
                s,
                50,
                emotionalCharge.strength);
        }
    }


    onStateChange = () => {
        const HSV = this.evaluationModel.EmotionalStateHSV;
        const HSL = this._HSVtoHSL(HSV.H, HSV.S / 100, HSV.V / 100);
        this.evaluationView.renderEmotionalStateHSL(HSL.H, HSL.S, HSL.L);

        // const emotionalStateBreakdown = this.evaluationModel.EmotionalStateComponents;
        // this.evaluationView.renderEmotionalState(intensity,
        //                                                   emotionalStateBreakdown[Emotion.ANGER], 
        //                                                   emotionalStateBreakdown[Emotion.DISGUST], 
        //                                                   emotionalStateBreakdown[Emotion.FEAR], 
        //                                                   emotionalStateBreakdown[Emotion.HAPPY], 
        //                                                   emotionalStateBreakdown[Emotion.SADNESS]);
    }


}

export default Controller;