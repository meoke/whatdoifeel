// eslint-disable-next-line no-global-assign
require = require("esm")(module)
const t = require('tape-catch')

const {GameState} = require('../src/js/gameState.js')
const {GameInput} = require('../src/js/gameInput.js')


t.test("Init Game State", function (t) {
  const gs = new GameState()

  t.equal(gs.points, 0, "Points equal 0")
  t.equal(gs.inputs.length, 0, "Game inputs list is empty.")
  t.end()
})

t.test("Add points should change Game State", function (t) {
  const gs = new GameState()

  gs.addPoints(10)
  t.equal(gs.points, 10, "Add 10")
  t.end()
})

t.test("Add points should not accept type other than number", function (t) {
  const gs = new GameState()

  t.throws(() => gs.addPoints("TEST"), "GameState/AddPoints expects numbers only.")
  t.end()
})


t.test("Add input should not accept type other than GameInput", function (t) {
  const gs = new GameState()

  t.throws(() => gs.addInput(0), "GameState/AddInput expects GameInput type.")
  t.end()
})

t.test("Add input adds input to inputs", function (t) {
  const gs = new GameState()
  const gi = new GameInput("hello", new Date())
  gs.addInput(gi)
  t.equal(gs.inputs[0], gi)
  t.end()
})

t.test("GameState/getInputAtReversedIdx returns correct value", function (t) {
  const gs = new GameState()
  gs.inputs = [1,2,3]
  t.equal(gs.getInputAtReversedIdx(1), 3)
  t.equal(gs.getInputAtReversedIdx(2), 2)
  t.equal(gs.getInputAtReversedIdx(3), 1)
  t.throws(() => gs.getInputAtReversedIdx(10), "Provided index is too big. Max: 3.")
  t.throws(() => gs.getInputAtReversedIdx(-1), 'Provided index must be > 0.')
  t.throws(() => gs.getInputAtReversedIdx(0), 'Provided index must be > 0.')
  t.end()
})



