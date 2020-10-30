import * as fs from 'fs';
import * as csv from '@fast-csv/parse';
import GameInput from './gameInput'
import getStem from 'stemmer_pl';

export const WordType = {
    vulgar: 'vulgar',
    stopword: 'stopword',
    preevaluated: 'preevaluated',
  }

export class AngerWord {
    constructor(word, wordScore, angerValue) {
        this.word = word;
        switch(wordScore){
            case WordType.vulgar:
                this.meanAnger = 10;
                break;
            case WordType.stopword:
                this.meanAnger = 0;
                break;
            case WordType.preevaluated:
                this.meanAnger = Math.round(parseFloat(angerValue) * 10);
                break;
        }
    }
}

export class AngerCounter {
    constructor(){
        this.words = AngerCounter.readWords()
    }

    async updateScore(gameInput) {
        if (!(gameInput instanceof GameInput)){
            throw TypeError("AngerCounter/getScore accepts GameInput only.")
        }
        const words = await this.words
        const inputStem = getStem(gameInput.word)
        const emotionalWord = words.find(a => a.word == inputStem)
        
        if (emotionalWord === undefined){
            return 0;
        }
        return emotionalWord.meanAnger;
    }

    static async getStopWordsAsync(){
        const words = AngerCounter.readTxtFile("data/stopwords_PL.txt");
        return (await words).map(word => new AngerWord(word, WordType.stopword));
    }

    
    static async getVulgarStemsAsync(){
        const words = AngerCounter.readTxtFile("data/vulgarWords_stem_PL.txt");
        return (await words).map(word => new AngerWord(word, WordType.vulgar));
    }

    static async getEmotionalStemsAsync(){
        const words = AngerCounter.readCSVFile("data/emotionalStems.csv");
        return (await words).map(stem => new AngerWord(stem.word, WordType.preevaluated, stem.meanAnger));
    }

    static async readWords() {
        const stopWords = AngerCounter.getStopWordsAsync()
        const vulgarStems = AngerCounter.getVulgarStemsAsync()
        const emotionalStems = AngerCounter.getEmotionalStemsAsync()
        
        return [...(await stopWords), ...(await vulgarStems), ...(await emotionalStems)]
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