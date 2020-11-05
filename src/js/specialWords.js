export class SpecialWord {
    constructor(word, type, meanAnger) {
        this.word = word
        this.type = type
        this.meanAnger = meanAnger
    }
}

export const WordType = {
    vulgar: 'vulgar',
    stopWord: 'stopword',
    preevaluated: 'preevaluated',
}