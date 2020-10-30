require = require('esm')(module);
const t = require('tape');
const {GameInput} = require('../src/js/gameInput.js'); 
const {Game} = require('../src/js/game.js'); 

t.test("Initiated Game should have score 0", function(t){
    let g = new Game()

    t.equal(g.Score, 0)
    t.end()
})

t.test("Initiated Game is not finished", function(t){
    let g = new Game()

    t.equal(g.IsFinished, false)
    t.end()
})

t.test("Game with score == 1000 is finished", function(t){
    let g = new Game()

    const word = "value100"
    g.sendInput(new GameInput(word, new Date())).then(() => {
        t.equal(g.IsFinished, true)
        t.end()
    })
})

t.test("Game with score > 1000 is finished", function(t){
    let g = new Game()

    const word = "value110"
    g.sendInput(new GameInput(word, new Date())).then(() => {
        t.equal(g.IsFinished, true)
        t.end()
    })
})

t.test("Sending a stopword should not change the score", function(t){
    let g = new Game()

    g.sendInput(new GameInput("i", new Date()))
    t.equal(g.Score, 0)
    t.end()
})

t.test("Sending a prepreocessed word should change the score", function(t){
    let g = new Game() 
    const frozenDate = new Date()

    const inputWordScore1 = 52
    const inputWordScore2 = 13

    g.sendInput(new GameInput("ograniczać", frozenDate))
    .then(() =>{
        t.equal(g.Score, inputWordScore1, "Ograniczać adds 52 points")})
    .then(() => {
        return g.sendInput(new GameInput("uroczy", frozenDate))})
    .then(()=>{
        t.equal(g.Score, inputWordScore1 + inputWordScore2, "Uroczy adds 13 points")
        t.end()
    })
})

t.test("Sending an uknown word should not change the score", function(t){
    let g = new Game() 
    const frozenDate = new Date()

    const previousScore = g.Score
    g.sendInput(new GameInput("foo", frozenDate))
    .then(() =>{
        t.equal(g.Score, previousScore, "Score did not change")})
    .then(()=>{
        t.end()
    })
})

t.test("Sending valued words and different timestamps should both affect the score", function(t){
    let g = new Game() 

    let previousScore = g.Score
    g.sendInput(new GameInput("radosny", new Date("2020-10-10T02:00:00")))
    .then(() =>{
        t.equal(g.Score - previousScore, 16, "Ograniczać adds 52 points")})
    .then(() => {
        previousScore = g.Score
        return g.sendInput(new GameInput("kłamać", new Date("2020-10-10T02:00:02")))})
    .then(()=>{
        const inputWordScore = 46
        const inputRapidityScore = 5
        const expectedScpore = previousScore + inputWordScore + inputRapidityScore
        t.equal(g.Score, expectedScpore, "Uroczy adds 13 points")
        t.end()
    })
})