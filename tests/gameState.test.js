require = require('esm')(module);
const t = require('tape');
const {GameState} = require('../src/js/gameState.js'); 

t.test("Init Game State", function(t){
    gs = new GameState()

    t.equal(gs.points, 0, "Points equal 0")
    t.equal(gs.inputs.length, 0, "Game inputs list is empty.")
    t.end()
})

t.test("Add points should change Game State", function(t){
    gs = new GameState()

    gs.addPoints(10)
    t.equal(gs.points, 10, "Add 10")
    t.end()
})

t.test("Add points should not accept type other than number", function(t){
    gs = new GameState()

    t.throws(() => gs.addPoints("TEST"), "GameState/AddPoints expects numbers only.")
    t.end()
})


t.test("Add input should not accept type other than GameInput", function(t){
    gs = new GameState()

    t.throws(() => gs.addInput(0),"GameState/AddInput expects GameInput type.")
    t.end()
})





