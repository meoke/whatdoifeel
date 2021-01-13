// eslint-disable-next-line no-global-assign
require = require("esm")(module);
const t = require('tape-catch');
const { Emotion, WordType } = require("../src/js/models/EmotionalState");
const {getStopWords, getNAWLWords, getRosenbergWords, getVulgarWords, RatedWord, testAPI} = require('../src/js/models/RatedWordsProvider');

t.test("Return correct list of stopWords", function (t) {
    const expectedStopWordsCount = 350;
    const expectedEmotion = Emotion.NEUTRAL;
    const expectedFirst10StopWords = ['a',
        'aby',
        'ach',
        'acz',
        'aczkolwiek',
        'aj',
        'albo',
        'ale',
        'alez',
        'ależ'];

    getStopWords().then(actualStopWords => {
        t.equal(actualStopWords.length, expectedStopWordsCount, 'Correct words count');
        expectedFirst10StopWords.forEach((expectedStopWord, idx) => {
            t.equal(actualStopWords[idx].word, expectedStopWord, `Expected: ${expectedStopWord}`);
            t.equal(actualStopWords[idx].emotion, expectedEmotion, `Expected Neutral Emotion`);
        });
        t.end();
    }).catch(error => {
        t.fail("Unexpected failure when reading stopwords: " + JSON.stringify(error));
    });
});

t.test("Return correct list of vulgarWords", function (t) {
    const expectedVulgarWordsCount = 624;
    const expectedEmotion = Emotion.NEUTRAL;
    const expectedFirst10VulgarWords = ['chuj',
        'chuja',
        'chujek',
        'chuju',
        'chujem',
        'chujnia',
        'chujowy',
        'chujowa',
        'chujowe',
        'cipa'];

    getVulgarWords().then(actualVulgarWords => {
        t.equal(actualVulgarWords.length, expectedVulgarWordsCount, 'Correct words count');
        expectedFirst10VulgarWords.forEach((expectedVulgarWord, idx) => {
            t.equal(actualVulgarWords[idx].word, expectedVulgarWord, `Expected: ${expectedVulgarWord}`);
            t.equal(actualVulgarWords[idx].emotion, expectedEmotion, `Expected neutral emotion`);
        });

        t.end();
    }).catch(error => {
        t.fail("Unexpected failure when reading vulgarwords: " + JSON.stringify(error));
    });
});

t.test("Return correct list of NAWL words and their emotion mean ratings.", function (t) {
    const expectedNAWLWordsCount = 2901;
    const exampleExpectedNAWLWords = {
        0: ['rozkoszny', Emotion.HAPPY],
        194: ['absurd', Emotion.ANGER],
        261: ['pokutny', Emotion.SADNESS],
        325: ['kopalnia', Emotion.FEAR],
        491: ['obwisły', Emotion.DISGUST],
        536: ['miotła', Emotion.NEUTRAL],
        761: ['świnia', Emotion.DISGUST]
    };

    getNAWLWords().then(actualNAWLWords => {
        t.equal(actualNAWLWords.length, expectedNAWLWordsCount, 'Correct words count');

        for (const [idx, [expectedWord, expectedEmotion]] of Object.entries(exampleExpectedNAWLWords)) {
            t.equal(actualNAWLWords[idx].word, expectedWord, `Expected: ${expectedWord}`);
            t.equal(actualNAWLWords[idx].emotion, expectedEmotion, `Correct emotion: ${expectedEmotion}`);
        }

        t.end();
    }).catch(error => {
        t.fail("Unexpected failure when reading NAWL words: " + error);
    });
});

t.test("Parse NAWL row", function (t) {
    const row = {
        "word": "rozkoszny",
        "category": "H",
        "meanHappiness": "5.296296",
        "meanAnger": "1.4074074",
        "meanSadness": "1.4814814",
        "meanFear": "1.5555556",
        "meanDisgust": "1.3703704"
    };

    const expectedRatedWord = new RatedWord("rozkoszny", Emotion.HAPPY, WordType.NAWL, 1.4074074, 1.3703704, 1.5555556, 5.296296, 1.4814814);
    const actualRatedWord = testAPI.nawlRowToRatedWord(row);

    t.deepEquals(actualRatedWord, expectedRatedWord);
    t.end();
});

t.test("Return correct list of Rosenberg words and their emotions", function (t) {
    const expectedRosenbergWordsCount = 143;
    const exampleRosenbergWords = {
        0: ['werwa', Emotion.HAPPY],
        86: ['spłoszona', Emotion.FEAR]
    };

    getRosenbergWords().then(actualRosenbergWords => {
        t.equal(actualRosenbergWords.length, expectedRosenbergWordsCount, 'Correct words count');

        for (const [idx, [expectedWord, expectedEmotion]] of Object.entries(exampleRosenbergWords)) {
            t.equal(actualRosenbergWords[idx].word, expectedWord, `Expected: ${expectedWord}`);
            t.equal(actualRosenbergWords[idx].emotion, expectedEmotion, `Correct emotion`);
        }

        t.end();
    }).catch(error => {
        t.fail("Unexpected failure when reading Rosenberg words: " + JSON.stringify(error));
    });
});

t.test("Parse Rosenberg row", function (t) {
    const row = {
        "word": "apatyczny",
        "hue": "S"
    };

    const expectedRatedWord = new RatedWord("apatyczny", Emotion.SADNESS, WordType.ROSENBERG);
    const actualRatedWord = testAPI.rosenbergRowToRatedWord(row);

    t.deepEquals(actualRatedWord, expectedRatedWord);
    t.end();
});
