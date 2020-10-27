require = require('esm')(module);
const test = require('tape');
const suite = require('tape-suite')
const {readFile} = require('fs').promises;
const csv = require('fast-csv');
const {AngerCounter} = require('../src/js/angerCounter.js'); 

suite('get Anger score', function(t){
    t.test('a stop word should score 0', function(t){
        readFile('data/stopwords_PL.txt', 'utf-8')
        .then((data) => {
            const stopwords = data.split(/\r\n|\n|\r/);
            const expectedScore = 0;

            const xs = stopwords.slice(0,5).map(word => {
                const scorePromise = AngerCounter.getScore(word)
                return scorePromise
                .then(score => {
                    t.equal(score, expectedScore)
                })
                
            })
            Promise.all(xs).then(()=> {
                t.end()
            })


        })
        .catch((error) => {throw error});

    });

    // t.test('a vulgar word stem should score 10', function(t){
    //     readFile('data/vulgarWords_stem_PL.txt', 'utf-8')
    //     .then((data) => {
    //         const stopwords = data.split(/\r\n|\n|\r/);
    //         const expectedScore = 10;

    //         for(let vulgarWordStem of stopwords.splice(0,10)){
    //             t.equal(await AngerCounter.getScore(vulgarWordStem), expectedScore)
    //         }
    //     })
    //     .catch((error) => {throw error});

    //     t.end();
    // })

    // t.test('an emotional word stem should score as specified in emotionalWords.csv', function(t){
    //     readFile('data/emotionalWords_stem_PL.txt', 'utf-8')
    //     .then((data) => {
    //         const stopwords = data.split(/\r\n|\n|\r/);
    //         const expectedScore = 10;

    //         for(let vulgarWordStem of stopwords){
    //             t.equal(AngerCounter.getScore(vulgarWordStem), expectedScore)
    //         }
    //     })
    //     .catch((error) => {throw error});

    //     t.end();
    // })
});