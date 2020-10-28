import AngerCounter from "./angerCounter";
import GameState from "./gameState";
import RapidityCounter from './rapidityCounter'

export class Game{
    constructor() {
        this.state = new GameState()
        this.counters = [new AngerCounter(), new RapidityCounter()]
    }

    sendInput(gameInput) {
        score = this.counters.
                    map(counter => counter.getScore(gameInput)).
                    reduce((a,b)=>a+b, 0)
        this.state.addPoints(score)
        this.state.addInput(input)
    }
}

export class GameInput{
    constructor(word, timestamp){
        this.word = word
        this.timestamp = timestamp
    }
}