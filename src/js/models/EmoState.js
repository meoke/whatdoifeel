import { EmoElement, EmoWordType, EmoHue } from './EmoElement'
import * as _ from 'underscore'


export class EmoState {
    constructor() {
        this.emoElements = [];
    }

    get H() {
        const possibleHues = [EmoHue.Anger, EmoHue.Disgust, EmoHue.Fear, EmoHue.Happy, EmoHue.Neutral, EmoHue.Sadness]
        return possibleHues.reduce(
            (acc, hue) => {
                return (this.emoElements.filter(emoEl => emoEl.hue === hue).length >
                    this.emoElements.filter(emoEl => emoEl.hue === acc).length ? hue : acc)
            },
            EmoHue.Neutral)
    }

    get S() {
        const knownWordTypesFrequency = this.emoElements.
            filter(emoElement => emoElement.type !== EmoWordType.unknown).
            reduce((frequencyTable, emoElement) => {
                frequencyTable[emoElement.type] += 1
                return frequencyTable
            }, [0, 0, 0, 0])

        const knownWordsSum = EmoState._sumArr(knownWordTypesFrequency)
        return knownWordsSum === 0 ?
            0 :
            Math.floor(EmoState._weightedMean(knownWordTypesFrequency, [25, 50, 75, 100]))
    }

    get V() {
        return this.emoElements.length;
    }

    static _sumArr(arr) {
        return arr.reduce((a, b) => { return a + b }, 0)
    }

    static _weightedMean(weights, values) {
        if (weights.length !== values.length) {
            throw Error("Weights and values arrays lengths must be equal to calculate weighted mean.")
        }
        const wSum = this._sumArr(weights)
        return wSum === 0 ?
            0 :
            this._sumArr(_.zip(weights, values).
                map(([w, v]) => { return w * v }))
            / wSum
    }

    addEmoElement(emoElement) {
        if (!(emoElement instanceof EmoElement)) {
            throw Error("Only emoElements can be added to EmoState!")
        }
        this.emoElements.push(emoElement)
    }
}