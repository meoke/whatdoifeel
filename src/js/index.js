import _ from 'underscore';
import config from './config'

import '../css/style.css';
import '../css/skeleton.css';
import '../css/normalize.css';

import Controller from './Controller'
import {EvaluationFactory} from './models/Evaluation'
import {EvaluationView} from './views/EvaluationView'

const modelFactory = new EvaluationFactory();
const view = new EvaluationView();
console.log(modelFactory, view)
let app;
try{
    app = new Controller(modelFactory, view);
}
catch(e){
    config.mode === "production" ?
    window.location.replace(window.location.host + "/error.html") :
    console.error(`Game creation or refresh issue: ${e.message}`);
}



// import {Evaluation, EvaluationInput} from './models/Evaluation'

// import * as gameView from './views/game';
// import { elements } from './views/base';



// let evaluation;
// let evaluationIsRunning = false;


// elements.toggleGameBtn.on('click', async () => {
//     try {
//         if(evaluationIsRunning){
//             evaluation.clearState();
//             gameView.clearGameInput();
//         }
//         else{
//             evaluation = await Evaluation.createEvaluation();
//             gameView.activateGameInput();
//             gameView.toggleBtnToRestartGame();
//             gameView.showRosenbergWords(evaluation.RosenbergWords);
//             evaluationIsRunning = true;
//         }
//         gameView.renderGameScore(evaluation.EmotionalStateHSV);
//     }
//     catch(e){
//         if(config.mode === "production") {
//             gameView.renderError(`Nie można teraz uruchomić gry.`);
//         }
//         else{
//             console.error(`Game creation or refresh issue: ${e.message}`);
//         }
//     }
// })

