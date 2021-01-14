// eslint-disable-next-line no-global-assign
require = require("esm")(module);
const t = require('tape-catch');
const { RatedWordsReference, RatedWordEntry } = require("../src/js/models/RatedWordsReference");
const { Emotion, WordType } = require("../src/js/models/EmotionalState");
const { RatedWord, getStopWords, getNAWLWords, getVulgarWords, getRosenbergWords } = require('../src/js/models/RatedWordsProvider.js');

t.test("RatedWordsReference construct entries without duplicates and with correct strength. Order of importance: Rosenber, NAWL, vulgar, stopword.", function (t) {
    const stopWords = [new RatedWord("a", Emotion.UNKNOWN, WordType.STOPWORD), 
                       new RatedWord("b", Emotion.UNKNOWN, WordType.STOPWORD)];
    const vulgarWords = [];
    const nawlWords = [new RatedWord("a", Emotion.HAPPY, WordType.NAWL, 0, 0, 1.7, 0, 0), 
                       new RatedWord("b", Emotion.Anger, WordType.NAWL, 1.5, 0, 0, 0, 0), 
                       new RatedWord("c", Emotion.Anger, WordType.NAWL, 4.5, 0, 0, 0, 0)];
    const rosenbergWords = [new RatedWord("a", Emotion.FEAR, WordType.ROSENBERG), 
                            new RatedWord("uniq", Emotion.DISGUST, WordType.ROSENBERG), 
                            new RatedWord("c", Emotion.DISGUST, WordType.ROSENBERG)];

    const expectedRatedWordEntries = [
        new RatedWordEntry("c", Emotion.DISGUST, WordType.ROSENBERG, 6),
        new RatedWordEntry("uniq", Emotion.DISGUST, WordType.ROSENBERG, 6),
        new RatedWordEntry("a", Emotion.FEAR, WordType.ROSENBERG, 6),
        new RatedWordEntry("b", Emotion.Anger, WordType.NAWL, 1.5)
    ];

    const actualReference = new RatedWordsReference(stopWords, vulgarWords, nawlWords, rosenbergWords);

    t.deepEquals(actualReference.entries, expectedRatedWordEntries);

    t.end();
});


t.test("getEmoElement correctly recognizes given word emotion and type", function (t) {
    const testCases = [
        { "word": "i", "type": WordType.STOPWORD, "emotion": Emotion.NEUTRAL },
        { "word": "Zezować", "type": WordType.NAWL, "emotion": Emotion.DISGUST },
        { "word": "dYSkomfort", "type": WordType.ROSENBERG, "emotion": Emotion.FEAR },
        { "word": "jebać", "type": WordType.VULGAR, "emotion": Emotion.NEUTRAL },
        { "word": "foo", "type": WordType.UNKNOWN, "emotion": Emotion.NEUTRAL },
        { "word": "posiłek", "type": WordType.NAWL, "emotion": Emotion.HAPPY },
        { "word": "pożegnanie", "type": WordType.NAWL, "emotion": Emotion.SADNESS }
    ];
    _buildRatedWordsReference().then(wordsRef => {
        for (const tc of testCases) {
            const actualEmotionalCharge = wordsRef.getEmotionalCharge(tc.word);
            t.equal(actualEmotionalCharge.word, tc.word, `Word ${tc.word}`);
            t.equal(actualEmotionalCharge.emotion, tc.emotion, `Emotion of ${tc.word}`);
            t.equal(actualEmotionalCharge.wordType, tc.type, `Type of ${tc.word}`);
        }
        t.end();
    });

});

t.test("_findExactMatch finds exact match", function (t) {
    _buildRatedWordsReference().then(wordsRef => {
        const testCases = [
            { "word": "jeż", "expectedEntry": new RatedWordEntry("jeż", Emotion.HAPPY, WordType.NAWL, 4.076923) },
            { "word": "jeżeli", "expectedEntry": new RatedWordEntry("jeżeli", Emotion.NEUTRAL, WordType.STOPWORD, 1) }
        ];

        for (const tc of testCases) {
            const actualEntry = wordsRef._findExactMatch(tc.word);
            t.deepEquals(actualEntry, tc.expectedEntry);
        }

        t.end();
    });
});

t.test("RatedWordsReference/_findExactMatch finds stem match in default EmoReference", function (t) {
    _buildRatedWordsReference().then(wordsRef => {
        const testCases = [
            { "stem": "świetn", "expectedEntry": new RatedWordEntry("świetny", Emotion.HAPPY, WordType.NAWL, 5.6666665) },
        ];

        for (const tc of testCases) {
            const actualEntry = wordsRef._findStemMatch(tc.stem);
            t.deepEquals(actualEntry, tc.expectedEntry);
        }

        t.end();
    });
});

t.test("RatedWordsReference/_getRatedWordStrength gets max value from given mean emotion values of RatedWord", function (t) {
    _buildRatedWordsReference().then(wordsRef => {

        const testCases = [
            { rw: new RatedWord("foo", Emotion.HAPPY, WordType.NAWL, 0, 0, 0, 2.5, 0), expectedStrength: 2.5 },
            { rw: new RatedWord("foo2", Emotion.HAPPY, WordType.NAWL, 0, 0, 0, 0, 0), expectedStrength: 0 },
            { rw: new RatedWord("foo3", Emotion.HAPPY, WordType.NAWL, 1.3, 1.3, 0, 0, 0), expectedStrength: 1.3 }
        ];

        for (const tc of testCases) {
            const actualStrength = wordsRef._getRatedWordStrength(tc.rw);
            t.deepEquals(actualStrength, tc.expectedStrength);
        }

        t.end();
    });
});

async function _buildRatedWordsReference() {
    const stopwords = getStopWords();
    const vulgarwords = getVulgarWords();
    const nawlWords = getNAWLWords();
    const rosenbergWords = getRosenbergWords();
    return Promise.all([stopwords, vulgarwords, nawlWords, rosenbergWords]).then(words => {
        return new RatedWordsReference(words[0], words[1], words[2], words[3]);
    });
}
