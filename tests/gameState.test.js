// eslint-disable-next-line no-global-assign
require = require("esm")(module)
const t = require('tape-catch')
const _ = require('underscore')

const {GameState} = require('../src/js/models/GameState.js')
const {GameInput} = require('../src/js/models/GameInput.js')
const { default: EmotionWord } = require("../src/js/models/EmotionWord.js")
const { default: EmotionHue } = require("../src/js/models/EmotionHue.js")
const { EmotionalSpecialWord } = require("../src/js/models/EmotionalStateHSV.js")


t.test("GameState after construction should be empty", function (t) {
  const gs = new GameState()

  t.ok(_.isEqual(gs.emotionWords, []), "Game emotion words list is empty.")
  t.end()
})

t.test("GameState/addEmotionWord when gets EmotionWord should add it to its list of emotion words", function (t) {
  const gs = new GameState()

  gs.addEmotionWord(new EmotionWord("test", "test", EmotionHue.Neutral, 0))

  const expectedEmotionalWords = [new EmotionWord("test", "test", EmotionHue.Neutral, 0)]
  t.ok(_.isEqual(gs.emotionWords, expectedEmotionalWords))
  t.end()
})

t.test("GameState/addEmotionWord when gets invalid type should throw error", function (t) {
  const gs = new GameState()

  t.throws(() => gs.addEmotionWord("TEST"), "GameState/addEmotionWord expects EmotionWord type.")
  t.end()
})

t.test("GameState/getInputAtReversedIdx returns correct value", function (t) {
  const gs = new GameState()
  const ew1 = new EmotionWord("1", "1", EmotionHue.Neutral, 0)
  const ew2 = new EmotionWord("2", "2", EmotionHue.Neutral, 0)
  const ew3 = new EmotionWord("3", "3", EmotionHue.Neutral, 0)
  gs.emotionWords = [ew1, ew2, ew3]

  t.equal(gs.getInputAtReversedIdx(1), ew3)
  t.equal(gs.getInputAtReversedIdx(2), ew2)
  t.equal(gs.getInputAtReversedIdx(3), ew1)
  t.throws(() => gs.getInputAtReversedIdx(10), "Provided index is too big. Max: 3.")
  t.throws(() => gs.getInputAtReversedIdx(-1), 'Provided index must be > 0.')
  t.throws(() => gs.getInputAtReversedIdx(0), 'Provided index must be > 0.')
  t.end()
})



