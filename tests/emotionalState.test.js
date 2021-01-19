// eslint-disable-next-line no-global-assign
require = require("esm")(module);
const t = require('tape-catch');

const { EmotionalState, EmotionalCharge, Emotion, WordType} = require('../src/js/models/EmotionalState.js');


t.test("New EmotionalState is empty.", function (t) {
    const gs = new EmotionalState();
  
    t.deepEquals(gs.EmotionalCharges, []);
    t.end();
});

t.test("EmotionalState get i set methods works correctly", function (t) {
    const es = new EmotionalState();
    const emoCharges = [new EmotionalCharge("foo", Emotion.NEUTRAL, WordType.VULGAR, 7)];
    es.EmotionalCharges = emoCharges;

    t.deepEquals(es.EmotionalCharges, emoCharges);
    t.end();
});
