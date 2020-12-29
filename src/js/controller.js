export class Controller {
    constructor(evaluationModel, evaluationView) {
        this.evaluationModel = evaluationModel;
        this.evaluationView = evaluationView;

        this.evaluationView.bindInputChange(this.onInputChange);
        this.evaluationModel.bindStateChange(this.onStateChange);
    }

    startEvaluation() {

    }

    onInputChange(inputValue) {
        const wordsSeparators = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\s]/g;

        const isWordSeparator = char => char.match(wordsSeparators)

        const getLastOfNotEmptyStr = iterable => iterable[iterable.length - 1]

        const lastChar = getLastOfNotEmptyStr(inputValue)
        if(!isWordSeparator(lastChar))
            return;

        const getLastWord = str => {
            const words = str.split(wordsSeparators).filter(a=>a)
            return _.last(words);
        }

        const currentTime = new Date()
        const lastWord = getLastWord(inputValue);

        this.evaluationModel.sendInput(lastWord, currentTime);
    }

    onStateChange(HSV) {
        this.evaluationView.renderGameScore(HSV);
    }

    restartEvaluation() {

    }
}

export default Controller;