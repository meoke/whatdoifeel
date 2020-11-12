export class EmotionWord {
    constructor(word, stem, emotionHue, value, type) {
        this.word = word;
        this.stem = stem;
        this.emotion = emotionHue;
        this.value = value;
        this.type = type
    }
}

export const WordType = {
    stopword: 'stopword',
    vulgar: 'vulgar',
    preevaluated: 'preevaluated',
    unknown: 'unknown',
    rosenberg: 'rosenberg',
}

export default EmotionWord;