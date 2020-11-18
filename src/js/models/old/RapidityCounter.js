import GameState from './GameState'

export class RapidityCounter {
    getLastInputScore(gameState) {
        if (!(gameState instanceof GameState)){
            throw TypeError("RapidityCounter/getScore accepts GameState only.")
        }
        if (gameState.inputs.length === 0 || gameState.inputs.length === 1) {
            return 0
        }
        const lastTimeStamp = gameState.inputs[gameState.inputs.length-1].timestamp
        const beforeLastTimeStamp = gameState.inputs[gameState.inputs.length-2].timestamp
        const differenceMiliSec = lastTimeStamp - beforeLastTimeStamp
        const score = differenceMiliSec <= 0 ? 0 : Math.floor(10000/differenceMiliSec)
        return score
    }
}

export default RapidityCounter