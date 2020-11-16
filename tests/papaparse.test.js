// eslint-disable-next-line no-global-assign
require = require("esm")(module)
const t = require('tape-catch')
const Papa = require('papaparse')
const _ = require('underscore')

t.test("Papa Parse returns empty data object to Complete when step function is provided.", function(t) {
    const csvString = "headerA,headerB\nrow1A,row1B\nrow2A,row2B"
    const expectedParsed = [{'headerA': 'row1A', 'headerB': 'row1B'}, {'headerA': 'row2A', 'headerB': 'row2B'}]
    let actualParsed = []
    Papa.parse(csvString, {
        header: true,
        delimiter: ',',
        step: row => {
            actualParsed.push(row.data)
        },
        complete: result => {
            t.ok(_.isEmpty(result.data))
            t.ok(_.isEqual(actualParsed, expectedParsed))
            t.end()
        }
    })
})

t.test("Papa Parse returns object to Complete with data if no step function is provided.", function(t) {
    const csvString = "headerA,headerB\nrow1A,row1B\nrow2A,row2B"
    const expectedParsed = [{'headerA': 'row1A', 'headerB': 'row1B'}, {'headerA': 'row2A', 'headerB': 'row2B'}]
    Papa.parse(csvString, {
        header: true,
        complete: result => {
            t.ok(_.isEqual(result.data, expectedParsed))
            t.end()
        }
    })
})

t.test("Papa Parse behaves strangely for large csv.", function(t) {
    const csvString = "word,category,meanHappiness,meanAnger,meanSadness,meanFear,meanDisgust\nrozkoszny,H,5.296296,1.4074074,1.4814814,1.5555556,1.3703704"
    const expectedParsed = [{'word': 'rozkoszny', 'category': 'H', 'meanHappiness': '5.296296', 'meanAnger': '1.4074074', 'meanSadness': '1.4814814', 'meanFear': '1.5555556', 'meanDisgust': '1.3703704'}]
    Papa.parse(csvString, {
        header: true,
        complete: result => {
            t.ok(_.isEqual(result.data, expectedParsed))
            t.end()
        }
    })
})


