import EmotionHue from './EmotionHue'
import EmotionWord from './EmotionWord'
import getStem from 'stemmer_pl';

export class EmotionalStateHSV {
    constructor(emotionHue, emotionSaturation, emotionValue) {
        this.hue = emotionHue;
        this.saturation = emotionSaturation;
        this.value = emotionValue;
    }
}

export const WordType = {
    stopword: 'stopword',
    vulgar: 'vulgar',
    preevaluated: 'preevaluated',
}

export class EmotionalSpecialWord {
    constructor(word, type, angerValue) {
        this.word = word
        this.stem = getStem(word)
        this.type = type
        this.angerValue = angerValue
    }
}

export class EmotionAnalyzer {
    constructor(stopWords, vulgarWords, preevaluatedWords) {
        const scores = {
            stopWord: 0,
            vulgar: 10,
        }

        const angerStopWords = this._buildAngerWordsCommonScore(stopWords, WordType.stopword, scores.stopWord)
        const angerVulgarWords = this._buildAngerWordsCommonScore(vulgarWords, WordType.vulgar, scores.vulgar)
        const angerPreevaluatedWords = this._buildAngerWordsArrayPredefinedScore(preevaluatedWords, WordType.preevaluated)
        
        this.angerWords = this._join([angerStopWords, angerVulgarWords, angerPreevaluatedWords])
    }

    _buildAngerWordsCommonScore(specialWords, type, commonScore) {
        return specialWords.map(specialWord => {
            return new EmotionalSpecialWord(specialWord.word, type, commonScore)
        })
    }

    _buildAngerWordsArrayPredefinedScore(specialWords, type) {
        return specialWords.map(specialWord => {
            const angerValue = Math.round(parseFloat(specialWord.value) * 10);
            return new EmotionalSpecialWord(specialWord.word, type, angerValue)
        })
    }

    _join(table) {
        return table.flat()
    }

    getEmotionWord(word) {
        const stem = getStem(word);
        const [emotion, value] = this._getEmotionHueAndValue(word);
        return new EmotionWord(word, stem, emotion, value)
    }

    _getEmotionHueAndValue(word) {
        // todo
        return [EmotionHue.Neutral, 0]
    }

    calculateEmotionalState(gameState) {
        const topHue = this._getTopHue(gameState.emotionalWords)
        return new EmotionalStateHSV(EmotionHue.Neutral, 0, 0)
    }

    _getTopHue(emotionalWords) {
        const happyWords = this._filterEmotionHue(emotionalWords, EmotionHue.Happy)
        const angerWords = this._filterEmotionHue(emotionalWords, EmotionHue.Happy)
        const sadWords = this._filterEmotionHue(emotionalWords, EmotionHue.Happy)
        const fearWords = this._filterEmotionHue(emotionalWords, EmotionHue.Happy)
        const disgustWords = this._filterEmotionHue(emotionalWords, EmotionHue.Happy)
        
        const values = []
        const happyValue = this._sumValue(happyWords)

        const angerValue = this._sumValue(angerWords)

        const sadValue = this._sumValue(sadWords)

        const fearValue = this._sumValue(fearWords)

        const disgustValue = this._sumValue(disgustWords)


    }

    _sumValue(emotionalWords) {
        return emotionalWords.reduce((a, b) => a + b.value, 0)
    }

    _filterEmotionHue(emotionalWords, emotionHue) {
        emotionalWords.filter(word => word.emotionHue === emotionHue)
    }
}