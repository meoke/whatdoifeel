import getStem from 'stemmer_pl';
import { EmoElement, EmoWordType, EmoHue } from './EmoElement'
import _ from 'underscore'

class EmoStem {
    constructor(word, hue, type) {
        this.originalWord = word
        this.stem = getStem(word)
        this.hue = hue
        this.type = type
    }
}


export class EmoReference {
    constructor(stopWords, vulgarWords, nawlWords, rosenbergWords) {
        const emoStopWords = EmoReference._buildEmoStems(stopWords, EmoWordType.stopword)
        const emoVulgar = EmoReference._buildEmoStems(vulgarWords, EmoWordType.vulgar)
        const emoNAWL = EmoReference._buildEmoStems(nawlWords, EmoWordType.nawl)
        const emoRosenberg = EmoReference._buildEmoStems(rosenbergWords, EmoWordType.rosenberg)

        this.emoStems = EmoReference._joinEmoStems([emoStopWords, emoVulgar, emoNAWL, emoRosenberg],
            EmoReference._getMostImportantFrom
            )
    }

    static _buildEmoStems(dictionaryWords, emoWordType) {
        return dictionaryWords.map(dictWord => {
            return new EmoStem(dictWord.word, dictWord.hue, emoWordType)
        })
    }

    static _joinEmoStems(table, getMostImportant) {
        const joined = table.flat()
        const d = _.groupBy(joined, "originalWord")
        const x = []
        for(const obj in d) {
            const a = getMostImportant(d[obj])
            x.push(a)
        }
        return x.flat()
    }

    static _getMostImportantFrom(emoStems) {
        const score = {
            [EmoWordType.unknown]: 0,
            [EmoWordType.stopword]: 1, 
            [EmoWordType.vulgar]: 2, 
            [EmoWordType.nawl]: 3, 
            [EmoWordType.rosenberg]:4 
        }
        
        const compFn = (scoredEmoStem1, scoredEmoStem2) => {
            if(scoredEmoStem1.s === scoredEmoStem2.s)
                return 0;
            return scoredEmoStem1.s < scoredEmoStem2.s ? 1 : -1;
        }

        return emoStems.map(eS => {return {emoStem: eS, s: score[eS.type]}}).sort(compFn)[0].emoStem
    }

    getEmoElement(word) {
        const [hue, type] = this._getHueAndType(word.toLowerCase())
        return new EmoElement(word, hue, type)
    }

    _getHueAndType(word) {
        const exactMatch = this._findExactMatch(word)
        if (exactMatch !== undefined) {
            return [exactMatch.hue, exactMatch.type]
        }
        const wordStem = getStem(word)
        const stemMatch = this._findStemMatch(wordStem)
        if (stemMatch !== undefined) {
            return [stemMatch.hue, stemMatch.type]
        }
        return [EmoHue.Neutral, EmoWordType.unknown]
    }

    _findExactMatch(word) {
        return this.emoStems.find(emoStem => emoStem.originalWord === word)
    }

    _findStemMatch(stem) {
        return this.emoStems.find(emoStem => emoStem.stem === stem)
    }
}

export const testAPI = {
    EmoStem: EmoStem
}
export default EmoReference