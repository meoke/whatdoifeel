// eslint-disable-next-line no-global-assign
require = require("esm")(module)
const t = require('tape-catch')

const {GameInput} = require ('../src/js/models/GameInput.js')
const {GameState} = require ('../src/js/models/GameState.js')
const {RapidityCounter} = require('../src/js/models/RapidityCounter.js')

t.test('RapidityCounter/getLastInputScore returns 0 for 0 inputs', function(t){
    const rc = new RapidityCounter()
    const gs = new GameState()
    gs.inputs = []

    const expectedScore = 0
    const actualScore = rc.getLastInputScore(gs)
    t.equal(actualScore, expectedScore)
    t.end()
})

t.test('RapidityCounter/getLastInputScore returns 0 for first input', function(t){
    const rc = new RapidityCounter()
    const gs = new GameState()
    gs.inputs = [new GameInput("", new Date('1995-12-17T03:24:00'))]

    const expectedScore = 0
    const actualScore = rc.getLastInputScore(gs)
    t.equal(actualScore, expectedScore)
    t.end()
})

t.test('RapidityCounter/getLastInputScore returns 0 for time difference equal 0', function(t){
    const rc = new RapidityCounter()
    const gs = new GameState()
    gs.inputs = [   new GameInput("", new Date('1995-12-17T03:24:00')),
                    new GameInput("", new Date('1995-12-17T03:24:00'))]

    const expectedScore = 0
    const actualScore = rc.getLastInputScore(gs)
    t.equal(actualScore, expectedScore)
    t.end()
})

t.test('RapidityCounter/getLastInputScore returns 0 for time difference smaller than 0', function(t){
    const rc = new RapidityCounter()
    const gs = new GameState()
    gs.inputs = [   new GameInput("", new Date('1995-12-17T03:24:00')),
                    new GameInput("", new Date('1995-12-17T03:20:00'))]

    const expectedScore = 0
    const actualScore = rc.getLastInputScore(gs)
    t.equal(actualScore, expectedScore)
    t.end()
})


t.test('RapidityCounter/getLastInputScore returns correct value for two inputs in GameState', function(t){
    const dates = [ [new Date('1995-12-17T03:24:00'), new Date('1995-12-17T03:24:01'), 10],
                    [new Date('1995-12-17T03:24:00'), new Date('1995-12-17T03:25:00'), 0],
                    [new Date(200), new Date(700), 20]
                  ]

    const rc = new RapidityCounter()
    const gs = new GameState()
    for(let [first, second, expectedScore] of dates){
        gs.inputs = [new GameInput("", new Date(first)), new GameInput("", new Date(second))]
        const actualScore = rc.getLastInputScore(gs)
        t.equal(actualScore, expectedScore, `difference of ${(second-first)/1000}s`)      
    }
    t.end()
})

t.test('RapidityCounter/getLastInputScore returns correct value for three inputs in GameState', function(t){
    const rc = new RapidityCounter()
    const gs = new GameState()
    gs.inputs = [   new GameInput("", new Date('1995-12-17T03:20:00')),
                    new GameInput("", new Date('1995-12-17T03:20:02')),
                    new GameInput("", new Date('1995-12-17T03:20:04'))]

    const expectedScore = 5
    const actualScore = rc.getLastInputScore(gs)
    t.equal(actualScore, expectedScore)
    t.end()
})