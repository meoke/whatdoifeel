import { RatedWordsReference } from "./RatedWordsReference";
import { EmotionalState, WordType } from "./EmotionalState";
import * as wordsProvider from './RatedWordsProvider.js';

/**
 * Factory for creating EmotionalStateEvaluation object
 */
export class EmotionalStateEvaluationFactory {
    /**
     * Creates asynchronously EmotionalStateEvaluation object.
     */
    async createEvaluation() {
        const evaluation = new EmotionalStateEvaluation();
        evaluation.state = new EmotionalState();
        evaluation.ratedWordsRef = await this._buildEmoReference();
        return evaluation;
    }

    async _buildEmoReference() {
        const _stopwords = wordsProvider.getStopWords();
        const _vulgarwords = wordsProvider.getVulgarWords();
        const _nawlWords = wordsProvider.getNAWLWords();
        const _rosenbergWords = wordsProvider.getRosenbergWords();
        const [stopwords,vulgarwords,nawlWords,rosenbergWords] = await Promise.all([_stopwords, _vulgarwords, _nawlWords, _rosenbergWords]);
        return new RatedWordsReference(stopwords, vulgarwords, nawlWords, rosenbergWords);
    }
}

/**
 * Describes the process of assessment of one's EmotionalState
 * based on words he or she provides to the system.
 */
export class EmotionalStateEvaluation {
    /**
    * @typedef {import('./EmotionalState.js').HSV} HSV
    */
     /**
     * Get emotional state presented as a color encoded in HSV model.
     * @returns {HSV} Color encoded in HSV (Hue, Saturation, Value)
     */
    get EmotionalStateHSV() {
        return this.state.getEmotionStateAsHSVColor();
    }

    /**
    * @typedef {import('./EmotionalState.js').EmotionalStateShares} EmotionalStateShares
    */
     /**
     * Get emotional state presented as percentage breakdown of emotions.
     * @returns {EmotionalStateShares} 
     */
    get EmotionalStateShares() {
        return this.state.getEmotionalStateAsShares();
    }

    /**
    * @typedef {import('./EmotionalState.js').Intensity} Intensity
    */
     /**
     * Get emotional state intensity as value between 0 (no intensity) and 7 (maximum intensity).
     * @returns {Intensity} from range [0,7] 
     */
    get EmotionalStateIntensity() {
        return this.state.getEmotionalStateIntensity();
    }

    /**
     * Get list of Polish emotionally charged words as defined by Marschall Rosenberg.
     * @returns {Array} Array of RatedWordEntry objects of type WordType.ROSENBERG. 
     */
    get RosenbergWords() {
        return this.ratedWordsRef.entries.filter(ratedWordEntry => 
                                                 ratedWordEntry.wordType === WordType.ROSENBERG); 
    }

    /**
    * @typedef {import('./EmotionalState.js').EmotionalCharge} EmotionalCharge
    */
    /**
     * Add user's word to the Emotional State and return the EmotionalCharge it was assigned with.
     * @param {string} word from the user 
     * @returns {EmotionalCharge} EmotionalCharge created from the given input word.
     */
    addWord(word) {
        const emotionalCharge = this.ratedWordsRef.getEmotionalCharge(word);
        this.state.addEmotionalCharge(emotionalCharge);
        return emotionalCharge;
    }

    /**
     * Clear state of the EmotionalStateEvaluation.
     * It is advised to clear state instead of creating new EmotionalStateEvaluation object,
     * because the creation process requires web traffic to download dictionaries. 
     * @returns {void}
     */
    restartEvaluation() {
        this.state = new EmotionalState();
    }
}

export default EmotionalStateEvaluation;