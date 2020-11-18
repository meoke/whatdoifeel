import { EmoReference } from "./EmoReference";
import { EmoState } from "./EmoState";
import * as wordsProvider from './DictionaryWordsProvider.js'

export class GameInput{
    constructor(word, timestamp){
        this.word = word
        this.timestamp = timestamp
    }
}

export async function createGame() {
    const game = new Game();
    await game.initialize();
    return game;
}

export class Game {
    async initialize() {
        this.state = new EmoState()
        this.emoRef = await this._buildEmoReference()
    }

    async _buildEmoReference() {
        const stopwords = wordsProvider.getStopWords()
        const vulgarwords = wordsProvider.getVulgarWords()
        const preevaluatedWords = wordsProvider.getNAWLWords()
        const rosenbergWords = wordsProvider.getRosenbergWords()
        return Promise.all([stopwords, vulgarwords, preevaluatedWords, rosenbergWords]).then(words => {
            return new EmoReference(words[0], words[1], words[2], words[3])
        })
    }

    sendInput(gameInput) {
        const emotionWord = this.emoRef.getEmoElement(gameInput.word)
        this.state.addEmoElement(emotionWord)
    }

    clearState() {
        this.state = new EmoState()
    }

    get EmotionalStateHSV() {
        return [this.state.H, this.state.S, this.state.V]
    }
}

export default createGame;