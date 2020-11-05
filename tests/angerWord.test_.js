import t from 'tape'
import {AngerWord, WordType} from '../src/js/angerCounter.js'

t.test("AngerWord of type vulgar equals 10", function(t){
    const aw = new AngerWord("blah", WordType.vulgar)
    t.equal(aw.meanAnger, 10)
    t.end()
})

t.test("AngerWord of type stopword equals 0", function(t){
    const aw = new AngerWord("blah", WordType.stopword)
    t.equal(aw.meanAnger, 0)
    t.end()
})

t.test("AngerWord of type preevaluated equals given angerValue", function(t){
    const aw = new AngerWord("blah", WordType.preevaluated, "2.32")
    t.equal(aw.meanAnger, 23)
    t.end()
})