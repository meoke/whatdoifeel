import * as fs from 'fs';
import * as csv from '@fast-csv/parse';
import {GameInput} from './game'

export class AngerWord {
    constructor(word, angerValue) {
        this.word = word;
        this.angerValue = angerValue;
    }
}

export class AngerCounter {
    constructor(){
        this.words = AngerCounter.readWords()
    }

    async getScore(gameInput) {
        if (!(gameInput instanceof GameInput)){
            throw TypeError("AngerCounter/getScore accepts GameInput only.")
        }
        const emotionalWord = (await this.words).find(a => a.word == gameInput.word)
        if (emotionalWord === undefined){
            return 0;
        }
        return emotionalWord.angerValue;
    }

    static async readWords() {
        let stopwords = (await AngerCounter.readTxtFile("data/stopwords_PL.txt")).map(word => new AngerWord(word, 0))
        let vulgarStems = (await AngerCounter.readTxtFile("data/vulgarWords_stem_PL.txt")).map(word => new AngerWord(word, 10))
        let emotionalStems = await AngerCounter.readCSVFile("data/emotionalWords.csv", "word", "meanAnger")
        emotionalStems = emotionalStems.map(data => new AngerWord(data.word, parseFloat(data.meanAnger)))
        return [...stopwords, ...vulgarStems, ...emotionalStems]
    }

    static readTxtFile(fileName) {
        return new Promise((resolve, reject) => {
                fs.promises.readFile(fileName, {encoding: 'utf-8'})
                                .then(txtContent => {
                                    const words = txtContent.split(/\r\n|\n|\r/)
                                    resolve(words)
                                })
                                .catch(error => {
                                    reject(error)
                                }                                
                                )
                            })
    }

    static readCSVFile(fileName) {
        return new Promise((resolve, reject) => {
            let csvLines = []
            csv.parseFile(fileName, { headers: true })
                .on('error', error => reject(error))
                .on('data', data => csvLines.push(data))
                .on('end', () => resolve(csvLines));
        }
    )
    }
}

export default AngerCounter