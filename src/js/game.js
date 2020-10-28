import AngerCounter from "./angerCounter";
import GameState from "./gameState";
import GameState from './gameState'
import AngerCounter from './angerCounter'
import RapidityCounter from './rapidityCounter'

export class Game{
    constructor() {
        this.state = new GameState()
        this.counters = [new AngerCounter(), new RapidityCounter()]
    }

    sendNewWord(word, timestamp) {
        scores = this.counters.map(counter => counter.getScore(word, timestamp))
        // niech counters przyjmują pary słowo, timestamp albo obiekt
    }
}