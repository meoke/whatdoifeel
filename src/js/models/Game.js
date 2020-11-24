import { EmoReference } from "./EmoReference";
import { EmoState } from "./EmoState";
import * as wordsProvider from './DictionaryWordsProvider.js'
import { EmoWordType } from "./EmoElement";

export class GameInput{
    constructor(word, timestamp){
        this.word = word
        this.timestamp = timestamp
    }
}

// export async function createGame() {
//     const game = new Game();
//     await game.initialize();
//     return game;
// }

export class Game {
    static async createGame() {
        const game = new Game();
        game.state = new EmoState()
        game.emoRef = await game._buildEmoReference()
        return game
    }

    async _buildEmoReference() {
        const _stopwords = wordsProvider.getStopWords()
        const _vulgarwords = wordsProvider.getVulgarWords()
        const _nawlWords = wordsProvider.getNAWLWords()
        const _rosenbergWords = wordsProvider.getRosenbergWords()
        const [stopwords,vulgarwords,nawlWords,rosenbergWords] = await Promise.all([_stopwords, _vulgarwords, _nawlWords, _rosenbergWords])

        return new EmoReference(stopwords, vulgarwords, nawlWords, rosenbergWords)
    }

    sendInput(gameInput) {
        const emoElement = this.emoRef.getEmoElement(gameInput.word)
        this.state.addEmoElement(emoElement)
        return emoElement.hue
    }

    clearState() {
        this.state = new EmoState()
    }

    get EmotionalStateHSV() {
        return [this.state.H, this.state.S, this.state.V]
    }

    get RosenbergWords() {
        return this.emoRef.emoStems.filter(emoStem => emoStem.type === EmoWordType.rosenberg)
    }
}

export default Game;