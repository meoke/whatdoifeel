import _ from 'underscore'

export const Emotions = Object.freeze({
    Fear: 0,
    Sadness: 1,
    Disgust: 2,
    Anger: 3,
    Happy: 4,
    Neutral: 5
})

export const WordTypes = Object.freeze({
    stopword: 0,
    nawl: 1,
    rosenberg: 2,
    vulgar: 3,
    unknown: 4
})

export class EmotionalCharge {
    constructor(word, emotion, wordType) {
        this.word = word
        this.emotion = emotion
        this.wordType = wordType
    }
}

export class EmotionalState {
    constructor() {
        this.emotionalCharges = [];
    }

    addEmotionalCharge(emotionalCharge) {
        if (!(emotionalCharge instanceof EmotionalCharge)) {
            throw Error("Only EmotionalCharge can be added to EmotioalState!")
        }
        this.emotionalCharges.push(emotionalCharge)
    }

    getEmotionStateAsHSVColor() {
        const calculateHue = () => {
            const Hues = {
                [Emotions.Fear]: 300,
                [Emotions.Sadness]: 210,
                [Emotions.Disgust]: 120,
                [Emotions.Anger]: 0,
                [Emotions.Happy]: 60,
                [Emotions.Neutral]: 280
            }

            const topEmotion = _.chain(this.emotionalCharges)
                            .filter(el => el.emotion !== Emotions.Neutral)
                            .groupBy("emotion")
                            .mapObject((emoElements, emotion) => { 
                                return { "emotion": emotion, "frequency": emoElements.length } })
                            .values()
                            .sortBy("frequency")
                            .reverse()
                            .first()
                            .value()

            return topEmotion === undefined ? Hues[Emotions.Neutral] : Hues[parseInt(topEmotion.emotion)]
        }

        const calculateSaturation = () => {
            const Saturations = {
                [WordTypes.stopword]: 25,
                [WordTypes.nawl]: 50,
                [WordTypes.rosenberg]: 75,
                [WordTypes.vulgar]: 100,
                [WordTypes.unknown]: 0
            }

            const saturationsSum = _.chain(this.emotionalCharges)
                                    .groupBy("wordType")
                                    .mapObject((emoElements, wordType) => {
                                        return Saturations[wordType] * emoElements.length
                                    })
                                    .values()
                                    .reduce((a, b) => a + b)
                                    .value()
            const saturationMean = saturationsSum === undefined ?
                                   0 :
                                   Math.floor(saturationsSum/this.emotionalCharges.length)
            return saturationMean
        }

        const calculateValue = () => {
            return this.emotionalCharges.length;
        }

        return {
            H: calculateHue(),
            S: calculateSaturation(),
            V: calculateValue()
        }
    }
}