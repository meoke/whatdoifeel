import getStem from 'stemmer_pl';
import { EmotionalCharge, WordTypes, Emotions } from './EmotionalState'
import _ from 'underscore'

export class RatedWordEntry {
    constructor(word, emotion, wordType) {
        this.originalWord = word
        this.stem = getStem(word)
        this.emotion = emotion
        this.wordType = wordType
    }
}

export class RatedWordsReference {
    constructor(...ratedWordsLists) {
        const duplicatePriorities = {
            [WordTypes.unknown]: 0,
            [WordTypes.stopword]: 1, 
            [WordTypes.nawl]: 2, 
            [WordTypes.vulgar]: 3, 
            [WordTypes.rosenberg]:4 
        }

        this.entries = _.chain(ratedWordsLists)
                         .flatten()
                         .map(w => _.extend(w, {priority: duplicatePriorities[w.wordType]}))
                         .sortBy("priority")
                         .reverse()
                         .uniq(false, _.iteratee('word'))
                         .map(w => new RatedWordEntry(w.word, w.emotion, w.wordType))
                         .value()
    }

    getEmotionalCharge(word) {
        const entryMatch = this._getMatchedWord(word.toLowerCase())
        return entryMatch === undefined ?
               new EmotionalCharge(word, Emotions.Neutral, WordTypes.unknown)  :
               new EmotionalCharge(word, entryMatch.emotion, entryMatch.wordType)
    }

    _getMatchedWord(word) {
        const exactMatch = this._findExactMatch(word)
        if (exactMatch !== undefined) {
            return exactMatch;
        }
        
        const stemMatch = this._findStemMatch(getStem(word))
        if (stemMatch !== undefined) {
            return stemMatch;
        }

        return undefined;
    }

    _findExactMatch(word) {
        return this.entries.find(emoStem => emoStem.originalWord === word)
    }

    _findStemMatch(stem) {
        return this.entries.find(emoStem => emoStem.stem === stem)
    }
}

export default RatedWordsReference