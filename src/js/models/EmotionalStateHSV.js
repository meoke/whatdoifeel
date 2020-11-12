import EmotionHue from './EmotionHue'
import {EmotionWord, WordType} from './EmotionWord'
import getStem from 'stemmer_pl';

export class EmotionalStateHSV {
    constructor(emotionHue, emotionSaturation, emotionValue) {
        this.hue = emotionHue;
        this.saturation = emotionSaturation;
        this.value = emotionValue;
    }
}

export class EmotionalSpecialWord {
    constructor(word, type, angerValue, emotionHue) {
        this.word = word
        this.stem = getStem(word)
        this.type = type
        this.angerValue = angerValue
        this.emotionHue = emotionHue
    } 
}

export class EmotionAnalyzer {
    constructor(stopWords, vulgarWords, preevaluatedWords, rosenbergWords) {
        const scores = {
            stopWord: 0,
            vulgar: 10,
            rosenberg: 60
        }

        const specialStopWords = this._buildEmotionalSpecialWordsCommonScore(stopWords, WordType.stopword, scores.stopWord)
        const specialVulgarWords = this._buildEmotionalSpecialWordsCommonScore(vulgarWords, WordType.vulgar, scores.vulgar)
        const specialPreevaluatedWords = this._buildEmotionalSpecialWordsArrayPredefinedScore(preevaluatedWords, WordType.preevaluated)
        const specialRosenbergWords = this._buildEmotionalSpecialWordsCommonScore(rosenbergWords, WordType.rosenberg, scores.rosenberg)

        this.specialEmotionalWords = this._join([specialStopWords, specialVulgarWords, specialPreevaluatedWords, specialRosenbergWords])
    }

    _buildEmotionalSpecialWordsCommonScore(specialWords, type, commonScore, emotionHue) {
        return specialWords.map(specialWord => {
            return new EmotionalSpecialWord(specialWord.word, type, commonScore, emotionHue)
        })
    }

    _buildEmotionalSpecialWordsArrayPredefinedScore(specialWords, type, emotionHue) {
        return specialWords.map(specialWord => {
            const angerValue = Math.round(parseFloat(specialWord.value) * 10);
            return new EmotionalSpecialWord(specialWord.word, type, angerValue, emotionHue)
        })
    }

    _join(table) {
        return table.flat()
    }

    getEmotionWord(word) {
        const stem = getStem(word);
        const [emotion, value, wordType] = this._getEmotionHueValueTtype(word);
        return new EmotionWord(word, stem, emotion, value, wordType);
    }

    _getEmotionHueValueTtype(word) {
        const exactMatch = this._findExactMatch(word)
        if (exactMatch !== undefined){
            return [stemMatch.emotionHue, stemMatch.angerValue, stemMatch.type]
        }
        const lastWordStem = getStem(word)
        const stemMatch = this._findStemMatch(lastWordStem)
        if (stemMatch !== undefined){
            return [stemMatch.emotionHue, stemMatch.angerValue, stemMatch.type]
        }
        return [EmotionHue.Neutral, 0, WordType.unknown]
    }

    _findExactMatch(word) {
        return this.specialEmotionalWords.find(angerWord => angerWord.word === word)
    }

    _findStemMatch(word) {
        return this.specialEmotionalWords.find(angerWord => angerWord.stem === word)
    }

    calculateEmotionalState(gameState) {
        const topHue = this._getTopHue(gameState)
        const saturation = this._getSaturation(gameState)
        const value = this._getValue(gameState)
        return new EmotionalStateHSV(topHue, saturation, value)
    }

    _getTopHue(gameState) {
        const emotionalWords = gameState.emotionalWords

        if (emotionalWords.length === 0) {
            return EmotionHue.Neutral
        }

        const angerScore = this._sumValue(this._filterEmotionHue(emotionalWords, EmotionHue.Anger))
        const happyScore = this._sumValue(this._filterEmotionHue(emotionalWords, EmotionHue.Happy))
        const disgustScore = this._sumValue(this._filterEmotionHue(emotionalWords, EmotionHue.Disgust))
        const fearScore = this._sumValue(this._filterEmotionHue(emotionalWords, EmotionHue.Fear))
        const neutralScore = this._sumValue(this._filterEmotionHue(emotionalWords, EmotionHue.Neutral))
        const sadScore = this._sumValue(this._filterEmotionHue(emotionalWords, EmotionHue.Sadness))
        
        const arr = [angerScore, happyScore, disgustScore, fearScore, neutralScore, sadScore]
        const huesIndexes = {   0: EmotionHue.Anger, 
                                1: EmotionHue.Happy,
                                2: EmotionHue.Disgust,
                                3: EmotionHue.Fear,
                                4: EmotionHue.Neutral,
                                5: EmotionHue.Sadness,
                            }
        const i = arr.indexOf(Math.max(...arr));
        return huesIndexes[i]
    }

    _sumValue(emotionalWords) {
        return emotionalWords.reduce((a, b) => a + b.value, 0)
    }

    _filterEmotionHue(emotionalWords, emotionHue) {
        return emotionalWords.filter(word => word.emotionHue === emotionHue)
    }

    _filterEmotionWordType(emotionalWords, wordType) {
        return emotionalWords.filter(word => word.type === wordType)
    }

    _getSaturation(gameState) {
        const emotionalWords = gameState.emotionalWords
        const numOfStopwords = this._filterEmotionWordType(emotionalWords, WordType.stopWord).length
        const numOfUnknownWords = this._filterEmotionWordType(emotionalWords, WordType.unknown).length
        const numOfRosenbergWords = this._filterEmotionWordType(emotionalWords, WordType.rosenberg).length
        const numOfVulgarWords = this._filterEmotionWordType(emotionalWords, WordType.vulgar).length
        const numOfAllClassifiedWords = numOfStopwords + numOfUnknownWords + numOfRosenbergWords + numOfVulgarWords
        
        return numOfAllClassifiedWords === 0 ? 0 : 
            (numOfStopwords * 25 + numOfUnknownWords * 50 + numOfRosenbergWords * 75 + numOfVulgarWords * 100) /  numOfAllClassifiedWords
    }

    _getValue(gameState) {
        return gameState.emotionalWords.length;
    }

}