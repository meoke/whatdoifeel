import { RatedWordsReference } from "./RatedWordsReference";
import { EmotionalState, WordTypes } from "./EmotionalState";
import * as wordsProvider from './RatedWordsProvider.js'

export class EvaluationFactory {
    async createEvaluation() {
        const evaluation = new Evaluation();
        evaluation.state = new EmotionalState()
        evaluation.ratedWordsRef = await this._buildEmoReference()
        evaluation.onEmotionalStateChange = () => {console.log("Emotional State Changed")}
        return evaluation
    }

    async _buildEmoReference() {
        const _stopwords = wordsProvider.getStopWords()
        const _vulgarwords = wordsProvider.getVulgarWords()
        const _nawlWords = wordsProvider.getNAWLWords()
        const _rosenbergWords = wordsProvider.getRosenbergWords()
        const [stopwords,vulgarwords,nawlWords,rosenbergWords] = await Promise.all([_stopwords, _vulgarwords, _nawlWords, _rosenbergWords])

        return new RatedWordsReference(stopwords, vulgarwords, nawlWords, rosenbergWords)
    }
}

class Evaluation {
    sendInput(word) {
        const emotionalCharge = this.ratedWordsRef.getEmotionalCharge(word);
        this.state.addEmotionalCharge(emotionalCharge);
        this.onEmotionalStateChange(this.state.getEmotionStateAsHSVColor());
    }

    clearState() {
        this.state = new EmotionalState();
        this.onEmotionalStateChange(this.state.getEmotionStateAsHSVColor());
    }

    // get EmotionalStateHSV() {
    //     return this.state.getEmotionStateAsHSVColor()
    // }

    get RosenbergWords() {
        return this.ratedWordsRef.entries.filter(emoStem => emoStem.type === WordTypes.rosenberg)
    }

    bindOnStateChange(callback) {
        this.onEmotionalStateChange = callback;
    }
}

export default Evaluation;