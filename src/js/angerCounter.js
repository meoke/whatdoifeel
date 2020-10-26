const {readFileSync} = require('fs');

export class AngerCounter {
    static stopwords = AngerCounter.readWordsFile("data/stopwords_PL.txt")
    static vulgarStems = AngerCounter.readWordsFile("data/vulgarWords_stem_PL.txt")

    static getScore(word) {
        if(AngerCounter.isStopword(word)){
            return 0;
        }
        if(AngerCounter.isVulgarStem(word)){
            return 10;
        }
        return -1;
    }

    static isStopword(word) {
        return AngerCounter.stopwords.includes(word);
    }

    static isVulgarStem(word) {
        return AngerCounter.vulgarStems.includes(word);
    }

    static readWordsFile(fileName) {
        let words;
        try {
            words = readFileSync(fileName, 'utf-8').split(/\r\n|\n|\r/);
            console.log('words read')
        } catch(error) {
            throw new Error(`Could not read file: ${fileName}` + error.message)
        };

        return words
    }
}

export default AngerCounter