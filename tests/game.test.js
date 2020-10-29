require = require('esm')(module);
const t = require('tape');
const {GameState} = require('../src/js/gameState.js'); 
const {Game} = require('../src/js/game.js'); 

t.test("Initiated Game should have score 0", function(t){
    gs = new Game()

    t.equal(gs.Score, 0)
    t.end()
})
    
    




