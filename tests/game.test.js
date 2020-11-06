// eslint-disable-next-line no-global-assign
require = require("esm")(module)
const t = require('tape-catch')

const { createGame } = require('../src/js/game.js')
const { GameInput } = require('../src/js/gameInput.js')


t.test("Game after initialization should have score 0", function (t) {
    createGame().then(g => {
        t.equal(g.Score, 0)
        t.end()
    })
})

t.test("Game after initialization is not finished", function (t) {
    createGame().then(g => {
        t.equal(g.IsFinished, false)
        t.end()
    })
})

t.test("Game with score == 1000 is finished", function (t) {
    createGame().then(g => {
        const word = "value100"
        g.sendInput(new GameInput(word, new Date()))
        t.equal(g.IsFinished, true)
        t.end()
    })
})

t.test("Game with score > 1000 is finished", function (t) {
    createGame().then(g => {
        const word = "value110"
        g.sendInput(new GameInput(word, new Date()))
        t.equal(g.IsFinished, true)
        t.end()
    })
})


t.test("Game when gets a stopword should not change the score", function (t) {
    createGame().then(g => {
        g.sendInput(new GameInput("i", new Date()))
        t.equal(g.Score, 0)
        t.end()
    })
})

t.test("Game when gets a preevaluated word should change the score", function (t) {
    createGame().then(g => {
        const frozenDate = new Date()

        const inputWordScore1 = 52
        const inputWordScore2 = 13

        g.sendInput(new GameInput("ograniczać", frozenDate))
        t.equal(g.Score, inputWordScore1, "Ograniczać adds 52 points")
        g.sendInput(new GameInput("uroczy", frozenDate))
        t.equal(g.Score, inputWordScore1 + inputWordScore2, "Uroczy adds 13 points")
        t.end()
    })
})

t.test("Game whem gets an uknown word should not change the score", function (t) {
    createGame().then(g => {
        const frozenDate = new Date()

        const previousScore = g.Score
        g.sendInput(new GameInput("foo", frozenDate))
        t.equal(g.Score, previousScore, "Score did not change")
        t.end()
    })
})

t.test("Game when gets valued words and different timestamps should both affect the score", function (t) {
    createGame().then(g => {


        let previousScore = g.Score
        g.sendInput(new GameInput("radosny", new Date("2020-10-10T02:00:00")))
        t.equal(g.Score - previousScore, 16, "Ograniczać adds 52 points")
        previousScore = g.Score
        g.sendInput(new GameInput("kłamać", new Date("2020-10-10T02:00:02")))
        const inputWordScore = 46
        const inputRapidityScore = 5
        const expectedScpore = previousScore + inputWordScore + inputRapidityScore
        t.equal(g.Score, expectedScpore, "Uroczy adds 13 points")
        t.end()
    })
})