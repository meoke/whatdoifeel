// eslint-disable-next-line no-global-assign
require = require("esm")(module)
const t = require('tape-catch')
const _ = require('underscore')

const { createGame } = require('../src/js/models/Game.js')
const { GameInput } = require('../src/js/models/GameInput.js')
const { EmotionWord } = require('../src/js/models/EmotionWord.js')
const { EmotionalStateHSV } = require('../src/js/models/EmotionalStateHSV.js')
const { EmotionHue } = require('../src/js/models/EmotionHue.js')


t.test("Game after initialization should Neutral Emotional State", function (t) {
    createGame().then(g => {
        t.deepEquals(g.EmotionalStateHSV, new EmotionalStateHSV(EmotionHue.Neutral, 0, 0))
        t.end()
    })
})

t.test("Game when gets an unknown word it should affect Emotional State saturation", function (t) {
    createGame().then(g => {
        g.sendInput(new GameInput("Jestem", new Date()))
        t.deepEquals(g.EmotionalStateHSV, new EmotionalStateHSV(EmotionHue.Neutral, 25, 1))
        // t.ok(_.isEqual(g.EmotionalStateHSV, new EmotionalStateHSV(EmotionHue.Neutral, 25, 1)))
        t.end()
    })
})

// t.test("Game when gets a stopword it should affect Emotional State saturation", function (t) {
//     createGame().then(g => {
//         g.sendInput(new GameInput("i", new Date()))
//         t.equal(g.EmotionalStateHSV, new EmotionalStateHSV(EmotionHue.Neutral, 25, 1))
//         t.end()
//     })
// })

// t.test("Game when gets a preevaluated word it should affect Emotional State saturation", function (t) {
//     createGame().then(g => {
//         g.sendInput(new GameInput("ograniczać", new Date())) // 52
//         t.equal(g.EmotionalStateHSV, new EmotionalStateHSV(EmotionHue.Fear, 50, 1))
//         t.end()
//     })
// })

// t.test("Game when gets a rosenberg word it should affect Emotional State saturation", function (t) {
//     createGame().then(g => {
//         g.sendInput(new GameInput("markotny", new Date())) // 52
//         t.equal(g.EmotionalStateHSV, new EmotionalStateHSV(EmotionHue.Sadness, 75, 1))
//         t.end()
//     })
// })

// t.test("Game when gets multiple words should correctly change the Emotional State", function (t) {
//     createGame().then(g => {
//         const frozenDate = new Date()

        
//         const cases = [// Happiness: 0, Anger: 1 *52, Sadness: 0, Fear: 0, Disgust: 1*60
//                         [["ograniczać", "i", "znudzony", "kurwa"], new EmotionalStateHSV(EmotionHue.Disgust, 63, 24)],
                        
//                         // Happiness: 0, Anger: 0, Sadness: 60, Fear: 0, Disgust: 60
//                         [["apatyczny", "znudzony", "kurwa"], new EmotionalStateHSV(EmotionHue.Sadness, 84, 23)],

//                         // Happiness: 60+60+42, Anger: 70, Sadness: 0, Fear: 0, Disgust: 0
//                         [["ożywiony", "podekscytowany", "wzburzony", "kurwa", "i", "gramofon"], new EmotionalStateHSV(EmotionHue.Happiness, 67, 6)]
//                     ]

//         for(let [inputWords, expectedEmotionalState] of cases) {
//             for(let word of inputWords) {
//                 g.sendInput(new GameInput(word, frozenDate))
//             }
//             t.equal(g.EmotionalStateHSV, expectedEmotionalState, inputWords.join(","))
//         }

//         t.end()
//     })
// })


// t.test('Game when gets input converts it to EmotionWords and has correct EmotionState', function(t){
//     createGame().then(g => {
//         g.sendInput(new GameInput("Jestem", new Date()))
//         g.sendInput(new GameInput("apatyczna", new Date()))

//         const expectedEmotionWords = [ new EmotionWord("Jestem", "Jestem", EmotionHue.Unknown, 0),
//                                        new EmotionWord("zakłopotona", "zakłpoton", EmotionHue.Fear, 38)]
//         const actualEmotionWords = g.state.emotionWords
//         t.equal(actualEmotionWords, expectedEmotionWords)
        
//         const expectedEmotionalState = new EmotionalStateHSV(EmotionHue.Fear, 50, 22)
//         const actualEmotionalState = g.EmotionalState
//         t.equal(actualEmotionalState, expectedEmotionalState)
//         t.end()
//     })
// })