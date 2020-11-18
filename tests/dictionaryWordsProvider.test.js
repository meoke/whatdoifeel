// eslint-disable-next-line no-global-assign
require = require("esm")(module)
const t = require('tape-catch')
const {EmoHue} = require("../src/js/models/EmoElement")
const wordsProvider = require('../src/js/models/DictionaryWordsProvider')

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
        t.fail("Unexpected failure when reading vulgarwords: " + JSON.stringify(error))
    })
})

t.test("Reader returns correct list of NAWL words and their values", function(t){
    const exampleNAWLWords = {
        0: ['rozkoszny', EmoHue.Happy],
        194: ['absurd', EmoHue.Anger],
        261: ['pokutny', EmoHue.Sadness],
        326: ['kopalnia', EmoHue.Fear],
        492: ['obwisły', EmoHue.Disgust],
        537: ['miotła', EmoHue.Neutral],
        762: ['świnia', EmoHue.Disgust]
    }

    const NAWLWordsCount = 2902;

    wordsProvider.getNAWLWords().then(actualNAWLWords => {
        t.equal(actualNAWLWords.length, NAWLWordsCount, 'Correct words count')

        for(const [idx, [expectedWord, expectedEmoHue]] of Object.entries(exampleNAWLWords)) {
            t.equal(actualNAWLWords[idx].word, expectedWord, `Expected: ${expectedWord}`)
            t.equal(actualNAWLWords[idx].hue, expectedEmoHue, `Correct hue`)
        }
    
        t.end()
    }).catch(error => {
        t.fail("Unexpected failure when reading NAWL words: " + JSON.stringify(error))
    })
})

t.test("DictionaryWords provider parses NAWL row to DictionaryRow value", function(t) {
    const row = {"word": "rozkoszny", 
                "category": "H",
                "meanHappiness": "5.296296", 
                "meanAnger": "1.4074074", 
                "meanSadness": "1.4814814", 
                "meanFear": "1.5555556", 
                "meanDisgust": "1.3703704"}

    const expectedParsedValue = ["rozkoszny", EmoHue.Happy, 1.4074074, 1.3703704, 1.5555556, 5.296296, 1.4814814]
    const actualParsedValue = wordsProvider.testAPI._parseNAWLRow(row)

    t.deepEquals(actualParsedValue, expectedParsedValue)
    t.end()
})

t.test("Reader returns correct list of Rosenberg words and their hues", function(t){
    const exampleRosenbergWords = {
        0: ['werwa', EmoHue.Happy],
        86: ['spłoszona', EmoHue.Fear]
    }

    const rosenbergWordsCount = 143;

    wordsProvider.getRosenbergWords().then(actualRosenbergWords => {
        t.equal(actualRosenbergWords.length, rosenbergWordsCount, 'Correct words count')

        for(const [idx, [expectedWord, expectedEmoHue]] of Object.entries(exampleRosenbergWords)) {
            t.equal(actualRosenbergWords[idx].word, expectedWord, `Expected: ${expectedWord}`)
            t.equal(actualRosenbergWords[idx].hue, expectedEmoHue, `Correct hue`)
        }
    
        t.end()
    }).catch(error => {
        t.fail("Unexpected failure when reading Rosenberg words: " + JSON.stringify(error))
    })
})

t.test("DictionaryWords provider parses Rosenberg row to DictionaryRow value", function(t) {
    const row = {"word": "apatyczny", 
                 "hue": "S"
                }

    const expectedParsedValue = ["apatyczny", EmoHue.Sadness]
    const actualParsedValue = wordsProvider.testAPI._parseRosenbergRow(row)

    t.deepEquals(actualParsedValue, expectedParsedValue)
    t.end()
})
