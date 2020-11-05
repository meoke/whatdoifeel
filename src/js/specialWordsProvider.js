import {isNode} from "browser-or-node";
let fetchFile
if (isNode) {
    fetchFile = require('node-fetch');
}
else {
    fetchFile = fetch
}

import Papa from 'papaparse';
import {SpecialWord, WordType} from './specialWords'

export async function getStopWords() {
    const stream = await fetchFileStream('https://raw.githubusercontent.com/meoke/disanger/master/data/stopwords_PL.csv')
    const stopWordsRows = await csvStreamToRows(stream)
    return stopWordsRows.map(row => {
        return new SpecialWord(row.word, WordType.stopWord)
    })
}

export async function getVulgarWords() {
    const stream = await fetchFileStream('https://raw.githubusercontent.com/meoke/disanger/master/data/vulgarWords_PL.csv')
    const vulgarWordsRows = await csvStreamToRows(stream)
    return vulgarWordsRows.map(row => {
        return new SpecialWord(row.word, WordType.vulgar)
    })
}

export async function getPreevaluatedWords() {
    const stream = await fetchFileStream('https://raw.githubusercontent.com/meoke/disanger/master/data/preevaluatedWords_PL.csv')
    const preevaluatedWordsRows = await csvStreamToRows(stream) 
    return preevaluatedWordsRows.map(row => {
        return new SpecialWord(row.word, WordType.preevaluated, parseFloat(row.meanAnger))
    })
}

async function csvStreamToRows(stream) {
    return new Promise((resolve, reject) => {Papa.parse(stream, {
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

async function fetchFileStream(filePath) {
    const response = await fetchFile(filePath)
    return response.body
}    