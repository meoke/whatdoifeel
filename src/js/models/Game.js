import { EmotionAnalyzer } from "./EmotionalStateHSV";
import GameState from "./GameState";
import * as wordsProvider from './SpecialWordsProvider.js'

export async function createGame() {
    const game = new Game();
    await game.initialize();
    return game;
}

export class Game {
    async initialize() {
        this.state = new GameState()
        this.emotionAnalyzer = await this._createEmotionAnalyzer()
    }

    async _createEmotionAnalyzer() {
        const stopwords = wordsProvider.getStopWords()
        const vulgarwords = wordsProvider.getVulgarWords()
        const preevaluatedWords = wordsProvider.getPreevaluatedWords()
        return Promise.all([stopwords, vulgarwords, preevaluatedWords]).then(words => {
            return new EmotionAnalyzer(words[0], words[1], words[2])
        })
    }

    sendInput(gameInput) {
        const emotionWord = this.emotionAnalyzer.getEmotionWord(gameInput.word)
        this.state.addEmotionWord(emotionWord)
    }

    get EmotionalStateHSV() {
        return this.emotionAnalyzer.calculateEmotionalState(this.state)
    }
}

export default createGame;