// eslint-disable-next-line no-global-assign
require = require("esm")(module)
const t = require('tape-catch')
const _ = require('underscore')

const { createGame, GameInput } = require('../src/js/models/Game.js')
const { EmoHue } = require('../src/js/models/EmoElement.js')


t.test("Game after initialization should Neutral Emotional State", function (t) {
    createGame().then(g => {
        t.deepEquals(g.EmotionalStateHSV, [EmoHue.Neutral, 0, 0])
        t.end()
    })
})

t.test("Game when gets an unknown word it should affect Emotional State saturation", function (t) {
    createGame().then(g => {
        g.sendInput(new GameInput("Jestem", new Date()))
        t.deepEquals(g.EmotionalStateHSV, [EmoHue.Neutral, 25, 1])
        t.end()
    })
})

t.test("Game when gets a stopword it should affect Emotional State saturation", function (t) {
    createGame().then(g => {
        g.sendInput(new GameInput("i", new Date()))
        t.deepEquals(g.EmotionalStateHSV, [EmoHue.Neutral, 25, 1])
        t.end()
    })
})

t.test("Game when gets a nawl word it should affect Emotional State saturation", function (t) {
    createGame().then(g => {
        g.sendInput(new GameInput("ograniczać", new Date())) // 52
        t.deepEquals(g.EmotionalStateHSV, [EmoHue.Anger, 50, 1])
        t.end()
    })
})

t.test("Game when gets a rosenberg word it should affect Emotional State saturation", function (t) {
    createGame().then(g => {
        g.sendInput(new GameInput("markotny", new Date())) // 52
        t.deepEquals(g.EmotionalStateHSV, [EmoHue.Sadness, 75, 1])
        t.end()
    })
})

t.test("Game when gets multiple words should correctly change the Emotional State", function (t) {
    createGame().then(g => {
        const frozenDate = new Date()

        
        const cases = [ // Anger NAWL, unknwon stopword, Disust rosenberg, unknown nawl  
                        [["ograniczać", "i", "znudzony", "kurwa"], [EmoHue.Anger, 50, 4]],
                        
                        // sadness rosenberg, disgust rosenberg, unknwon vulgar
                        [["apatyczna", "znudzony", "jebać"], [EmoHue.Disgust, 83, 3]],

                        // Happiness: 60+60+42, Anger: 70, Sadness: 0, Fear: 0, Disgust: 0
                        // [["ożywiony", "podekscytowany", "wzburzony", "kurwa", "i", "gramofon"], [EmoHue.Happy, 67, 6]]
                    ]

        for(let [inputWords, expectedEmotionalState] of cases) {
            for(let word of inputWords) {
                g.sendInput(new GameInput(word, frozenDate))
                const a = 2
            }
            t.deepEquals(g.EmotionalStateHSV, expectedEmotionalState, inputWords.join(","))
            g.clearState()
        }

        t.end()
    })
})


// t.test('Game when gets input converts it to EmotionWords and has correct EmotionState', function(t){
//     createGame().then(g => {
//         g.sendInput(new GameInput("Jestem", new Date()))
//         g.sendInput(new GameInput("apatyczna", new Date()))

//         const expectedEmotionWords = [ new EmotionWord("Jestem", "Jestem", EmoHue.Unknown, 0),
//                                        new EmotionWord("zakłopotona", "zakłpoton", EmoHue.Fear, 38)]
//         const actualEmotionWords = g.state.emotionWords
//         t.equal(actualEmotionWords, expectedEmotionWords)
        
//         const expectedEmotionalState = [EmoHue.Fear, 50, 22)
//         const actualEmotionalState = g.EmotionalState
//         t.equal(actualEmotionalState, expectedEmotionalState)
//         t.end()
//     })
// })