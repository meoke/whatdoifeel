import { EmoEngine } from "./EmoEngine";
import { EmoState } from "./EmoState";
import * as wordsProvider from './SpecialWordsProvider.js'

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
        this.emoEngine = await this._buildEmoEngine()
    }

    async _buildEmoEngine() {
        const stopwords = wordsProvider.getStopWords()
        const vulgarwords = wordsProvider.getVulgarWords()
        const preevaluatedWords = wordsProvider.getPreevaluatedWords()
        const rosenbergWords = wordsProvider.getRosenbergWords()
        return Promise.all([stopwords, vulgarwords, preevaluatedWords, rosenbergWords]).then(words => {
            return new EmoEngine(words[0], words[1], words[2], words[3])
        })
    }

    sendInput(gameInput) {
        const emotionWord = this.emoEngine.getUserEmoElement(gameInput.word)
        this.state.addEmotionWord(emotionWord)
    }

    get EmotionalStateHSV() {
        return [this.state.H, this.state.S, this.state.V]
    }
}

export default createGame;