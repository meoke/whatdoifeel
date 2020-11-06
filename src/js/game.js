import AngerCounter from "./angerCounter";
import GameState from "./gameState";
import RapidityCounter from './rapidityCounter'
import * as wordsProvider from './specialWordsProvider.js'

export async function createGame() {
    const game = new Game();
    await game.initialize();
    return game;

}

async function getAngerCounter() {
    const stopwords = wordsProvider.getStopWords()
    const vulgarwords = wordsProvider.getVulgarWords()
    const preevaluatedWords = wordsProvider.getPreevaluatedWords()
    return Promise.all([stopwords, vulgarwords, preevaluatedWords]).then(values => {
        return new AngerCounter(values[0], values[1], values[2])
    })
}

export class Game {
    async initialize() {
        this.state = new GameState()
        this.counters = [await getAngerCounter(),
                        new RapidityCounter()]
    }

    sendInput(gameInput) {
        this._updateState(gameInput)
        const score = this._getScore()
        this._updateScore(score)
    }

    _updateState(gameInput) {
        this.state.addInput(gameInput)
    }

    _getScore() {
        const scores = this.counters.map(counter => counter.getLastInputScore(this.state))
        return scores.reduce((a, b) => a + b, 0)
    }

    _updateScore(score) {
        this.state.addPoints(score)
    }

    get Score() {
        return this.state.points
    }

    get IsFinished() {
        return this.state.points >= 1000
    }
}

export default Game