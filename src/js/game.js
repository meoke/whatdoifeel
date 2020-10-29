import AngerCounter from "./angerCounter";
import GameState from "./gameState";
import RapidityCounter from './rapidityCounter'

export class Game{
    constructor() {
        this.state = new GameState()
        this.counters = [new AngerCounter(), new RapidityCounter()]
    }

    sendInput(gameInput) {
        const scorePromises = this.counters.map(counter => counter.getScore(gameInput))
        Promise.all(scorePromises).then(results => {
            const score = results.reduce((a,b)=>a+b, 0)
            this.state.addPoints(score)
            this.state.addInput(gameInput)
        })
    }

    get Score(){
        return this.state.points
    }

    get IsFinished(){
        return this.state.points >= 1000
    }
}

export default Game