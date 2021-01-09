import { RatedWordsReference } from "./RatedWordsReference";
import { EmotionalState, WordTypes } from "./EmotionalState";
import * as wordsProvider from './RatedWordsProvider.js'

export class EmotionalStateEvaluationFactory {
    async createEvaluation() {
        const e = new EmotionalStateEvaluation();
        e.state = new EmotionalState()
        e.ratedWordsRef = await this._buildEmoReference();
        return e;
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

export class EmotionalStateEvaluation {
     /**
     * Get emotional state presented as color encoded in HSV model.
     * @returns {object} Object with properties H, S, V that correspond to Hue, Saturation, Value 
     */
    get EmotionalStateHSV() {
        return this.state.getEmotionStateAsHSVColor()
    }

    /**
     * Get list of Polish emotionally charged words as defined by Marschall Rosenberg.
     * @returns {Array} Array of RatedWordEntry objects. 
     */
    get RosenbergWords() {
        return this.ratedWordsRef.entries.filter(emoStem => 
                                                 emoStem.wordType === WordTypes.rosenberg) 
    }

    addFeeling(word) {
        const emotionalCharge = this.ratedWordsRef.getEmotionalCharge(word);
        this.state.addEmotionalCharge(emotionalCharge);
    }

    restartEvaluation() {
        this.state = new EmotionalState();
    }
}

export default EmotionalStateEvaluation;