require = require('esm')(module);
const t = require('tape');
const {readFile} = require('fs').promises;
const csv = require('fast-csv');
const {AngerCounter} = require('../src/js/angerCounter.js'); 
const {GameInput} = require('../src/js/gameInput')

var runAllTestExamples = process.argv[3] == 'true'



t.test('a stop word should score 0', function(t){
    readFile('data/stopwords_PL.txt', 'utf-8')
    .then((data) => {
        let ac = new AngerCounter()
        let stopwords = data.split(/\r\n|\n|\r/);
        stopwords = runAllTestExamples ? stopwords : stopwords.slice(0,10)

        const expectedScore = 0;

        const assertPromises = stopwords.map(word => {
            const scorePromise = ac.updateScore(new GameInput(word))
            return scorePromise
            .then(score => {
                t.equal(score, expectedScore, `word: ${word}`)
            })
            
        })
        Promise.all(assertPromises).then(()=> {
            t.end()
        })
    })
    .catch((error) => {throw error});
});

t.test('a vulgar word stem should score 10', function(t){
    readFile('data/vulgarWords_PL.txt', 'utf-8')
    .then((data) => {
        let ac = new AngerCounter()
        let vulgarwords = data.split(/\r\n|\n|\r/);
        vulgarwords = runAllTestExamples ? vulgarwords : vulgarwords.slice(0,10)
        
        const expectedScore = 10;

        const assertPromises = vulgarwords.map(word => {
            const scorePromise = ac.updateScore(new GameInput(word))
            return scorePromise
            .then(score => {
                t.equal(score, expectedScore, `word: ${word}`)
            })
        })
        Promise.all(assertPromises).then(()=> {
            t.end()
        })
    })
    .catch((error) => {throw error});
})

t.test('an emotional word stem should score as specified in emotionalWords.csv', function(t){
    let ac = new AngerCounter()
    let csvLines = [];
    csv.parseFile("data/emotionalWords.csv", { headers: true })
        .on('error', error => reject(error))
        .on('data', data => {csvLines.push(data)})
        .on('end', () => {
            csvLines = runAllTestExamples ? csvLines : csvLines.slice(0,10)
            const assertPromises = csvLines.map(csvLine => {
                                const scorePromise = ac.updateScore(new GameInput(csvLine.word))
                                return scorePromise
                                .then(score => {
                                    const pies = (f) => {
                                        return Math.round(parseFloat(f) * 10)
                                    }
                                    t.equal(score, pies(csvLine.meanAnger), `word: ${csvLine.word}`)
                            })  
            })
            Promise.all(assertPromises).then(()=> {
                t.end()
            })
        });
})

t.test('unknown word should return score 0', function(t){
    let ac = new AngerCounter()
    const unknownWord = "foo"
    const expectedScore = 0
    ac.updateScore(new GameInput(unknownWord)).then(
        actualScore => {
            t.equal(actualScore, expectedScore, `word: ${unknownWord}`)
            t.end()
        }
    )
})

