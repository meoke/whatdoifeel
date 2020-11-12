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
import EmotionHue from "./EmotionHue";
import {SpecialWord} from './SpecialWord'

export async function getStopWords() {
    const path = 'https://raw.githubusercontent.com/meoke/disanger/master/data/stopwords_PL.csv'
    const papaInput = await toPapa(path)
    const stopWordsRows = await csvStreamToRows(papaInput)
    return stopWordsRows.map(row => {
        return new SpecialWord(row.word)
    })
}

export async function getVulgarWords() {
    const path = 'https://raw.githubusercontent.com/meoke/disanger/master/data/vulgarWords_PL.csv'
    const papaInput = await toPapa(path)
    const vulgarWordsRows = await csvStreamToRows(papaInput)
    return vulgarWordsRows.map(row => {
        return new SpecialWord(row.word)
    })
}

export async function getPreevaluatedWords() {
    const path = 'https://raw.githubusercontent.com/meoke/disanger/master/data/preevaluatedWords_PL.csv'
    const papaInput = await toPapa(path)
    const preevaluatedWordsRows = await csvStreamToRows(papaInput) 
    return preevaluatedWordsRows.map(row => {
        const [word, emotionHue, value] = _parsePreevaluatedRow(row)
        return new SpecialWord(word, emotionHue, value)
    })
}

function _parsePreevaluatedRow(row) {
    const hueValues = 
    [
        parseFloat(row.meanHappy),
        parseFloat(row.meanAnger),
        parseFloat(row.meanSadness),
        parseFloat(row.meanFear),
        parseFloat(row.meanDisgust)
    ]
    const hueIndexes = {   0: EmotionHue.Happy, 
        1: EmotionHue.Anger,
        2: EmotionHue.Sadness,
        3: EmotionHue.Fear,
        4: EmotionHue.Disgust,
    }
    const maxHue = Math.max(...hueValues)
    const i = hueValues.indexOf(maxHue);
    return [row.word, hueIndexes[i], maxHue]
}

export async function getRosenbergWords() {
    const path = 'https://raw.githubusercontent.com/meoke/disanger/master/data/rosenbergWords_PL.csv'
    const papaInput = await toPapa(path)
    const preevaluatedWordsRows = await csvStreamToRows(papaInput) 
    return preevaluatedWordsRows.map(row => {
        const [word, emotionHue] = _parseRosenbergRow(row)
        return new SpecialWord(word, emotionHue)
    })
}

function _parseRosenbergRow(row) {
    const hueDict = 
    {
        "happiness": EmotionHue.Happy,
        "anger": EmotionHue.Anger,
        "sadness": EmotionHue.Sadness,
        "fear": EmotionHue.Fear,
        "disgust": EmotionHue.Disgust,
    }
    return [row.word, hueDict[row.emotion]]
}

async function csvStreamToRows(papaInput) {
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

   