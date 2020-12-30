import $ from "jquery";
import 'jquery-color';
import _ from 'underscore';

export class EvaluationView {
    constructor() {
        this.elements = {
            evaluationContainer: $('#evaluationContainer'),
            evaluationInstruction: $('#instruction'),
            startEvaluationBtn: $('#startEvaluationBtn'),
            restartEvaluationBtn: $('#restartEvaluationBtn'),
            feelingsInput: $('#feelingsInput'),
            rosenbergFeelings: $('#rosenbergFeelings'),
        
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
        }
    }

    bindStartEvaluationBtn(handler) {
        this.elements.startEvaluationBtn.on('click', () => {
            handler();
        })
    }

    bindRestartEvaluationBtn(handler) {
        this.elements.restartEvaluationBtn.on('click', () => {
            handler();
        })
    }

    bindFeelingsInputChange(handler) {
        this.elements.feelingsInput.on('input', event => {
            const inputValue = event.target.value;
            if(_.isEmpty(inputValue))
                return;
            handler(inputValue);
        })
    }

    renderErrorMessage(errorMessage) {
        const markup = `<h2>Wystąpił błąd...</h2>
                        <p>${errorMessage}</p>
                        <p>Odśwież stronę i spróbuj ponownie!</p>`
        this.elements.evaluationContainer.html(markup);
    }

    activateFeelingsInput() {
        this.elements.feelingsInput.prop('disabled', false);
        this.elements.feelingsInput.focus();
    }

    replaceStartBtnWithRestartBtn () {
        this.elements.startEvaluationBtn.hide();
        this.elements.restartEvaluationBtn.css('display', 'block');
    }

    showRosenbergWords (rosenbergWords) {
        // const pies = (rosenbergWords, type) => {
        //     const a = rosenbergWords.filter(w => w.hue === type)
        //     return a.map(hw => $( "<span/>", {
        //         "text": hw.originalWord,
        //         "style": "display: block"
        //     }))
        // }

        // elements.angerColumn.append(pies(rosenbergWords, Emotions.Anger));
        // elements.disgustColumn.append(pies(rosenbergWords, Emotions.Disgust));
        // elements.fearColumn.append(pies(rosenbergWords, Emotions.Fear));
        // elements.sadnessColumn.append(pies(rosenbergWords, Emotions.Sadness));
        
        // const happySpans = pies(rosenbergWords, Emotions.Happy)
        // const halfLength = Math.floor(happySpans.length/2)
        // const happyPart1 = happySpans.slice(0, halfLength)
        // const happyPart2 = happySpans.slice(halfLength)
        // elements.happyColumn1.append(happyPart1);
        // elements.happyColumn2.append(happyPart2);
    }

    clearFeelingsInput() {
        this.elements.feelingsInput.val("");
    }

    renderEmotionalState(H, S, L) {
        const color = $.Color({ hue: H, saturation: S, lightness: L})
        this.elements.feelingsInput.animate( {
            borderBottomColor: color,
            borderLeftColor: color,
            borderRightColor: color,
            borderTopColor: color
        }, 1500 );
    }

    renderEmotion(emotion) {
        console.log(emotion);
        // let elToAnimate;
        // switch(lastHue){
        //     case Emotions.Anger:
        //         elToAnimate = elements.angerHeader;
        //         break;
        //     case Emotions.Disgust:
        //         elToAnimate = elements.disgustHeader;
        //         break;
        //     case Emotions.Fear:
        //         elToAnimate = elements.fearHeader;
        //         break;
        //     case Emotions.Happy:
        //         elToAnimate = elements.happyHeader;
        //         break;
        //     case Emotions.Sadness:
        //         elToAnimate = elements.sadnessHeader;
        //         break;
        //     default:
        //         return
        // }
    
        // elToAnimate.addClass("bold")
        // setTimeout(() => {
        //     elToAnimate.addClass("unbold")
        //     elToAnimate.removeClass("bold")
        //     elToAnimate.removeClass("unbold")
        // }, 500)}
    }
}