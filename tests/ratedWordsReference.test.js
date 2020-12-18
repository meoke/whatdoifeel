// eslint-disable-next-line no-global-assign
require = require("esm")(module)
const t = require('tape-catch')
const { RatedWordsReference, RatedWordEntry } = require("../src/js/models/RatedWordsReference")
const { Emotions, WordTypes } = require("../src/js/models/EmotionalState")
const {RatedWord, getStopWords, getNAWLWords, getVulgarWords, getRosenbergWords} = require('../src/js/models/RatedWordsProvider.js')

t.test("RatedWordsReference construct entries without duplicates. Order of importance: Rosenber, NAWL, vulgar, stopword.", function (t) {
    const stopWords = [new RatedWord("a", Emotions.unknown, WordTypes.stopword), new RatedWord("b", Emotions.unknown, WordTypes.stopword)]
    const vulgarWords = []
    const nawlWords = [new RatedWord("a", Emotions.Happy, WordTypes.nawl), new RatedWord("b", Emotions.Anger, WordTypes.nawl), new RatedWord("c", Emotions.Anger, WordTypes.nawl)]
    const rosenbergWords = [new RatedWord("a", Emotions.Fear, WordTypes.rosenberg), new RatedWord("uniq", Emotions.Disgust, WordTypes.rosenberg), new RatedWord("c", Emotions.Disgust, WordTypes.rosenberg)]

    const expectedRatedWordEntries = [
        new RatedWordEntry("c", Emotions.Disgust, WordTypes.rosenberg),
        new RatedWordEntry("uniq", Emotions.Disgust, WordTypes.rosenberg),
        new RatedWordEntry("a", Emotions.Fear, WordTypes.rosenberg),
        new RatedWordEntry("b", Emotions.Anger, WordTypes.nawl)
    ]

    const actualReference = new RatedWordsReference(stopWords, vulgarWords, nawlWords, rosenbergWords)

    t.deepEquals(actualReference.entries, expectedRatedWordEntries)

    t.end()
})


t.test("getEmoElement correctly recognizes given word emotion and type", function (t) {
    const testCases = [
        { "word": "i", "type": WordTypes.stopword, "emotion": Emotions.Neutral },
        { "word": "Zezować", "type": WordTypes.nawl, "emotion": Emotions.Disgust },
        { "word": "dYSkomfort", "type": WordTypes.rosenberg, "emotion": Emotions.Fear },
        { "word": "jebać", "type": WordTypes.vulgar, "emotion": Emotions.Neutral },
        { "word": "foo", "type": WordTypes.unknown, "emotion": Emotions.Neutral },
        { "word": "posiłek", "type": WordTypes.nawl, "emotion": Emotions.Happy },
        { "word": "pożegnanie", "type": WordTypes.nawl, "emotion": Emotions.Sadness }
    ]
    _buildRatedWordsReference().then(wordsRef => {
        for (const tc of testCases) {
            const actualEmotionalCharge = wordsRef.getEmotionalCharge(tc.word)
            t.equal(actualEmotionalCharge.word, tc.word, `Word ${tc.word}`)
            t.equal(actualEmotionalCharge.emotion, tc.emotion, `Emotion of ${tc.word}`)
            t.equal(actualEmotionalCharge.wordType, tc.type, `Type of ${tc.word}`)
        }
        t.end()
    })

})

t.test("_findExactMatch finds exact match", function (t) {
    _buildRatedWordsReference().then(wordsRef => {
        const testCases = [
            {"word": "jeż", "expectedEntry": new RatedWordEntry("jeż", Emotions.Happy, WordTypes.nawl)},
            {"word": "jeżeli", "expectedEntry": new RatedWordEntry("jeżeli", Emotions.Neutral, WordTypes.stopword)}
        ]

        for(const tc of testCases) {
            const actualEntry = wordsRef._findExactMatch(tc.word)
            t.deepEquals(actualEntry, tc.expectedEntry)
        }

        t.end()
    })
})

t.test("EmoReference/_findExactMatch finds stem match in default EmoReference", function (t) {
    _buildRatedWordsReference().then(wordsRef => {
        const testCases = [
            {"stem": "świetn", "expectedEntry": new RatedWordEntry("świetny", Emotions.Happy, WordTypes.nawl)},
        ]

        for(const tc of testCases) {
            const actualEntry = wordsRef._findStemMatch(tc.stem)
            t.deepEquals(actualEntry, tc.expectedEntry)
        }

        t.end()
    })
})

async function _buildRatedWordsReference() {
    const stopwords = getStopWords()
    const vulgarwords = getVulgarWords()
    const nawlWords = getNAWLWords()
    const rosenbergWords = getRosenbergWords()
    return Promise.all([stopwords, vulgarwords, nawlWords, rosenbergWords]).then(words => {
        return new RatedWordsReference(words[0], words[1], words[2], words[3])
    })
}
