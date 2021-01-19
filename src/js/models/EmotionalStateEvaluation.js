import _ from 'underscore';

import { RatedWordsReference } from "./RatedWordsReference";
import { EmotionalStateSummarizer } from "./EmotionalStateSummarizer";
import { EmotionalState, WordType} from "./EmotionalState";
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
        evaluation.summarizer = new EmotionalStateSummarizer();
        evaluation.ratedWordsRef = await this._buildEmoReference();
        evaluation.emotionalState = new EmotionalState();
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
 * Manages evaluation of one's Emotional State based on list of provided words.
 * Provides different ways of summarizing the emotional state.
 */
export class EmotionalStateEvaluation {
    /**
    * @typedef {import('./EmotionalStateSummarizer.js').HSV} HSV
    */
     /**
     * Get emotional state presented as a color encoded in HSV model.
     * @returns {HSV} Color encoded in HSV (Hue, Saturation, Value)
     */
    get EmotionalStateHSV() {
        return this.summarizer.summarizeToHSVColor(this.emotionalState);
    }

    /**
    * @typedef {import('./EmotionalStateSummarizer.js').EmotionalStateShares} EmotionalStateShares
    */
     /**
     * Get emotional state presented as percentage breakdown of emotions.
     * @returns {EmotionalStateShares} 
     */
    get EmotionalStateShares() {
        return this.summarizer.summarizeToShares(this.emotionalState);
    }

    /**
    * @typedef {import('./EmotionalStateSummarizer.js').Intensity} Intensity
    */
     /**
     * Get emotional state intensity as value between 0 (no intensity) and 7 (maximum intensity).
     * @returns {Intensity} from range [0,7] 
     */
    get EmotionalStateIntensity() {
        return this.summarizer.summarizeToIntensity(this.emotionalState);
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
     * Evaluates given words to emotional charges
     * @param {Array.string} Array of words from the user.
     * @returns {Array.EmotionalCharge} Array of Emotional Charges created from the given input.
     */
    evaluate(words) {
        const wordToEmotionalCharge = (word) => {
            return this.ratedWordsRef.getEmotionalCharge(word);
        };

        this.emotionalState.EmotionalCharges = _.map(words, word => {return wordToEmotionalCharge(word);});
        return this.emotionalState.EmotionalCharges;
    }
}

export default EmotionalStateEvaluation;