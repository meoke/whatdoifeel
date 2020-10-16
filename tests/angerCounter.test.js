require = require('esm')(module);
const test = require('tape');
const suite = require('tape-suite')
const {getScore} = require('../src/js/angerCounter.js'); 

suite('get Anger score', function(t){
    t.test('stopword should score 0', function(t){
        t.plan(1);
        var expected = 0;

        var actual = getScore('i');
        t.equal(actual, expected);
    })
}
);