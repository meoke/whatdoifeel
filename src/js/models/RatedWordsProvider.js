import {isNode} from "browser-or-node";
import _ from 'underscore';
import Papa from 'papaparse';

import {Emotions, WordTypes} from "./EmotionalState";

let toPapa;
let fetchFile;
let server;
if (isNode) {
    fetchFile = require('node-fetch');
    toPapa = async path => {
        const response = await fetchFile(path)
        return response.body
    }
    server = 'https://raw.githubusercontent.com/meoke/disanger/master'
}
else {
    toPapa = path => {return path}
    server = '.'
}

export class RatedWord {
    constructor(word, emotion, wordType, meanAnger, meanDisgust, meanHappiness, meanFear, meanSadness) {
        this.word = word
        this.emotion = emotion
        this.wordType = wordType
        this.meanAnger = meanAnger
        this.meanDisgust = meanDisgust
        this.meanHappiness = meanHappiness
        this.meanFear = meanFear
        this.meanSadness = meanSadness
    }
}

async function getStopWords() {
    const path = `${server}/dictionaries/stopwords_PL.csv`
    const papaInput = await toPapa(path)
    const stopWordsRows = await _csvStreamToRows(papaInput)
    return stopWordsRows.map(row => {
        return new RatedWord(row.word, Emotions.Neutral, WordTypes.stopword)
    })
}

async function getVulgarWords() {
    const path = `${server}/dictionaries/vulgarWords_PL.csv`
    const papaInput = await toPapa(path)
    const vulgarWordsRows = await _csvStreamToRows(papaInput)
    return vulgarWordsRows.map(row => {
        return new RatedWord(row.word, Emotions.Neutral, WordTypes.vulgar)
    })
}

async function getNAWLWords() {
    const path = `${server}/dictionaries/nawlWords_PL.csv`
    const papaInput = await toPapa(path)
    const preevaluatedWordsRows = await _csvStreamToRows(papaInput) 
    return preevaluatedWordsRows.map(row => {
        let w = Object.values(row)[0]

        const [word, emotion, meanAnger, meanDisgust, meanFear, meanHappiness, meanSadness] = _parseNAWLRow(row)
        return new RatedWord(w, emotion, WordTypes.nawl, meanAnger, meanDisgust, meanFear, meanHappiness, meanSadness)
    })
}

function _parseNAWLRow(row) {
    const emotionRates = [
        {"emotion": Emotions.Anger, "rate": parseFloat(row["meanAnger"])},
        {"emotion": Emotions.Disgust, "rate": parseFloat(row["meanDisgust"])},
        {"emotion": Emotions.Fear, "rate": parseFloat(row["meanFear"])},
        {"emotion": Emotions.Happy, "rate": parseFloat(row["meanHappiness"])},
        {"emotion": Emotions.Sadness, "rate": parseFloat(row["meanSadness"])}
    ]

    const topEmotion = 
        row["category"] === "N" ?
        Emotions.Neutral
        : _.chain(emotionRates)
            .sortBy("rate")
            .last()
            .value()
            .emotion

    const meanEmotionValues = emotionRates.map(x => x.rate)
    return [row.word, topEmotion, ...meanEmotionValues];
}

async function getRosenbergWords() {
    const path = `${server}/dictionaries/rosenbergWords_PL.csv`
    const papaInput = await toPapa(path)
    const rosenbergWordsRows = await _csvStreamToRows(papaInput) 
    return rosenbergWordsRows.map(row => {
        const [word, emotion] = _parseRosenbergRow(row)
        return new RatedWord(word, emotion, WordTypes.rosenberg)
    })
}

function _parseRosenbergRow(row) {
    const emotionDict = 
    {
        "H": Emotions.Happy,
        "A": Emotions.Anger,
        "S": Emotions.Sadness,
        "F": Emotions.Fear,
        "D": Emotions.Disgust,
    }
    return [row.word, emotionDict[row.hue]]
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
}

export {testAPI, getNAWLWords, getStopWords, getRosenbergWords, getVulgarWords}