import {isNode} from "browser-or-node";
import _ from 'underscore';
import Papa from 'papaparse';

import {Emotion, WordType} from "./EmotionalState";
let toPapa;
let fetchFile;
let server;
if (isNode) {
    fetchFile = require('node-fetch');
    toPapa = async path => {
        const response = await fetchFile(path);
        return response.body;
    };
    server = 'https://raw.githubusercontent.com/meoke/disanger/master';
}
else {
    toPapa = path => {return path;};
    server = '.';
}

/**
 * Describes word originating from emotional words dictionaries with assigned emotion values.
 */
export class RatedWord {
    /**
     * Creates RatedWord object
     * @param {string} word - word from the dictionary
     * @param {Emotion} emotion - main emotion connected with this word
     * @param {WordType} wordType - type of the word
     * @param {number} meanAnger - value from range [0-6] to describe mean angerness of the word
     * @param {number} meanDisgust - value from range [0-6] to describe mean disgustness of the word
     * @param {number} meanHappiness - value from range [0-6] to describe mean happiness of the word
     * @param {number} meanFear - value from range [0-6] to describe mean fearness of the word
     * @param {number} meanSadness - value from range [0-6] to describe mean sadness of the word
     */
    constructor(word, emotion, wordType, meanAnger, meanDisgust, meanHappiness, meanFear, meanSadness) {
        this.word = word;
        this.emotion = emotion;
        this.wordType = wordType;
        this.meanAnger = meanAnger;
        this.meanDisgust = meanDisgust;
        this.meanHappiness = meanHappiness;
        this.meanFear = meanFear;
        this.meanSadness = meanSadness;
    }
}

/**
 * Download Polish stopwords
 * @returns {Array} array of stopwords as RatedWord objects
 */
export async function getStopWords() {
    const path = `${server}/dictionaries/stopwords_PL.csv`;
    const papaInput = await toPapa(path);
    const stopWordsRows = await _parsers.csvStreamToRow(papaInput);
    return stopWordsRows.map(row => {
        return new RatedWord(row.word, Emotion.NEUTRAL, WordType.STOPWORD, 0, 0, 0, 0, 0);
    });
}

/**
 * Download Polish vulgar words
 * @returns {Array} array of vulgar words as RatedWord objects
 */
export async function getVulgarWords() {
    const path = `${server}/dictionaries/vulgarWords_PL.csv`;
    const papaInput = await toPapa(path);
    const vulgarWordsRows = await _parsers.csvStreamToRow(papaInput);
    return vulgarWordsRows.map(row => {
        return new RatedWord(row.word, Emotion.NEUTRAL, WordType.VULGAR, 0, 0, 0, 0, 0);
    });
}

/**
 * Download words from The Nencki Affective Word List
 * @returns {Array} array of NAWL words as RatedWord objects
 */
export async function getNAWLWords() {
    const path = `${server}/dictionaries/nawlWords_PL.csv`;
    const papaInput = await toPapa(path);
    const preevaluatedWordsRows = await _parsers.csvStreamToRow(papaInput);
    return preevaluatedWordsRows.map(row => {
        return _parsers.nawlRowToRatedWord(row);
    });
}

/**
 * Download words from M.Rosenberg's theory
 * @returns {Array} array of Rosenberg's words as RatedWord objects
 */
export async function getRosenbergWords() {
    const path = `${server}/dictionaries/rosenbergWords_PL.csv`;
    const papaInput = await toPapa(path);
    const rosenbergWordsRows = await _parsers.csvStreamToRow(papaInput);
    return rosenbergWordsRows.map(row => {
        return _parsers.rosenbergRowToRatedWord(row);
    });
}

const _parsers = (() =>{
    return {
        nawlRowToRatedWord: function(row) {
            const emotionRates = [
                {"emotion": Emotion.ANGER, "rate": parseFloat(row["meanAnger"])},
                {"emotion": Emotion.DISGUST, "rate": parseFloat(row["meanDisgust"])},
                {"emotion": Emotion.FEAR, "rate": parseFloat(row["meanFear"])},
                {"emotion": Emotion.HAPPY, "rate": parseFloat(row["meanHappiness"])},
                {"emotion": Emotion.SADNESS, "rate": parseFloat(row["meanSadness"])}
            ];
        
            const topEmotion = 
                row["category"] === "N" ?
                Emotion.NEUTRAL
                : _.chain(emotionRates)
                    .sortBy("rate")
                    .last()
                    .value()
                    .emotion;
        
            const meanEmotionValues = emotionRates.map(x => x.rate);
            const word = Object.values(row)[0];
            return new RatedWord(word, topEmotion, WordType.NAWL, ...meanEmotionValues);
        },
        rosenbergRowToRatedWord: function (row) {
            const hueToEmotion = 
            {
                "H": Emotion.HAPPY,
                "A": Emotion.ANGER,
                "S": Emotion.SADNESS,
                "F": Emotion.FEAR,
                "D": Emotion.DISGUST
            };
            return new RatedWord(row.word, 
                                hueToEmotion[row.hue], 
                                WordType.ROSENBERG);
        },
        csvStreamToRow: function (papaInput) {
            return new Promise((resolve, reject) => {Papa.parse(papaInput, {
                download: true,
                header: true,
                delimiter: ',',
                error: e => {
                    reject(e);
                },
                complete: result => {
                    if (result.errors.length > 0) {
                        reject(result.errors);
                    }
                    resolve(result.data);
                }
            });});
        }
    };
})();


export const testAPI = {
    nawlRowToRatedWord: _parsers.nawlRowToRatedWord,
    rosenbergRowToRatedWord: _parsers.rosenbergRowToRatedWord,
};
