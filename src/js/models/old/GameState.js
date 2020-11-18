import EmotionWord from '../EmoElement'

export class GameState{
    constructor(){
        this.emotionalWords = []
    }

    addEmotionWord(emotionWord) {
        if (!(emotionWord instanceof EmotionWord)){
            throw TypeError("GameState/addEmotionWord expects EmotionWord type.")
        }
        this.emotionalWords.push(emotionWord)
    }

    getInputAtReversedIdx(idx) {
        if(idx > this.emotionalWords.length) {
            throw Error(`Provided index is too big. Max: ${this.emotionalWords.length}.`)
        }
        if(idx <= 0) {
            throw Error('Provided index must be > 0.')
        }
        return this.emotionalWords[this.emotionalWords.length - idx]
    }
}

export default GameState