/**
 * Describes Emotional State.
 */
export class EmotionalState {
    /**
     * Creates empty Emotional State.
     */
    constructor() {
        this.emotionalCharges = [];
    }

    /**
    * @typedef {import('./EmotionalCharge.js').EmotionalCharge} EmotionalCharge
    */
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