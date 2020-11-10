// eslint-disable-next-line no-global-assign
require = require("esm")(module)
const t = require('tape-catch')

const {AngerWord, WordType} = require('../src/js/models/AngerCounter.js')

t.test("AngerWord for a stopword has correct stem and value", function(t){
    const aw = new AngerWord("już", WordType.stopword, 0)
    t.equal(aw.word, "już")
    t.equal(aw.stem, "już")
    t.equal(aw.type, WordType.stopword)
    t.equal(aw.angerValue, 0)
    t.end()
})

t.test("AngerWord for a vulgar has correct stem and value", function(t){
    const aw = new AngerWord("kurwy", WordType.vulgar, 10)
    t.equal(aw.word, "kurwy")
    t.equal(aw.stem, "kurw")
    t.equal(aw.type, WordType.vulgar)
    t.equal(aw.angerValue, 10)
    t.end()
})

t.test("AngerWord for a preevaluated word has correct stem and value", function(t){
    const aw = new AngerWord("świetny", WordType.preevaluated, 0)
    t.equal(aw.word, "świetny")
    t.equal(aw.stem, "świetn")
    t.equal(aw.type, WordType.preevaluated)
    t.equal(aw.angerValue, 0)
    t.end()
})
