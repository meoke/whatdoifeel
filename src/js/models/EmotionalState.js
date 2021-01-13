import _ from 'underscore';

/**
 * Represents all possible types of emotions that EmotionalCharge can have assigned.
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
 * Represents all possible classification of words based on their characteristics.
 * @readonly
 * @enum {number}
 */
export const WordType = Object.freeze({
    /**Word identified as Polish stop word.*/
    STOPWORD: 0,
    /**Word that is present in The Nencki Affective Word List*/
    NAWL: 1,
    /**Word that is present in list of emotions presented by M. Rosenberg */
    ROSENBERG: 2,
    /**Word identified as Polish vulgar word */
    VULGAR: 3,
    /**Unknown type*/
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
 * Class representing EmotionalCharge of a single word provided to the Emotional State model.
 */
export class EmotionalCharge {
    /**
     * Creates EmotionalCharge.
     * @constructor
     * @param {string} word - the original Polish word provided to the model
     * @param {Emotion} emotion - emotion being expressed by this word
     * @param {WordType} wordType - word classification
     * @param {number} wordStrength - word expression strength
     */
    constructor(word, emotion, wordType, wordStrength) {
        this.word = word;
        this.emotion = emotion;
        this.wordType = wordType;
        this.strength = wordStrength;
    }
}

/**
 * Class representing Emotional State.
 */
export class EmotionalState {
    /**Creates neutral EmotionalState.
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
     * @typedef {Object} EmotionalStateComponents
     * @property {number} anger - the percentage part of anger in EmotionalState
     * @property {number} disgust - the percentage part of disgust in EmotionalState
     * @property {number} fear - the percentage part of fear in EmotionalState
     * @property {number} happiness - the percentage part of happiness in EmotionalState
     * @property {number} sadness - the percentage part of sadness in EmotionalState
    */
    /**
     * Returns EmotionalState as percentage breakdown of component emotions
     * @returns {EmotionalStateComponents} percentage values of emotional components of EmotionalState
     */
    getEmotionStateComponents() {
        const notNeutralWords = this.emotionalCharges.filter(el => el.emotion !== Emotion.NEUTRAL);
        const getCountOfEmotionWords = e => {return notNeutralWords.filter(el => el.emotion === e).length;};
        const getShare = e => {return notNeutralWords.length === 0 ?
                                      0 :
                                      getCountOfEmotionWords(e) / notNeutralWords.length * 100;};
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