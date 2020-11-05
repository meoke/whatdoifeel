import * as csv from '@fast-csv/parse';
import GameInput from './gameInput'
import getStem from 'stemmer_pl';
// import { getFileStream } from './fileStreamProvider'

export const WordType = {
    vulgar: 'vulgar',
    stopWord: 'stopword',
    preevaluated: 'preevaluated',
}

class SpecialStem {
    constructor(stem, type, meanAnger) {
        this.stem = stem
        this.type = type
        this.meanAnger = meanAnger
    }
}
export class AngerWord {
    constructor(word, wordType, angerValue) {
        this.word = word;
        switch (wordType) {
            case WordType.vulgar:
                this.meanAnger = 10;
                break;
            case WordType.stopWord:
                this.meanAnger = 0;
                break;
            case WordType.preevaluated:
                this.meanAnger = Math.round(parseFloat(angerValue) * 10);
                break;
        }
    }
}

// class MyClass {
//     static data = (function() {
//       console.log('static constructor called') // once!
//       return "Data from file"
//     })()
//     static test = (a) => MyClass.data + a;
//     
// Usage
//    
// let a = MyClass.test(10);//    
// let b = MyClass.test(20);//    
// console.log(a);//   
// console.log(b);// }

export class AngerCounter {
    static wordsStatic = (function() {

    })()

    constructor() {
        this.words = AngerCounter.readWords()
    }

    async updateScore(gameInput) {
        if (!(gameInput instanceof GameInput)) {
            throw TypeError("AngerCounter/getScore accepts GameInput only.")
        }
        const words = await this.words
        const inputStem = getStem(gameInput.word)
        const emotionalWord = words.find(a => a.word == inputStem)

        if (emotionalWord === undefined) {
            return 0;
        }
        return emotionalWord.meanAnger;
    }

    static async getStopWordsAsync() {
        const words = AngerCounter.readTxtFile("data/stopwords_PL.txt");
        return (await words).map(word => new AngerWord(word, WordType.stopWord));
    }


    static async getVulgarStemsAsync() {
        const words = AngerCounter.readTxtFile("data/vulgarWords_stem_PL.txt");
        return (await words).map(word => new AngerWord(word, WordType.vulgar));
    }

    static async getEmotionalStemsAsync() {
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
        return getFileStream(fileName).then(data => {
            const words = txtContent.split(/\r\n|\n|\r/)
            resolve(words)
        }).catch(error => {
            reject(error)
        })
        // return new Promise((resolve, reject) => {
        //         fs.promises.readFile(fileName, {encoding: 'utf-8'})
        //                         .then(txtContent => {
        //                             const words = txtContent.split(/\r\n|\n|\r/)
        //                             resolve(words)
        //                         })
        //                         .catch(error => {
        //                             reject(error)
        //                         }                                
        //                         )
        //                     })
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