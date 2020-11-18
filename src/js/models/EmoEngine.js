import getStem from 'stemmer_pl';
import {EmoElement, EmoWordType, EmotionHue} from './EmoElement'

class EmoStem {
    constructor(word, hue, type) {
        this.originalWord = word
        this.stem = getStem(word)
        this.hue = hue
        this.type = type
    }
}

class EmoEngine {
    constructor(stopWords, vulgarWords, nawlWords, rosenbergWords) {
        const emoStopWords = this._buildEmoStems(stopWords, EmoWordType.stopword)
        const emoVulgar = this._buildEmoStems(vulgarWords, EmoWordType.vulgar)
        const emoNAWL = this._buildEmoStems(nawlWords, EmoWordType.nawl)
        const emoRosenberg = this._buildEmoStems(rosenbergWords, EmoWordType.rosenberg)
        
        this.emoStems = this._joinEmoStems([emoStopWords, emoVulgar, emoNAWL, emoRosenberg])
    }

    _buildEmoStems(dictionaryWords, emoWordType) {
        return dictionaryWords.map(dictWord => {
            return new EmoStem(dictWord.word, dictWord.hue, emoWordType)
        })
    }

    _joinEmoStems(table) {
        return table.flat()
    }

    getEmoElement(word) {
        const [hue, type] = this._getHueAndType(word.word)
        return new EmoElement(word, hue, type)
    }

    _getHueType(word) {
        const exactMatch = this._findExactMatch(word)
        if (exactMatch !== undefined){
            return [exactMatch.hue, exactMatch.type]
        }
        const wordStem = getStem(word)
        const stemMatch = this._findStemMatch(wordStem)
        if (stemMatch !== undefined){
            return [stemMatch.hue, stemMatch.type]
        }
        return [EmotionHue.Neutral, EmoWordType.unknown]
    }

    _findExactMatch(word) {
        return this.emoStems.find(emoStem => emoStem.originalWord === word)
    }

    _findStemMatch(stem) {
        return this.emoStems.find(emoStem => emoStem.stem === stem)
    }
}

export default EmoEngine