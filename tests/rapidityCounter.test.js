require = require('esm')(module);
const test = require('tape');
const suite = require('tape-suite')
const {RapidityCounter} = require('../src/js/rapidityCounter.js'); 

suite('get Rapidity score', function(t){
    t.test('first getScore request should return 0', function(t){
        let rc = new RapidityCounter()

        const expectedScore = 0
        const actualScore = rc.getScore(new Date('1995-12-17T03:24:00'))
        t.equal(actualScore, expectedScore)
        t.end()
    })

    t.test('time difference equal 0 should return 10000', function(t){
        let rc = new RapidityCounter()

        const expectedScore = 10000
        rc.getScore(new Date('1995-12-17T03:24:00'))
        const actualScore = rc.getScore(new Date('1995-12-17T03:24:00'))
        t.equal(actualScore, expectedScore)
        t.end()
    })

    t.test('time difference smaller than 0 should return 10000', function(t){
        let rc = new RapidityCounter()

        const expectedScore = 10000
        rc.getScore(new Date('1995-12-17T03:24:00'))
        const actualScore = rc.getScore(new Date('1995-12-17T03:20:00'))
        t.equal(actualScore, expectedScore)
        t.end()
    })
})

suite('time difference greater than 0 should return ceil(10000/miliseconds)', function(t){
    let pies = [[new Date('1995-12-17T03:24:00'), new Date('1995-12-17T03:24:01'), 10],
                [new Date('1995-12-17T03:24:00'), new Date('1995-12-17T03:25:00'), 0],
                [new Date(200), new Date(700), 20]
                ]

    let rc = new RapidityCounter()
    for(let [first, second, expectedScore] of pies){
        rc.getScore(new Date(first))
        const actualScore = rc.getScore(new Date(second))
        t.test(`difference of ${(second-first)/1000}s`, function(t){
            t.equal(actualScore, expectedScore)      
            t.end()      
        })
    }
})
