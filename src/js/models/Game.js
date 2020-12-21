import { RatedWordsReference } from "./RatedWordsReference";
import { EmotionalState, WordTypes } from "./EmotionalState";
import * as wordsProvider from './RatedWordsProvider.js'

export class GameInput{
    constructor(word, timestamp){
        this.word = word
        this.timestamp = timestamp
    }
}

export class Game {
    static async createGame() {
        const game = new Game();
        game.state = new EmotionalState()
        game.ratedWordsRef = await game._buildEmoReference()
        return game
    }

    async _buildEmoReference() {
        const _stopwords = wordsProvider.getStopWords()
        const _vulgarwords = wordsProvider.getVulgarWords()
        const _nawlWords = wordsProvider.getNAWLWords()
        const _rosenbergWords = wordsProvider.getRosenbergWords()
        const [stopwords,vulgarwords,nawlWords,rosenbergWords] = await Promise.all([_stopwords, _vulgarwords, _nawlWords, _rosenbergWords])

        return new RatedWordsReference(stopwords, vulgarwords, nawlWords, rosenbergWords)
    }

    sendInput(gameInput) {
        const emoElement = this.ratedWordsRef.getEmotionalCharge(gameInput.word)
        this.state.addEmotionalCharge(emoElement)
        return emoElement.hue
    }

    clearState() {
        this.state = new EmotionalState()
    }

    get EmotionalStateHSV() {
        return this.state.getEmotionStateAsHSVColor()
    }

    get RosenbergWords() {
        return this.ratedWordsRef.entries.filter(emoStem => emoStem.type === WordTypes.rosenberg)
    }
}

export default Game;