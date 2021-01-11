// eslint-disable-next-line no-global-assign
require = require("esm")(module)
const t = require('tape-catch')

const { EmotionalStateEvaluationFactory } = require('../src/js/models/EmotionalStateEvaluation.js')
const { EmotionHue, Emotion } = require('../src/js/models/EmotionalState.js')

async function createEvaluation() {
    return await (new EmotionalStateEvaluationFactory()).createEvaluation(()=>{});
}

t.test("Single word affects evaluation state.", async function (t) {
    const testCases = [
        { name: "Evaluation when gets an unknown word it should affect Emotional State HSV", input: "Jestem", expectedHSV: { H: 280, S: 25, V: 81 } },
        { name: "Evaluation when gets a stopword it should affect Emotional State HSV", input: "i", expectedHSV: { H: 280, S: 25, V: 81 } },
        { name: "Evaluation when gets a nawl word it should affect Emotional State HSV", input: "ograniczać", expectedHSV: { H: 0, S: 50, V: 81 } },
        { name: "Evaluation when gets a rosenberg word it should affect Emotional State HSV", input: "markotny", expectedHSV: { H: 210, S: 75, V: 81 } }
    ];
    for (const tc of testCases) {
        const g = await createEvaluation()
        g.addWord(tc.input);
        const actualEmoStateHSV = g.EmotionalStateHSV;
        t.deepEquals(actualEmoStateHSV, tc.expectedHSV, tc.name);
    }
    t.end();
})


t.test("Evaluation when gets multiple words should correctly change the Emotional State", async function (t) {
    const testCases = [
        {
            name: "Anger NAWL, Unknwon Stopword, Disgust Rosenberg, Unknown Vulgar",
            inputs: ["ograniczać", "i", "znudzony", "kurwa"],
            expectedHSV: { H: EmotionHue[Emotion.ANGER], S: 62, V: 84 }
        },
        {
            name: "Sadness Rosenberg, Disgust Rosenberg, Unknown Vulgar",
            inputs: ["apatyczna", "znudzony", "jebać"],
            expectedHSV: { H: EmotionHue[Emotion.DISGUST], S: 83, V: 83 }
        },
        {
            name: "Happiness Rosenberg, Happiness Rosenberg, Anger Rosenberg, Unknown Vulgar, Unknown Stopword, Happiness NAWL",
            inputs: ["ożywiony", "podekscytowany", "wzburzony", "kurwa", "i", "gramofon"],
            expectedHSV: { H: EmotionHue[Emotion.HAPPY], S: 66, V: 86 }
        },
        {
            name: "Happiness Rosenberg, Unknown Unknown",
            inputs: ["uskrzydlony", "foo"],
            expectedHSV: { H: EmotionHue[Emotion.HAPPY], S: 37, V: 82 }
        }
    ]

    for(const tc of testCases) {
        const g = await createEvaluation();
        for (const word of tc.inputs) {
            g.addWord(word);
        }
        const actualEmoStateHSV = g.EmotionalStateHSV;
        t.deepEquals(actualEmoStateHSV, tc.expectedHSV, tc.name);
    }
    t.end();
})