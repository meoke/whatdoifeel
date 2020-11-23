// eslint-disable-next-line no-global-assign
require = require("esm")(module)
const t = require('tape-catch')
const { DictionaryWord } = require("../src/js/models/DictionaryWord")
const { EmoHue, EmoWordType } = require("../src/js/models/EmoElement")
const { EmoReference, testAPI } = require("../src/js/models/EmoReference")
const wordsProvider = require('../src/js/models/DictionaryWordsProvider.js')

t.test("EmoReference/_buildEmoStems builds EmoStems with correct wordtype", function (t) {
    const inputDictWords = [new DictionaryWord("foo", EmoHue.Sadness, 1, 2, 3, 4, 5),
    new DictionaryWord("lubimy", EmoHue.Anger, 5, 4, 3, 2, 1)
    ]
    const expectedEmoStem1 = {
        "originalWord": "foo",
        "stem": "foo",
        "hue": EmoHue.Sadness,
        "type": EmoWordType.nawl
    }
    const expectedEmoStem2 = {
        "originalWord": "lubimy",
        "stem": "lubim",
        "hue": EmoHue.Anger,
        "type": EmoWordType.nawl
    }

    const emoStems = EmoReference._buildEmoStems(inputDictWords, EmoWordType.nawl)

    t.deepEquals(Object.entries(emoStems[0]), Object.entries(expectedEmoStem1))
    t.deepEquals(Object.entries(emoStems[1]), Object.entries(expectedEmoStem2))
    t.end()
})

t.test("EmoReference/_joinEmoStems joins into flat array all given elements if no repetition occurs", function (t) {
    const notJoined = [[new testAPI.EmoStem("foo", EmoHue.Anger, EmoWordType.rosenberg)],
                     [new testAPI.EmoStem("foo2", EmoHue.Happy, EmoWordType.vulgar)]]

    const expectedJoined = [new testAPI.EmoStem("foo", EmoHue.Anger, EmoWordType.rosenberg),
                            new testAPI.EmoStem("foo2", EmoHue.Happy, EmoWordType.vulgar)]

    const actualJoined = EmoReference._joinEmoStems(notJoined, EmoReference._getMostImportantFrom)
    t.deepEquals(actualJoined, expectedJoined)
    t.end()
})

t.test("EmoReference/_joinEmoStems joins into flat array without repeated words. Order of importance: Rosenber, NAWL, vulgar, stopword.", function (t) {
    const notJoined = [[new testAPI.EmoStem("01_rosenberg_vulgar", EmoHue.Anger, EmoWordType.rosenberg), 
                        new testAPI.EmoStem("02_rosenberg_nawl", EmoHue.Anger, EmoWordType.nawl), 
                        new testAPI.EmoStem("03_nawl_stopword", EmoHue.Anger, EmoWordType.nawl), 
                        new testAPI.EmoStem("04_only_rosenberg", EmoHue.Anger, EmoWordType.rosenberg)],

                       [new testAPI.EmoStem("01_rosenberg_vulgar", EmoHue.Happy, EmoWordType.vulgar), 
                        new testAPI.EmoStem("02_rosenberg_nawl", EmoHue.Anger, EmoWordType.rosenberg), 
                        new testAPI.EmoStem("03_nawl_stopword", EmoHue.Anger, EmoWordType.stopword), 
                        new testAPI.EmoStem("05_only_nawl", EmoHue.Anger, EmoWordType.nawl),
                        new testAPI.EmoStem("06_nawl_vulgar", EmoHue.Disgust, EmoWordType.vulgar)],
                        
                        [new testAPI.EmoStem("01_rosenberg_vulgar", EmoHue.Anger, EmoWordType.vulgar), 
                        new testAPI.EmoStem("07_only_rosenberg", EmoHue.Anger, EmoWordType.rosenberg),
                        new testAPI.EmoStem("06_nawl_vulgar", EmoHue.Anger, EmoWordType.nawl)]
                    ]

    const expectedJoined = [
        new testAPI.EmoStem("01_rosenberg_vulgar", EmoHue.Anger, EmoWordType.rosenberg),
        new testAPI.EmoStem("02_rosenberg_nawl", EmoHue.Anger, EmoWordType.rosenberg),
        new testAPI.EmoStem("03_nawl_stopword", EmoHue.Anger, EmoWordType.nawl),
        new testAPI.EmoStem("04_only_rosenberg", EmoHue.Anger, EmoWordType.rosenberg),
        new testAPI.EmoStem("05_only_nawl", EmoHue.Anger, EmoWordType.nawl),
        new testAPI.EmoStem("06_nawl_vulgar", EmoHue.Anger, EmoWordType.nawl),
        new testAPI.EmoStem("07_only_rosenberg", EmoHue.Anger, EmoWordType.rosenberg)]

    const actualJoined = EmoReference._joinEmoStems(notJoined, 
                                                    EmoReference._getMostImportantFrom)
    t.deepEquals(actualJoined, expectedJoined)
    t.end()
})

t.test("EmoReference/_compoareWordType returns the most important emoStem by wordtype", function(t) {
    const testCases = [{emoStems: [new testAPI.EmoStem("tc1A", EmoHue.Happy, EmoWordType.rosenberg),
                                   new testAPI.EmoStem("tc1B", EmoHue.Happy, EmoWordType.nawl)],
                        theMostImportantIdx: 0},

                        {emoStems: [new testAPI.EmoStem("tc2A", EmoHue.Happy, EmoWordType.unknown),
                         new testAPI.EmoStem("tc2B", EmoHue.Happy, EmoWordType.stopword),
                         new testAPI.EmoStem("tc2C", EmoHue.Happy, EmoWordType.nawl)],
                        theMostImportantIdx: 2},

                         {emoStems: [new testAPI.EmoStem("tc3A", EmoHue.Happy, EmoWordType.rosenberg),
                         new testAPI.EmoStem("tc3B", EmoHue.Happy, EmoWordType.rosenberg)],
                         theMostImportantIdx: 0},

                         {emoStems: [new testAPI.EmoStem("tc4B", EmoHue.Happy, undefined),
                         new testAPI.EmoStem("tc4A", EmoHue.Happy, EmoWordType.rosenberg)],
                         theMostImportantIdx: 1},
                        
                         {emoStems: [new testAPI.EmoStem("tc5A", EmoHue.Happy, undefined),
                          new testAPI.EmoStem("tc5B", EmoHue.Happy, undefined)],
                          theMostImportantIdx: 0},
                    ]

    for(const tc of testCases) {
        const actualResult = EmoReference._getMostImportantFrom(tc.emoStems)
        t.deepEquals(actualResult, tc.emoStems[tc.theMostImportantIdx])
    }
    t.end()
})

t.test("EmoReference/getEmoElement correctly recognizes given word hue and type", function(t) {
    const testCases = [ 
                        {"word": "i", "type": EmoWordType.stopword, "hue": EmoHue.Neutral},
                        {"word": "zezować", "type": EmoWordType.nawl, "hue": EmoHue.Disgust},
                        {"word": "dyskomfort", "type": EmoWordType.rosenberg, "hue": EmoHue.Fear},
                        {"word": "jebać", "type": EmoWordType.vulgar, "hue": EmoHue.Neutral},
                        {"word": "foo", "type": EmoWordType.unknown, "hue": EmoHue.Neutral},
                        {"word": "posiłek", "type": EmoWordType.nawl, "hue": EmoHue.Happy},
                        {"word": "pożegnanie", "type": EmoWordType.nawl, "hue": EmoHue.Sadness}
                   ]
    _buildEmoReference().then(emoRef => {
        for(const tc of testCases) {
            const actualEmoElement = emoRef.getEmoElement(tc.word)
            t.equal(actualEmoElement.word, tc.word, `Word ${tc.word}`)
            t.equal(actualEmoElement.hue, tc.hue, `Hue of ${tc.word}`)
            t.equal(actualEmoElement.type, tc.type, `Type of ${tc.word}`)
        }
        t.end()
    })

})

t.test("EmoReference/_findExactMatch finds exact match in default EmoReference", function(t) {
    _buildEmoReference().then(emoRef => {
        const wordToMatch = "jeż";
        const expectedMatch = new testAPI.EmoStem(wordToMatch, EmoHue.Happy, EmoWordType.nawl)
        const actualMatch = emoRef._findExactMatch(wordToMatch)

        t.deepEquals(actualMatch, expectedMatch)
        t.end()
    })
})

t.test("EmoReference/_findExactMatch finds exact match in default EmoReference", function(t) {
    _buildEmoReference().then(emoRef => {
        const wordToMatch = "jeżeli";
        const expectedMatch = new testAPI.EmoStem(wordToMatch, EmoHue.Neutral, EmoWordType.stopword)
        const actualMatch = emoRef._findExactMatch(wordToMatch)

        t.deepEquals(actualMatch, expectedMatch)
        t.end()
    })
})

t.test("EmoReference/_findExactMatch finds stem match in default EmoReference", function(t) {
    _buildEmoReference().then(emoRef => {
        const originalWord = "jeżeli"
        const stemToMatch = "jeż";
        const expectedMatch = new testAPI.EmoStem(originalWord, EmoHue.Neutral, EmoWordType.stopword)
        const actualMatch = emoRef._findStemMatch(stemToMatch)

        t.deepEquals(actualMatch, expectedMatch)
        t.end()
    })
})

async function _buildEmoReference() {
    const stopwords = wordsProvider.getStopWords()
    const vulgarwords = wordsProvider.getVulgarWords()
    const preevaluatedWords = wordsProvider.getNAWLWords()
    const rosenbergWords = wordsProvider.getRosenbergWords()
    return Promise.all([stopwords, vulgarwords, preevaluatedWords, rosenbergWords]).then(words => {
        return new EmoReference(words[0], words[1], words[2], words[3])
    })
}
