import $ from "jquery";

const elements = {
    gameContainer: $('#gameContainer'),
    gameInstruction: $('#instruction'),
    toggleGameBtn: $('#toggleGameBtn'),
    inputGameText: $('#angerInput'),
    lastHueInfo: $('#lastHueInfo'),
    gameResult: $('#gameResult'),

    angerHeader: $("#angerHeader"),
    disgustHeader: $("#disgustHeader"),
    fearHeader: $("#fearHeader"),
    happyHeader: $("#happyHeader"),
    sadnessHeader: $("#sadnessHeader"),

    angerColumn: $("#angerColumn"),
    disgustColumn: $("#disgustColumn"),
    fearColumn: $("#fearColumn"),
    happyColumn1: $("#happyColumn1"),
    happyColumn2: $("#happyColumn2"),
    sadnessColumn: $("#sadnessColumn"),
};

class EvaluationView {
    constructor() {

    }

    bindStartEvaluation(handler) {

    }

    bindRestartEvaluation(handler) {
        handler();
    }

    bindInputChange(handler) {
        elements.inputGameText.on('input', event => {
            const inputValue = event.target.value;
            if(_.isEmpty(inputValue))
                return;
            handler(inputValue);
        }
    }


}