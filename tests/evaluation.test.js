// eslint-disable-next-line no-global-assign
require = require("esm")(module)
const t = require('tape-catch')

const { Evaluation, EvaluationInput } = require('../src/js/models/Evaluation.js')

t.test("Single word affects evaluation state.", async function (t) {
    const testCases = [
        { name: "Evaluation when gets an unknown word it should affect Emotional State HSV", input: "Jestem", expectedHSV: { H: 280, S: 25, V: 1 } },
        { name: "Evaluation when gets a stopword it should affect Emotional State HSV", input: "i", expectedHSV: { H: 280, S: 25, V: 1 } },
        { name: "Evaluation when gets a nawl word it should affect Emotional State HSV", input: "ograniczać", expectedHSV: { H: 0, S: 50, V: 1 } },
        { name: "Evaluation when gets a rosenberg word it should affect Emotional State HSV", input: "markotny", expectedHSV: { H: 210, S: 75, V: 1 } }
    ];
    for (const tc of testCases) {
        const g = await Evaluation.createEvaluation()
        g.sendInput(new EvaluationInput(tc.input, new Date()));
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
            expectedHSV: { H: 0, S: 62, V: 4 }
        },
        {
            name: "Sadness Rosenberg, Disgust Rosenberg, Unknown Vulgar",
            inputs: ["apatyczna", "znudzony", "jebać"],
            expectedHSV: { H: 120, S: 83, V: 3 }
        },
        {
            name: "Happiness Rosenberg, Happiness Rosenberg, Anger Rosenberg, Unknown Vulgar, Unknown Stopword, Happiness NAWL",
            inputs: ["ożywiony", "podekscytowany", "wzburzony", "kurwa", "i", "gramofon"],
            expectedHSV: { H: 60, S: 66, V: 6 }
        },
        {
            name: "Happiness Rosenberg, Unknown Unknown",
            inputs: ["uskrzydlony", "foo"],
            expectedHSV: { H: 60, S: 37, V: 2 }
        }
    ]

    for(const tc of testCases) {
        const g = await Evaluation.createEvaluation();
        for (const word of tc.inputs) {
            g.sendInput(new EvaluationInput(word, new Date()));
        }
        const actualEmoStateHSV = g.EmotionalStateHSV;
        t.deepEquals(actualEmoStateHSV, tc.expectedHSV, tc.name);
    }
    t.end();
})