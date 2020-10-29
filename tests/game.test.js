require = require('esm')(module);
const t = require('tape');
const {GameInput} = require('../src/js/gameInput.js'); 
const {Game} = require('../src/js/game.js'); 

t.test("Initiated Game should have score 0", function(t){
    gs = new Game()

    t.equal(gs.Score, 0)
    t.end()
})

t.test("Initiated Game is not finished", function(t){
    gs = new Game()

    t.equal(gs.IsFinished, false)
    t.end()
})

t.test("Sending a stopword should not change the score", function(t){
    gs = new Game()

    gs.sendInput(new GameInput("i", new Date()))
    t.equal(gs.Score, 0)
    t.end()
})