import {isNode} from "browser-or-node";
let toPapa
let fetchFile
if (isNode) {
    fetchFile = require('node-fetch');
    toPapa = async path => {
        const response = await fetchFile(path)
        return response.body
    }
}
else {
    toPapa = path => {return path}
}

import Papa from 'papaparse';
import {EmotionHue} from "./EmotionHue";
import {DictionaryWord} from './DictionaryWord'

async function getStopWords() {
    const path = 'https://raw.githubusercontent.com/meoke/disanger/master/data/stopwords_PL.csv'
    const papaInput = await toPapa(path)
    const stopWordsRows = await _csvStreamToRows(papaInput)
    return stopWordsRows.map(row => {
        return new DictionaryWord(row.word)
    })
}

async function getVulgarWords() {
    const path = 'https://raw.githubusercontent.com/meoke/disanger/master/data/vulgarWords_PL.csv'
    const papaInput = await toPapa(path)
    const vulgarWordsRows = await _csvStreamToRows(papaInput)
    return vulgarWordsRows.map(row => {
        return new DictionaryWord(row.word)
    })
}

async function getNAWLWords() {
    const path = 'https://raw.githubusercontent.com/meoke/disanger/hsv/data/nawlWords_PL.csv'
    const papaInput = await toPapa(path)
    const preevaluatedWordsRows = await _csvStreamToRows(papaInput) 
    return preevaluatedWordsRows.map(row => {
        let w = Object.values(row)[0]

        const [word, emotionHue, meanAnger, meanDisgust, meanFear, meanHappiness, meanSadness] = _parseNAWLRow(row)
        return new DictionaryWord(w, emotionHue, meanAnger, meanDisgust, meanFear, meanHappiness, meanSadness)
    })
}

function _parseNAWLRow(row) {
    let hue;
    let hueValues = 
    [
        parseFloat(row["meanAnger"]),
        parseFloat(row["meanDisgust"]),
        parseFloat(row["meanFear"]),
        parseFloat(row["meanHappiness"]),
        parseFloat(row["meanSadness"])
    ]
    if(row["category"] === "N"){
        hue = EmotionHue.Neutral
    }
    else{
        
        const hueIndexes = {   
            0: EmotionHue.Anger,
            1: EmotionHue.Disgust,
            2: EmotionHue.Fear,
            3: EmotionHue.Happy, 
            4: EmotionHue.Sadness
        }
        const maxHue = Math.max(...hueValues)
        const i = hueValues.indexOf(maxHue);
        hue = hueIndexes[i]
    }
    

    return [row.word, hue, ...hueValues];
}

async function getRosenbergWords() {
    const path = 'https://raw.githubusercontent.com/meoke/disanger/hsv/data/rosenbergWords_PL.csv'
    const papaInput = await toPapa(path)
    const preevaluatedWordsRows = await _csvStreamToRows(papaInput) 
    return preevaluatedWordsRows.map(row => {
        const [word, emotionHue] = _parseRosenbergRow(row)
        return new DictionaryWord(word, emotionHue)
    })
}

function _parseRosenbergRow(row) {
    const hueDict = 
    {
        "H": EmotionHue.Happy,
        "A": EmotionHue.Anger,
        "S": EmotionHue.Sadness,
        "F": EmotionHue.Fear,
        "D": EmotionHue.Disgust,
    }
    return [row.word, hueDict[row.hue]]
}

async function _csvStreamToRows(papaInput) {
    return new Promise((resolve, reject) => {Papa.parse(papaInput, {
        download: true,
        header: true,
        delimiter: ',',
        error: e => {
            reject(e)
        },
        complete: result => {
            if (result.errors.length > 0) {
                reject(result.errors)
            }
            resolve(result.data)
        }
    })})
}

const testAPI = {
    _parseNAWLRow: _parseNAWLRow,
    _parseRosenbergRow: _parseRosenbergRow,
    _csvStreamToRows: _csvStreamToRows
}

export {testAPI, getNAWLWords, getStopWords, getRosenbergWords, getVulgarWords}