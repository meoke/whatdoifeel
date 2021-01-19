// eslint-disable-next-line no-global-assign
require = require("esm")(module);
const t = require('tape-catch');

const {EmotionalState, Emotion, EmotionalCharge, WordType}  = require('../src/js/models/EmotionalState');
const {EmotionalStateSummarizer, EmotionHue}  = require('../src/js/models/EmotionalStateSummarizer');

t.test("EmotionalStateSummarizer should return neutral HSV value for empty EmotionalState", function (t) {
    const summarizer = new EmotionalStateSummarizer();
    const state = new EmotionalState();
    t.deepEquals(summarizer.summarizeToHSVColor(state), 
                {H: EmotionHue[Emotion.NEUTRAL], S: 0, V:80});
    t.end();
});

t.test("EmotionalStateSummarizer should return appropriate HSV value for Emotional State with one EmotionalCharge ", function (t) {
    const emoCh1 = [new EmotionalCharge("", Emotion.ANGER, WordType.STOPWORD, 0), {H: EmotionHue[Emotion.ANGER], S: 25, V: 81}];
    const emoCh2 = [new EmotionalCharge("", Emotion.DISGUST, WordType.ROSENBERG, 6), {H: EmotionHue[Emotion.DISGUST], S: 75, V: 81}];
    const emoCh3 = [new EmotionalCharge("", Emotion.FEAR, WordType.VULGAR, 7), {H: EmotionHue[Emotion.FEAR], S: 100, V: 81}];
    const emoCh4 = [new EmotionalCharge("", Emotion.HAPPY, WordType.NAWL, 1.4), {H: EmotionHue[Emotion.HAPPY], S: 50, V: 81}];
    const emoCh5 = [new EmotionalCharge("", Emotion.SADNESS, WordType.UNKNOWN, 0), {H: EmotionHue[Emotion.SADNESS], S: 0, V: 81}];
    const emoCh6 = [new EmotionalCharge("", Emotion.NEUTRAL, WordType.UNKNOWN, 0), {H: EmotionHue[Emotion.NEUTRAL], S: 0, V: 81}];
    const testCases = [emoCh1, emoCh2, emoCh3, emoCh4, emoCh5, emoCh6];

    const summarizer = new EmotionalStateSummarizer();
    for(const [emCh, expectedHSV] of testCases) {
        const state = new EmotionalState([emCh]);
        t.deepEquals(summarizer.summarizeToHSVColor(state), expectedHSV);
    }
    t.end();
});

t.test("EmotionalStateSummarizer should return appropriate HSV value for Emotional State with multiple EmotionalCharges", function (t) {
    const emoCh1 = new EmotionalCharge("", Emotion.ANGER, WordType.STOPWORD);
    const emoCh2 = new EmotionalCharge("", Emotion.ANGER, WordType.VULGAR);
    const emoCh3 = new EmotionalCharge("", Emotion.HAPPY, WordType.ROSENBERG);
    const expectedHSV = {H: EmotionHue[Emotion.ANGER], S: 66, V: 83};

    const state = new EmotionalState([emoCh1, emoCh2, emoCh3]);
    const summarizer = new EmotionalStateSummarizer();
    t.deepEquals(summarizer.summarizeToHSVColor(state), expectedHSV);
    t.end();
});

t.test("EmotionalStateSummarizer should return appropriate intensity value", function(t) {
    const testCases = [
        {emotionalCharges: [],
         expectedIntensity: 0},
         {emotionalCharges: [new EmotionalCharge("", Emotion.ANGER, WordType.STOPWORD, 6)],
        expectedIntensity: 6},
        {emotionalCharges: [new EmotionalCharge("", Emotion.ANGER, WordType.STOPWORD, 0.5),
                new EmotionalCharge("", Emotion.ANGER, WordType.STOPWORD, 2),
                new EmotionalCharge("", Emotion.ANGER, WordType.STOPWORD, 2.9), ],
         expectedIntensity: 1.8}
    ];
    const summarizer = new EmotionalStateSummarizer();

    for(const tc of testCases){
        const state = new EmotionalState(tc.emotionalCharges);
        t.equals(summarizer.summarizeToIntensity(state), tc.expectedIntensity);
    }
    t.end();
});

t.test("EmotionalStateSummarizer should return approriate emotions shares", function(t) {
    const emotionalCharges = [
        new EmotionalCharge("", Emotion.ANGER, WordType.STOPWORD),
        new EmotionalCharge("", Emotion.FEAR, WordType.STOPWORD),
        new EmotionalCharge("", Emotion.NEUTRAL, WordType.STOPWORD),
        new EmotionalCharge("", Emotion.NEUTRAL, WordType.STOPWORD),
        new EmotionalCharge("", Emotion.SADNESS, WordType.STOPWORD),
        new EmotionalCharge("", Emotion.FEAR, WordType.STOPWORD),
        new EmotionalCharge("", Emotion.FEAR, WordType.STOPWORD),
        new EmotionalCharge("", Emotion.HAPPY, WordType.STOPWORD)];
    const state = new EmotionalState(emotionalCharges);
    const expectedShares = {anger: 16, disgust: 0, fear: 50, happiness:16, sadness: 16};
    const summarizer = new EmotionalStateSummarizer();
    const actualShares = summarizer.summarizeToShares(state);
    t.deepEquals(actualShares, expectedShares);
    t.end();
});