// import t from 'tape'
require = require("esm")(module)
const t = require('tape')
const {WordType, WordsReader} = require('../src/js/wordsReader')

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

    const wordsReader = new WordsReader();
    wordsReader.getStopWords().then(actualStopWords => {
        t.equal(actualStopWords.length, stopWordsCount, 'Correct words count')
        first10StopWords.forEach((expectedStopWord, idx) => {
            t.equal(actualStopWords[idx].word, expectedStopWord, `Expected: ${expectedStopWord}`)
            t.equal(actualStopWords[idx].type, WordType.stopWord, `Is type StopWord`)
        })
    
        t.end()
    })    
})