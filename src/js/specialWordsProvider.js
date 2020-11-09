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
import {SpecialWord} from './specialWord'

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
        return new SpecialWord(row.word, parseFloat(row.meanAnger))
    })
}

// async function fetchFileStream(filePath) {
//     return ""
//     // const response = await fetchFile(filePath)
//     // return response.body
// } 


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

   