import getStem from 'stemmer_pl';
import { EmotionalCharge, WordType, Emotion } from './EmotionalState';
import _ from 'underscore';

/**
 * Element of Rated Words Reference.
 */
export class RatedWordEntry {
    /**
     * Creates RatedWordEntry
     * @param {string} word - orginal word from the external dictionary
     * @param {Emotion} emotion - emotion assigned to this word
     * @param {WordType} wordType - type of the word
     */
    constructor(word, emotion, wordType) {
        this.originalWord = word;
        this.stem = getStem(word);
        this.emotion = emotion;
        this.wordType = wordType;
    }
}

/**
 * Reference of words with assigned emotional values.
 * It serves as a dictionary to check emotion of words coming from the user of EmotionalStateEvaluation.
 */
export class RatedWordsReference {
    /**
     * Creates RatedWordsReference
     * @param  {Array} ratedWordsLists - array of RatedWordEntry arrays
     */
    constructor(...ratedWordsLists) {
        const duplicatePriorities = {
            [WordType.UNKNOWN]: 0,
            [WordType.STOPWORD]: 1, 
            [WordType.NAWL]: 2, 
            [WordType.VULGAR]: 3, 
            [WordType.ROSENBERG]:4 
        };

        this.entries = _.chain(ratedWordsLists)
                         .flatten()
                         .map(w => _.extend(w, {priority: duplicatePriorities[w.wordType]}))
                         .sortBy("priority")
                         .reverse()
                         .uniq(false, _.iteratee('word'))
                         .map(w => new RatedWordEntry(w.word, w.emotion, w.wordType))
                         .value();
    }

    /**
     * Enables checking emotional value of words.
     * @param {string} word to check its emotional value
     * @returns {EmotionalCharge} EmotionalCharge based on the input word
     */
    getEmotionalCharge(word) {
        const entryMatch = this._getMatchedWord(word.toLowerCase());
        return entryMatch === undefined ?
               new EmotionalCharge(word, Emotion.NEUTRAL, WordType.UNKNOWN)  :
               new EmotionalCharge(word, entryMatch.emotion, entryMatch.wordType);
    }

    _getMatchedWord(word) {
        const exactMatch = this._findExactMatch(word);
        if (exactMatch !== undefined) {
            return exactMatch;
        }
        
        const stemMatch = this._findStemMatch(getStem(word));
        if (stemMatch !== undefined) {
            return stemMatch;
        }

        return undefined;
    }

    _findExactMatch(word) {
        return this.entries.find(emoStem => emoStem.originalWord === word);
    }

    _findStemMatch(stem) {
        return this.entries.find(emoStem => emoStem.stem === stem);
    }
}

export default RatedWordsReference;