export class EmoElement {
    constructor(word, hue, type) {
        this.word = word
        this.hue = hue
        this.type = type
    }
}

export const EmoHue = {
    Fear: 300,
    Sadness: 210,
    Disgust: 120,
    Anger: 0,
    Happy: 60,
    Neutral: 280
}

export const EmoWordType = Object.freeze({
    stopword: 0,
    nawl: 1,
    rosenberg: 2,
    vulgar: 3,
    unknown: 4
})