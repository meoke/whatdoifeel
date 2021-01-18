import _ from 'underscore';

/**
 * Represents all possible types of emotions that EmotionalCharge can be assigned.
 * @readonly
 * @enum {number}
 */
export const Emotion = Object.freeze({
    FEAR: 0,
    SADNESS: 1,
    DISGUST: 2,
    ANGER: 3,
    HAPPY: 4,
    NEUTRAL: 5
});


/**
 * Represents all possible classification of words based on their source.
 * @readonly
 * @enum {number}
 */
export const WordType = Object.freeze({
    /** Word identified as a Polish stop word */
    STOPWORD: 0,
    /** Word that is present in The Nencki Affective Word List */
    NAWL: 1,
    /** Word that is present in list of emotions presented by M. Rosenberg */
    ROSENBERG: 2,
    /** Word identified as a Polish vulgar word */
    VULGAR: 3,
    /** Unknown source */
    UNKNOWN: 4
});

/**
 * Mapping of emotions to Hue in HSV/HSL color model.
 * @readonly
 * @enum{number}
 */
export const EmotionHue = Object.freeze({
    [Emotion.FEAR]: 300,
    [Emotion.SADNESS]: 210,
    [Emotion.DISGUST]: 120,
    [Emotion.ANGER]: 0,
    [Emotion.HAPPY]: 45,
    [Emotion.NEUTRAL]: 280
});

/**
 * Describes emotional charge of a single word.
 */
export class EmotionalCharge {
    /**
     * Creates EmotionalCharge.
     * @constructor
     * @param {string} word - a single Polish word
     * @param {Emotion} emotion - main emotion being expressed by this word
     * @param {WordType} wordType - word classification
     * @param {number} wordPower - word power of expression
     */
    constructor(word, emotion, wordType, wordPower) {
        this.word = word;
        this.emotion = emotion;
        this.wordType = wordType;
        this.power = wordPower;
    }
}

/**
 * Container of Emotional Charges constituting one's Emotional State. 
 * Provides different ways of its interpretation e.g as a color.
 */
export class EmotionalState {
    /**
     * Creates neutral EmotionalState.
     */
    constructor() {
        this.emotionalCharges = [];
    }

    /**
     * Adds EmotionalCharge to the EmotionalState
     * @param {EmotionalCharge} EmotionalCharge object
     */
    addEmotionalCharge(emotionalCharge) {
        if (!(emotionalCharge instanceof EmotionalCharge)) {
            throw Error("Only EmotionalCharge can be added to EmotionalState!");
        }
        this.emotionalCharges.push(emotionalCharge);
    }

    /**
    * Intensity value from range [0,7]
    * @typedef {number} Intensity
    */
    /**
     * Returns EmotionalState's Intensity based on word types as value from range [0,7].
     * @returns {Intensity} 
     */
    getEmotionalStateIntensity() {
        const emotionalChargesCount = this.emotionalCharges.length;
        return _.chain(this.emotionalCharges)
                .map(ch => {return ch.power;})
                .reduce((acc, val) => {
                    return acc + val;
                }, 0) / (emotionalChargesCount === 0 ? 1 : emotionalChargesCount);
    }

    /**
     * @typedef {Object} EmotionalStateShares
     * @property {number} anger - the percentage part of anger in EmotionalState
     * @property {number} disgust - the percentage part of disgust in EmotionalState
     * @property {number} fear - the percentage part of fear in EmotionalState
     * @property {number} happiness - the percentage part of happiness in EmotionalState
     * @property {number} sadness - the percentage part of sadness in EmotionalState
    */
    /**
     * Returns EmotionalState as percentage breakdown of component emotions
     * @returns {EmotionalStateShares} percentage values of emotional components of EmotionalState
     */
    getEmotionalStateAsShares() {
        const notNeutralWords = this.emotionalCharges.filter(el => el.emotion !== Emotion.NEUTRAL);
        const getCountOfNotNeutralWords = e => {return notNeutralWords.filter(el => el.emotion === e).length;};
        const getShare = e => {return notNeutralWords.length === 0 ?
                                      0 :
                                      getCountOfNotNeutralWords(e) / notNeutralWords.length * 100;};
        return {
            [Emotion.ANGER]: getShare(Emotion.ANGER),
            [Emotion.DISGUST]: getShare(Emotion.DISGUST),
            [Emotion.FEAR]: getShare(Emotion.FEAR),
            [Emotion.HAPPY]: getShare(Emotion.HAPPY),
            [Emotion.SADNESS]: getShare(Emotion.SADNESS)
        };
    }

    /**
     * @typedef {Object} HSV
     * @property {number} H - Hue from range [0,360]
     * @property {number} S - Saturation from range [0,100]
     * @property {number} V - Value from range [80,100]
    */
    /**
     * Returns EmotionalState as a color in HSV model
     * @returns {HSV} Color as HSV (Hue, Saturation, Value)
     */
    getEmotionStateAsHSVColor() {
        const calculateHue = () => {
            const topEmotion = _.chain(this.emotionalCharges)
                .filter(el => el.emotion !== Emotion.NEUTRAL)
                .groupBy("emotion")
                .mapObject((emoElements, emotion) => {
                    return { "emotion": emotion, "frequency": emoElements.length };
                })
                .values()
                .sortBy("frequency")
                .reverse()
                .first()
                .value();

            return topEmotion === undefined ? EmotionHue[Emotion.NEUTRAL] : EmotionHue[parseInt(topEmotion.emotion)];
        };

        const calculateSaturation = () => {
            const Saturations = {
                [WordType.STOPWORD]: 25,
                [WordType.NAWL]: 50,
                [WordType.ROSENBERG]: 75,
                [WordType.VULGAR]: 100,
                [WordType.UNKNOWN]: 0
            };

            const saturationsSum = _.chain(this.emotionalCharges)
                .groupBy("wordType")
                .mapObject((emoElements, wordType) => {
                    return Saturations[wordType] * emoElements.length;
                })
                .values()
                .reduce((a, b) => a + b)
                .value();
            const saturationMean = saturationsSum === undefined ?
                0 :
                Math.floor(saturationsSum / this.emotionalCharges.length);
            return saturationMean;
        };

        const calculateValue = () => {
            return Math.min(100, 80 + this.emotionalCharges.length);
        };

        return {
            H: calculateHue(),
            S: calculateSaturation(),
            V: calculateValue()
        };
    }
}