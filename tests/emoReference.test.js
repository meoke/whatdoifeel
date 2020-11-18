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

t.test("EmoReference/_joinEmoStems joins into flat array", function (t) {
    const notJoined = [[new testAPI.EmoStem("foo", EmoHue.Anger, EmoWordType.rosenberg)],
                     [new testAPI.EmoStem("foo2", EmoHue.Happy, EmoWordType.vulgar)]]

    const expectedJoined = [new testAPI.EmoStem("foo", EmoHue.Anger, EmoWordType.rosenberg),
                            new testAPI.EmoStem("foo2", EmoHue.Happy, EmoWordType.vulgar)]

    const actualJoined = EmoReference._joinEmoStems(notJoined)
    t.deepEquals(actualJoined, expectedJoined)
    t.end()
})

t.test("EmoReference/getEmoElement correctly recognizes given word hue and type", function(t) {
    const testCases = [ {"word": "i", "type": EmoWordType.stopword, "hue": EmoHue.Neutral},
                        // {"word": "zezować", "type": EmoWordType.nawl, "hue": EmoHue.Disgust},
                        // {"word": "dyskomfort", "type": EmoWordType.rosenberg, "hue": EmoHue.Fear},
                        // {"word": "kurwa", "type": EmoWordType.vulgar, "hue": EmoHue.Neutral},
                        // {"word": "foo", "type": EmoWordType.uknown, "hue": EmoHue.Neutral},
                        // {"word": "posiłek", "type": EmoWordType.nawl, "hue": EmoHue.Happy},
                        // {"word": "pożegnanie", "type": EmoWordType.nawl, "hue": EmoHue.Sadness}
                   ]
    _buildEmoReference().then(emoRef => {
        for(const tc of testCases) {
            const actualEmoElement = emoRef.getEmoElement(tc.word)
            t.equal(actualEmoElement.word, tc.word, "Word")
            t.equal(actualEmoElement.hue, tc.hue, "Hue")
            t.equal(actualEmoElement.type, tc.type, "Type")
        }
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
