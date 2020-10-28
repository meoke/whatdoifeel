require = require('esm')(module);
const t = require('tape');
const {GameState} = require('../src/js/gameState.js'); 

t.test("Init Game State", function(t){
    gs = new GameState()

    t.equal(gs.points, 0)
    t.equal(gs.words, [])
})



