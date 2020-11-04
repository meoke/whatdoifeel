const fetch = require('node-fetch');
import Papa from 'papaparse';

class SpecialWord {
    constructor(word, type, meanAnger) {
        this.word = word
        this.type = type
        this.meanAnger = meanAnger
    }
}

export const WordType = {
    vulgar: 'vulgar',
    stopWord: 'stopword',
    preevaluated: 'preevaluated',
}

export class WordsReader{
    async getStopWords(){
        const path = 'https://raw.githubusercontent.com/meoke/disanger/master/data/stopwords_PL.csv'

        const fileStream = await this.fetchFileStream(path)
        const stopWords = []
        return new Promise((resolve, reject) => {Papa.parse(fileStream, {
            download: true,
            header: true,
            step: function(row) {
                const sw = new SpecialWord(row.data.word, WordType.stopWord)
                stopWords.push(sw)
            },
            complete: function() {
                console.log("Parsing complete", stopWords.length);
                resolve(stopWords);
            }
        })});
    }

    async fetchFileStream(filePath) {
        const response = await fetch(filePath)
        return response.body
    }    
}