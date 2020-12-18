// eslint-disable-next-line no-global-assign
require = require("esm")(module)
const t = require('tape-catch')

const { EmotionalState, EmotionalCharge, Emotions, WordTypes } = require('../src/js/models/EmotionalState.js')

t.test("New EmotionalState is empty.", function (t) {
    const gs = new EmotionalState()
  
    t.deepEquals(gs.emotionalCharges, [])
    t.end()
})

t.test("EmotionalCharge is added to EmotionalState", function (t) {
    const es = new EmotionalState()
    const emoCh = new EmotionalCharge("foo", Emotions.Neutral, WordTypes.vulgar)
    es.addEmotionalCharge(emoCh)

    t.deepEquals(es.emotionalCharges[es.emotionalCharges.length - 1], emoCh)
    t.end()
})

t.test("addEmoCharge when gets type other than EmotionalCharge should throw error", function (t) {
    const es = new EmotionalState()

    t.throws(() => es.addEmotionalCharge("TEST"), "Only EmotionalCharge can be added to EmotioalState!")
    t.end()
})

t.test("EmotionalState with no EmotionalCharge should return neutral HSV value", function (t) {

    const state = new EmotionalState()
    t.deepEquals(state.getEmotionStateAsHSVColor(), {H: 280, S: 0, V:0})
    t.end()
})

t.test("EmotionalState with one EmotionalCharge should return appropriate HSV value", function (t) {
    const emoCh1 = [new EmotionalCharge("", Emotions.Anger, WordTypes.stopword), {H: 0, S: 25, V: 1}]
    const emoCh2 = [new EmotionalCharge("", Emotions.Disgust, WordTypes.rosenberg), {H: 120, S: 75, V: 1}]
    const emoCh3 = [new EmotionalCharge("", Emotions.Fear, WordTypes.vulgar), {H: 300, S: 100, V: 1}]
    const emoCh4 = [new EmotionalCharge("", Emotions.Happy, WordTypes.nawl), {H: 60, S: 50, V: 1}]
    const emoCh5 = [new EmotionalCharge("", Emotions.Sadness, WordTypes.unknown), {H: 210, S: 0, V: 1}]
    const emoCh6 = [new EmotionalCharge("", Emotions.Neutral, WordTypes.unknown), {H: 280, S: 0, V: 1}]
    const testCases = [emoCh1, emoCh2, emoCh3, emoCh4, emoCh5, emoCh6]

    for(const [emCh, expectedHSV] of testCases) {
        const state = new EmotionalState()
        state.addEmotionalCharge(emCh)
        t.deepEquals(state.getEmotionStateAsHSVColor(), expectedHSV)
    }
    t.end()
})

t.test("EmotionalState with mutiple EmotionalCharges should return appropriate state", function (t) {
    const emoCh1 = new EmotionalCharge("", Emotions.Anger, WordTypes.stopword)
    const emoCh2 = new EmotionalCharge("", Emotions.Anger, WordTypes.vulgar)
    const emoCh3 = new EmotionalCharge("", Emotions.Happy, WordTypes.rosenberg)
    const expectedHSV = {H: 0, S: 66, V: 3}

    const state = new EmotionalState()
    state.addEmotionalCharge(emoCh1)
    state.addEmotionalCharge(emoCh2)
    state.addEmotionalCharge(emoCh3)

    t.deepEquals(state.getEmotionStateAsHSVColor(), expectedHSV)
    t.end()
})
