// eslint-disable-next-line no-global-assign
require = require("esm")(module)
const t = require('tape-catch')
const wordsProvider = require('../src/js/specialWordsProvider')

t.test("Reader returns correct list of stopWords", function(t){
    const first10StopWords = ['a',
    'aby',
    'ach',
    'acz',
    'aczkolwiek',
    'aj',
    'albo',
    'ale',
    'alez',
    'ależ']

    const stopWordsCount = 350;
    wordsProvider.getStopWords().then(actualStopWords => {
        t.equal(actualStopWords.length, stopWordsCount, 'Correct words count')
        first10StopWords.forEach((expectedStopWord, idx) => {
            t.equal(actualStopWords[idx].word, expectedStopWord, `Expected: ${expectedStopWord}`)
        })
    
        t.end()
    }).catch(error => {
        t.fail("Unexpected failure when reading stopwords: " + JSON.stringify(error))
    })
})

t.test("Reader returns correct list of vulgarWords", function(t){
    const first10VulgarWords = ['chuj',
                                'chuja',
                                'chujek',
                                'chuju',
                                'chujem',
                                'chujnia',
                                'chujowy',
                                'chujowa',
                                'chujowe',
                                'cipa']

    const vulgarWordsCount = 624;

    wordsProvider.getVulgarWords().then(actualVulgarWords => {
        t.equal(actualVulgarWords.length, vulgarWordsCount, 'Correct words count')
        first10VulgarWords.forEach((expectedVulgarWord, idx) => {
            t.equal(actualVulgarWords[idx].word, expectedVulgarWord, `Expected: ${expectedVulgarWord}`)
        })
    
        t.end()
    }).catch(error => {
        t.fail("Unexpected failure when reading stopwords: " + JSON.stringify(error))
    })
})

t.test("Reader returns correct list of preevaluated words and their values", function(t){
    const first10PredefinedWords = [
        ['value100', 100],
        ['value110', 110],
        ['rozkoszny', 1.4074074],
        ['świetny', 1.3703704],
        ['przyjaciel', 1.4444444],
        ['uśmiech', 1.074074],
        ['pochwała', 1.5185186],
        ['winogrono', 1.1851852],
        ['tańczyć', 1.2592592],
        ['ładny', 1.5555556],
        ['pomysł', 1.3333334],
        ['skowronek', 1.2222222]]

    const preevaluatedWordsCount = 2904;

    wordsProvider.getPreevaluatedWords().then(actuaPreevaluatedWords => {
        t.equal(actuaPreevaluatedWords.length, preevaluatedWordsCount, 'Correct words count')
        first10PredefinedWords.forEach(([expectedWord, expectedValue], idx) => {
            t.equal(actuaPreevaluatedWords[idx].word, expectedWord, `Expected: ${expectedWord}`)
            t.equal(actuaPreevaluatedWords[idx].value, expectedValue, `Correct value`)
        })
    
        t.end()
    }).catch(error => {
        t.fail("Unexpected failure when reading stopwords: " + JSON.stringify(error))
    })
})