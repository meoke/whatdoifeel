export class GameState{
    constructor(){
        this.points = 0
        this.words = []
    }

    addPoints(points) {
        if (typeof points !== "number"){
            throw TypeError("GameState/AddPoints expects numbers only.")
        }
        this.points += points
    }

    addInput(input) {
        if (typeof input !== "GameInput"){
            throw TypeError("GameState/AddInput expects GameInput type.")
        }
        this.words.push(input)
    }
}

export default GameState