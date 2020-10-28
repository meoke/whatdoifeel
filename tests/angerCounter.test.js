require = require('esm')(module);
const test = require('tape');
const suite = require('tape-suite')
const {readFile} = require('fs').promises;
const csv = require('fast-csv');
const {AngerCounter} = require('../src/js/angerCounter.js'); 

var runAllTestExamples = process.argv[3] == 'true'

suite('get Anger score', function(t){
    t.test('a stop word should score 0', function(t){
        readFile('data/stopwords_PL.txt', 'utf-8')
        .then((data) => {
            let stopwords = data.split(/\r\n|\n|\r/);
            stopwords = runAllTestExamples ? stopwords : stopwords.slice(0,5)
    
            const expectedScore = 0;

            const assertPromises = stopwords.map(word => {
                const scorePromise = AngerCounter.getScore(word)
                return scorePromise
                .then(score => {
                    t.equal(score, expectedScore)
                })
                
            })
            Promise.all(assertPromises).then(()=> {
                t.end()
            })
        })
        .catch((error) => {throw error});
    });


    t.test('a vulgar word stem should score 10', function(t){
        readFile('data/vulgarWords_stem_PL.txt', 'utf-8')
        .then((data) => {
            let vulgarwords = data.split(/\r\n|\n|\r/);
            vulgarwords = runAllTestExamples ? vulgarwords : vulgarwords.slice(0,5)
            
            const expectedScore = 10;

            const assertPromises = vulgarwords.map(word => {
                const scorePromise = AngerCounter.getScore(word)
                return scorePromise
                .then(score => {
                    t.equal(score, expectedScore)
                })
                
            })
            Promise.all(assertPromises).then(()=> {
                t.end()
            })
        })
        .catch((error) => {throw error});
    })

    t.test('an emotional word stem should score as specified in emotionalWords.csv', function(t){
        let csvLines = [];
        csv.parseFile("data/emotionalWords.csv", { headers: true })
            .on('error', error => reject(error))
            .on('data', data => {csvLines.push(data)})
            .on('end', () => {
                csvLines = runAllTestExamples ? csvLines : csvLines.slice(0,5)
                const assertPromises = csvLines.map(csvLine => {
                                    const scorePromise = AngerCounter.getScore(csvLine.word)
                                    return scorePromise
                                    .then(score => {
                                        t.equal(String(score), csvLine.meanAnger)
                                })  
                })
                Promise.all(assertPromises).then(()=> {
                    t.end()
                })
            });
    })
});