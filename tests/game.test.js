require = require('esm')(module);
const t = require('tape');
const suite = require('tape-suite')
const {GameState} = require('../src/js/gameState.js'); 
const {Game} = require('../src/js/game.js'); 

suite("Game tests", function(){
    t.test("Init Game should have score 0", function(t){
        gs = new Game()
    
        t.equal(gs.Score, 0)
        t.end()
    })
    
    
})




