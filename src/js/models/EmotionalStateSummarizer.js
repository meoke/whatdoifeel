import _ from 'underscore';
import {Emotion, WordType} from './EmotionalCharge';

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
 * Provides different ways of summarizing list of Emotional Charges.
 */
export class EmotionalStateSummarizer {
    /**
    * Intensity value from range [0,7]
    * @typedef {number} Intensity
    */
    /**
     * Returns EmotionalState's Intensity based on word types as value from range [0,7].
     * @param {EmotionalState} Emotional State
     * @returns {Intensity} 
     */
    summarizeToIntensity(emotionalState) {
        const emotionalChargesCount = emotionalState.EmotionalCharges.length;
        return _.chain(emotionalState.EmotionalCharges)
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
     * @param {EmotionalState} Emotional State
     * @returns {EmotionalStateShares} percentage values of emotional components of EmotionalState
     */
    summarizeToShares(emotionalState) {
        const notNeutralWords = emotionalState.EmotionalCharges.filter(el => el.emotion !== Emotion.NEUTRAL);
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
     * @param {EmotionalState} Emotional State
     * @returns {HSV} Color as HSV (Hue, Saturation, Value)
     */
    summarizeToHSVColor(emotionalState) {
        const calculateHue = () => {
            const topEmotion = _.chain(emotionalState.EmotionalCharges)
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

            const saturationsSum = _.chain(emotionalState.EmotionalCharges)
                .groupBy("wordType")
                .mapObject((emoElements, wordType) => {
                    return Saturations[wordType] * emoElements.length;
                })
                .values()
                .reduce((a, b) => a + b)
                .value();
            const saturationMean = saturationsSum === undefined ?
                0 :
                Math.floor(saturationsSum / emotionalState.EmotionalCharges.length);
            return saturationMean;
        };

        const calculateValue = () => {
            return Math.min(100, 80 + emotionalState.EmotionalCharges.length);
        };

        return {
            H: calculateHue(),
            S: calculateSaturation(),
            V: calculateValue()
        };
    }
}