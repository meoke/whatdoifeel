import AngerCounter from "./angerCounter";
import GameState from "./gameState";
import RapidityCounter from './rapidityCounter'

export class Game {
    constructor(stopWords, specialStems) {
        this.state = new GameState()

        this.counters = [   new AngerCounter(stopWords, specialStems),
                            new RapidityCounter()]
    }

    async sendInput(gameInput) {
        const scorePromises = this.counters.map(counter => counter.updateScore(gameInput))
        const scores = await Promise.all(scorePromises)

        const score = scores.reduce((a, b) => a + b, 0)
        this.state.addPoints(score)
        this.state.addInput(gameInput)
        return score
    }


    get Score() {
        return this.state.points
    }

    get IsFinished() {
        return this.state.points >= 1000
    }
}

export default Game