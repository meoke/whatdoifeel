import GameInput from './gameInput'

export class GameState{
    constructor(){
        this.points = 0
        this.inputs = []
    }

    addPoints(points) {
        if (typeof points !== "number"){
            throw TypeError("GameState/AddPoints expects numbers only.")
        }
        this.points += points
    }

    addInput(gameInput) {
        if (!(gameInput instanceof GameInput)){
            throw TypeError("GameState/AddInput expects GameInput type.")
        }
        this.inputs.push(gameInput)
    }

    getInputAtReversedIdx(idx) {
        if(idx > this.inputs.length) {
            throw Error(`Provided index is too big. Max: ${this.inputs.length}.`)
        }
        if(idx <= 0) {
            throw Error('Provided index must be > 0.')
        }
        return this.inputs[this.inputs.length - idx]
    }
}

export default GameState