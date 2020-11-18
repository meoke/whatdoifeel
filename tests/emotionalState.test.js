// eslint-disable-next-line no-global-assign
require = require("esm")(module)
const t = require('tape-catch')

const { EmoState, EmoElement, EmoHue, EmoWordType } = require('../src/js/models/EmoState.js')


t.test("EmotionalStateHSV after initialization should be (neutral, 0, 0)", function (t) {
    const expectedH = EmoHue.Neutral
    const expectedS = 0
    const expectedV = 0

    const emoState = new EmoState()
    const actualH = emoState.H
    const actualS = emoState.S
    const actualV = emoState.V

    t.equal(actualH, expectedH, "Neutral Hue")
    t.equal(actualS, expectedS, "Saturation 0")
    t.equal(actualV, expectedV, "Value 0")

    t.end()
})

t.test("EmotionalStateHSV with one emoElement should return appropriate state", function (t) {
    const emoEl1 = [new EmoElement("", EmoHue.Anger, EmoWordType.stopword), [EmoHue.Anger, 25, 1]]
    const emoEl2 = [new EmoElement("", EmoHue.Disgust, EmoWordType.rosenberg), [EmoHue.Disgust, 75, 1]]
    const emoEl3 = [new EmoElement("", EmoHue.Fear, EmoWordType.vulgar), [EmoHue.Fear, 100, 1]]
    const emoEl4 = [new EmoElement("", EmoHue.Happy, EmoWordType.nawl), [EmoHue.Happy, 50, 1]]
    const emoEl5 = [new EmoElement("", EmoHue.Sadness, EmoWordType.unknown), [EmoHue.Sadness, 0, 1]]
    const emoEl6 = [new EmoElement("", EmoHue.Neutral, EmoWordType.unknown), [EmoHue.Neutral, 0, 1]]
    const testCases = [emoEl1, emoEl2, emoEl3, emoEl4, emoEl5, emoEl6]
    
    

    for(const [EmoElement, [expectedH, expectedS, expectedV]] of testCases) {
        const esHSV = new EmoState()
        esHSV.addElement(EmoElement)
        t.equal(esHSV.H, expectedH, "Hue")
        t.equal(esHSV.S, expectedS, "Saturation")
        t.equal(esHSV.V, expectedV, "Value")
    }
    t.end()
})

t.test("Sum array", function(t) {
    const testCases = [
        {"arr": [], "expectedSum": 0},
        {"arr": [1], "expectedSum": 1},
        {"arr": [0,10,12,0], "expectedSum": 22},
    ]
    
    for(const tc of testCases) {
        const actualSum = EmoState._sumArr(tc.arr)
        t.equal(actualSum, tc.expectedSum)
    }
    t.end()
})

t.test("Weighted mean", function(t) {
    const testCases = [
        {"weights": [10], "values": [1], "expectedMean": 1},
        {"weights": [2, 0], "values": [25, 50], "expectedMean": 25},
        {"weights": [1, 1, 1, 1], "values": [25, 50, 75, 100], "expectedMean": 62.5},
        {"weights": [], "values": [], "expectedMean": 0},
        {"weights": [1, 1], "values": [0, 0], "expectedMean": 0},
    ]
    
    for(const tc of testCases) {
        const actualWeightedMean = EmoState._weightedMean(tc.weights, tc.values)
        t.equal(actualWeightedMean, tc.expectedMean)
    }
    t.throws(() => EmoState._weightedMean([0], [1,2]), "Weights and values arrays lengths must be equal to calculate weighted mean.")
    t.end()
})