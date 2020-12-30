import { RatedWordsReference } from "./RatedWordsReference";
import { EmotionalState, WordTypes } from "./EmotionalState";
import * as wordsProvider from './RatedWordsProvider.js'

export class EmotionalStateEvaluationFactory {
    async createEvaluation(onStateChangeCallback) {
        const e = new EmotionalStateEvaluation();
        e.state = new EmotionalState()
        e.ratedWordsRef = await this._buildEmoReference();
        e.onEmotionalStateChange = onStateChangeCallback;
        return e;
    }

    async _buildEmoReference() {
        const _stopwords = wordsProvider.getStopWords()
        const _vulgarwords = wordsProvider.getVulgarWords()
        const _nawlWords = wordsProvider.getNAWLWords()
        const _rosenbergWords = wordsProvider.getRosenbergWords()
        const [stopwords,vulgarwords,nawlWords,rosenbergWords] = await Promise.all([_stopwords, _vulgarwords, _nawlWords, _rosenbergWords])

        return new RatedWordsReference(stopwords, vulgarwords, nawlWords, rosenbergWords)
    }
}

class EmotionalStateEvaluation {
    get EmotionalStateHSV() {
        return this.state.getEmotionStateAsHSVColor()
    }

    get RosenbergWords() {
        return this.ratedWordsRef.entries.filter(emoStem => 
                                                 emoStem.type === WordTypes.rosenberg)
    }

    addFeeling(word) {
        const emotionalCharge = this.ratedWordsRef.getEmotionalCharge(word);
        this.state.addEmotionalCharge(emotionalCharge);
        this._emotionalStateChanged();
    }

    restartEvaluation() {
        this.state = new EmotionalState();
        this._emotionalStateChanged();
    }

    _emotionalStateChanged() {
        this.onEmotionalStateChange(this.state.getEmotionStateAsHSVColor());
    }
}

export default EmotionalStateEvaluation;