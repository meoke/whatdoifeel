import getStem from 'stemmer_pl';

export class AngerWord {
    constructor(word, type, angerValue) {
        this.word = word
        this.stem = getStem(word)
        this.type = type
        this.angerValue = angerValue
    }
}

export const WordType = {
    stopword: 'stopword',
    vulgar: 'vulgar',
    preevaluated: 'preevaluated',
}

export class AngerCounter {
    constructor(stopWords, vulgarWords, preevaluatedWords) {
        const scores = {
            stopWord: 0,
            vulgar: 10,
        }

        const angerStopWords = this.buildAngerWordsCommonScore(stopWords, WordType.stopword, scores.stopWord)
        const angerVulgarWords = this.buildAngerWordsCommonScore(vulgarWords, WordType.vulgar, scores.vulgar)
        const angerPreevaluatedWords = this.buildAngerWordsArrayPredefinedScore(preevaluatedWords, WordType.preevaluated)
        
        this.angerWords = this.join([angerStopWords, angerVulgarWords, angerPreevaluatedWords])
    }

    buildAngerWordsCommonScore(specialWords, type, commonScore) {
        return specialWords.map(specialWord => {
            return new AngerWord(specialWord.word, type, commonScore)
        })
    }

    buildAngerWordsArrayPredefinedScore(specialWords, type) {
        return specialWords.map(specialWord => {
            const angerValue = Math.round(parseFloat(specialWord.value) * 10);
            return new AngerWord(specialWord.word, type, angerValue)
        })
    }

    join(table) {
        return table.flat()
    }

    getLastInputScore(gameState) {
        if (gameState.inputs.length === 0) {
            return 0
        }
        const lastWord = gameState.getInputAtReversedIdx(1).word

        const exactMatch = this.findExactMatch(lastWord)
        if (exactMatch !== undefined){
            return exactMatch.angerValue
        }
        const lastWordStem = getStem(lastWord)
        const stemMatch = this.findStemMatch(lastWordStem)
        if (stemMatch !== undefined){
            return stemMatch.angerValue
        }
        return 0
    }

    findExactMatch(word) {
        return this.angerWords.find(angerWord => angerWord.word === word)
    }

    findStemMatch(word) {
        return this.angerWords.find(angerWord => angerWord.stem === word)
    }
}

export default AngerCounter