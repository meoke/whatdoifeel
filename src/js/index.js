import config from './config'

import '../css/style.css';
import '../css/skeleton.css';
import '../css/normalize.css';

import Controller from './Controller'
import {EmotionalStateEvaluationFactory} from './models/EmotionalStateEvaluation'
import {EvaluationView} from './views/EvaluationView'

const modelFactory = new EmotionalStateEvaluationFactory();
const view = new EvaluationView();

let app;
try{
    app = new Controller(modelFactory, view);
}
catch(e){
    config.mode === "production" ?
    window.location.replace(window.location.host + "/error.html") :
    console.error(`Game creation or refresh issue: ${e.message}`);
}