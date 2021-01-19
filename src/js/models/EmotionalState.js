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
 * Describes Emotional State.
 */
export class EmotionalState {
    /**
    * @typedef {import('./EmotionalCharge.js').EmotionalCharge} EmotionalCharge
    */
    /**
     * Creates Emotional State with provided EmotionalCharges.
     * @param{Array.EmotionalCharge} initial EmotionalCharges of the state
     */
    constructor(emotionalCharges) {
        this.emotionalCharges = _.isEmpty(emotionalCharges) ? [] : emotionalCharges;
    }

    /**
     * @param{Array.EmotionalCharge} Array of Emotional Charges.
     */
    set EmotionalCharges(emotionalCharges) {
        this.emotionalCharges = emotionalCharges;
    }

    /**
     * @returns{Array.EmotionalCharge} Array of Emotional Charges.
     */
    get EmotionalCharges() {
        return this.emotionalCharges;
    }
}