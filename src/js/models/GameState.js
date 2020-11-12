import EmotionWord from './EmotionWord'

export class GameState{
    constructor(){
        this.emotionWords = []
    }

    addEmotionWord(emotionWord) {
        if (!(emotionWord instanceof EmotionWord)){
            throw TypeError("GameState/addEmotionWord expects EmotionWord type.")
        }
        this.emotionWords.push(emotionWord)
    }

    getInputAtReversedIdx(idx) {
        if(idx > this.emotionWords.length) {
            throw Error(`Provided index is too big. Max: ${this.emotionWords.length}.`)
        }
        if(idx <= 0) {
            throw Error('Provided index must be > 0.')
        }
        return this.emotionWords[this.emotionWords.length - idx]
    }
}

export default GameState