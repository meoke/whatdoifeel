// eslint-disable-next-line no-global-assign
require = require("esm")(module)
const t = require('tape-catch')

const wordsProvider = require('../src/js/specialWordsProvider.js')
const {AngerCounter} = require('../src/js/angerCounter.js')
const {GameInput} = require('../src/js/gameInput')
const {GameState} = require('../src/js/gameState.js')

async function getAngerCounter() {
    const stopwords = wordsProvider.getStopWords()
    const vulgarwords = wordsProvider.getVulgarWords()
    const preevaluatedWords = wordsProvider.getPreevaluatedWords()
    return Promise.all([stopwords, vulgarwords, preevaluatedWords]).then(values => {
        return new AngerCounter(values[0], values[1], values[2])
    })
}

t.test('AngerCounter/getLastInputScore should return 0 for a stopword', function(t){
    const gs = new GameState()
    const exampleStopwords = ['i', 'lecz', 'czy']
    
    getAngerCounter().then(ac => {
        const expectedScore = 0

        for(let stopword of exampleStopwords) {
            gs.inputs = [new GameInput(stopword, new Date())]
            const actualScore = ac.getLastInputScore(gs)
            t.equal(actualScore, expectedScore, `word: ${stopword}`)
        }
        t.end()
    })
})

t.test('AngerCounter/getLastInputScore should return 10 for a vulgar word', function(t){
    const gs = new GameState()
    const exampleVulgarwords = ['kurwa', 'chuj', 'chuja']
    
    getAngerCounter().then(ac => {
        const expectedScore = 10

        for(let vulgarWord of exampleVulgarwords) {
            gs.inputs = [new GameInput(vulgarWord, new Date())]
            const actualScore = ac.getLastInputScore(gs)
            t.equal(actualScore, expectedScore, `word: ${vulgarWord}`)
        }
        t.end()
    })
})

t.test('AngerCounter/getLastInputScore should return correct value for a preevaluated word', function(t){
    const gs = new GameState()
    const exampleWordValuePairs = [['ograniczać', 52], ['uroczy', 13]]
    
    getAngerCounter().then(ac => {
        
        for(let wordValuePair of exampleWordValuePairs) {
            gs.inputs = [new GameInput(wordValuePair[0], new Date())]
            const expectedScore = wordValuePair[1]
            const actualScore = ac.getLastInputScore(gs)
            t.equal(actualScore, expectedScore, `word: ${wordValuePair}`)
        }
        t.end()
    })
})

t.test('AngerCounter/getLastInputScore should return 0 for an unknown or empty word', function(t){
    const gs = new GameState()
    const exampleUnknownwords = ['foo', '']
    
    getAngerCounter().then(ac => {
        const expectedScore = 0

        for(let unknownWord of exampleUnknownwords) {
            gs.inputs = [new GameInput(unknownWord, new Date())]
            const actualScore = ac.getLastInputScore(gs)
            t.equal(actualScore, expectedScore, `word: ${unknownWord}`)
        }
        t.end()
    })
})
