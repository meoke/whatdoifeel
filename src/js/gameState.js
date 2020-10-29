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
}

export default GameState