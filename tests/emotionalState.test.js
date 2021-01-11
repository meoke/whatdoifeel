// eslint-disable-next-line no-global-assign
require = require("esm")(module);
const t = require('tape-catch');

const { EmotionalState, EmotionalCharge, Emotion, WordType, EmotionHue } = require('../src/js/models/EmotionalState.js');



t.test("New EmotionalState is empty.", function (t) {
    const gs = new EmotionalState();
  
    t.deepEquals(gs.emotionalCharges, []);
    t.end();
});

t.test("EmotionalCharge is added to EmotionalState", function (t) {
    const es = new EmotionalState();
    const emoCh = new EmotionalCharge("foo", Emotion.NEUTRAL, WordType.VULGAR);
    es.addEmotionalCharge(emoCh);

    t.deepEquals(es.emotionalCharges[es.emotionalCharges.length - 1], emoCh);
    t.end();
});

t.test("addEmoCharge when gets type other than EmotionalCharge should throw error", function (t) {
    const es = new EmotionalState();

    t.throws(() => es.addEmotionalCharge("TEST"), "Only EmotionalCharge can be added to EmotioalState!");
    t.end();
});

t.test("EmotionalState with no EmotionalCharge should return neutral HSV value", function (t) {

    const state = new EmotionalState();
    t.deepEquals(state.getEmotionStateAsHSVColor(), {H: EmotionHue[Emotion.NEUTRAL], S: 0, V:80});
    t.end();
});

t.test("EmotionalState with one EmotionalCharge should return appropriate HSV value", function (t) {
    const emoCh1 = [new EmotionalCharge("", Emotion.ANGER, WordType.STOPWORD), {H: EmotionHue[Emotion.ANGER], S: 25, V: 81}];
    const emoCh2 = [new EmotionalCharge("", Emotion.DISGUST, WordType.ROSENBERG), {H: EmotionHue[Emotion.DISGUST], S: 75, V: 81}];
    const emoCh3 = [new EmotionalCharge("", Emotion.FEAR, WordType.VULGAR), {H: EmotionHue[Emotion.FEAR], S: 100, V: 81}];
    const emoCh4 = [new EmotionalCharge("", Emotion.HAPPY, WordType.NAWL), {H: EmotionHue[Emotion.HAPPY], S: 50, V: 81}];
    const emoCh5 = [new EmotionalCharge("", Emotion.SADNESS, WordType.UNKNOWN), {H: EmotionHue[Emotion.SADNESS], S: 0, V: 81}];
    const emoCh6 = [new EmotionalCharge("", Emotion.NEUTRAL, WordType.UNKNOWN), {H: EmotionHue[Emotion.NEUTRAL], S: 0, V: 81}];
    const testCases = [emoCh1, emoCh2, emoCh3, emoCh4, emoCh5, emoCh6];

    for(const [emCh, expectedHSV] of testCases) {
        const state = new EmotionalState();
        state.addEmotionalCharge(emCh);
        t.deepEquals(state.getEmotionStateAsHSVColor(), expectedHSV);
    }
    t.end();
});

t.test("EmotionalState with mutiple EmotionalCharges should return appropriate state", function (t) {
    const emoCh1 = new EmotionalCharge("", Emotion.ANGER, WordType.STOPWORD);
    const emoCh2 = new EmotionalCharge("", Emotion.ANGER, WordType.VULGAR);
    const emoCh3 = new EmotionalCharge("", Emotion.HAPPY, WordType.ROSENBERG);
    const expectedHSV = {H: EmotionHue[Emotion.ANGER], S: 66, V: 83};

    const state = new EmotionalState();
    state.addEmotionalCharge(emoCh1);
    state.addEmotionalCharge(emoCh2);
    state.addEmotionalCharge(emoCh3);

    t.deepEquals(state.getEmotionStateAsHSVColor(), expectedHSV);
    t.end();
});
