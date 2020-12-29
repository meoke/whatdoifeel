import _ from 'underscore';

import '../css/style.css';
import '../css/skeleton.css';
import '../css/normalize.css';

import config from './config'
import Controller from './controller'
import {EvaluationFactory} from './models/Evaluation'
import {EvaluationView} from './views/EvaluationView'

const model = EvaluationFactory.createEvaluation();
const view = EvaluationView();
const controller = new Controller(model, view);


import {Evaluation, EvaluationInput} from './models/Evaluation'

import * as gameView from './views/game';
import { elements } from './views/base';



let evaluation;
let evaluationIsRunning = false;


elements.toggleGameBtn.on('click', async () => {
    try {
        if(evaluationIsRunning){
            evaluation.clearState();
            gameView.clearGameInput();
        }
        else{
            evaluation = await Evaluation.createEvaluation();
            gameView.activateGameInput();
            gameView.toggleBtnToRestartGame();
            gameView.showRosenbergWords(evaluation.RosenbergWords);
            evaluationIsRunning = true;
        }
        gameView.renderGameScore(evaluation.EmotionalStateHSV);
    }
    catch(e){
        if(config.mode === "production") {
            gameView.renderError(`Nie można teraz uruchomić gry.`);
        }
        else{
            console.error(`Game creation or refresh issue: ${e.message}`);
        }
    }
})

elements.inputGameText.on('input', event => {
    

    const inputVal = event.target.value
    if(_.isEmpty(inputVal))
        return;

    

    
    gameView.renderLastScore(emotion)
    const HSV = evaluation.EmotionalStateHSV
    gameView.renderGameScore(HSVtoHSL(HSV.H, HSV.S/100, (80+HSV.V)/100));
})

// H from [0,360], S from [0,1], V from [0,1]
/**
 * HSVtoHSL takes Hue, Saturation and Value values from HSV color model.
 * It converts the color to HSL model.
 * The return value is object with properties corresponding to Hue, Saturation and Lightness from HSL color model.
 * @param {number} H - Hue from range [0,360]
 * @param {number} S - Saturation from range [0,1]
 * @param {number} V - Value from range [0,1]
 * @returns {object} Object with properties H, S and L from HSL model.
 */
function HSVtoHSL(H, S, V) {
    const HSL_hue = H;
    const HSL_lightness = V*(1-S/2);
    let HSL_saturation;
    if(HSL_lightness === 0 || HSL_lightness === 1){
        HSL_saturation = 0
        console.log("zero")
    }
    else {
        const a = V-HSL_lightness
        const b = _.min([HSL_lightness, 1-HSL_lightness])
        console.log(a, b)
        HSL_saturation = a / b
    }
    // const HSL_saturation = (HSL_lightness === 0 || HSL_lightness === 1) ?
    //                         0 :
    //                         (V-HSL_lightness) / _.min(HSL_lightness, 1-HSL_lightness)
    console.log(H, S, V, "->", HSL_hue, HSL_saturation, HSL_lightness)
    return {
        H: HSL_hue,
        S: HSL_saturation,
        L: HSL_lightness
    }
}