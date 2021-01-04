import $ from "jquery";

import '../css/style.css';
import '../css/skeleton.css';
import '../css/normalize.css';

import Controller from './Controller'
import {EmotionalStateEvaluationFactory} from './models/EmotionalStateEvaluation'
import {Evaluation as EvaluationView} from './views/Evaluation'

_setupEventHandlers();

const evaluationModelFactory = new EmotionalStateEvaluationFactory();
const evaluationView = new EvaluationView();
const app = new Controller(evaluationModelFactory, evaluationView);

function _setupEventHandlers() {
    $('.closebtn').on('click', e => {
        document.getElementById("aboutContainer").style.width = "0";
        document.getElementById("evaluationContainer").style.marginLeft = "0";
        document.getElementById("aboutContainer").style.left = "-40px";
    })
    
    $('#aboutButton').on('click', e => {
        document.getElementById("aboutContainer").style.width = "350px";
        document.getElementById("aboutContainer").style.left = "0px";
        document.getElementById("evaluationContainer").style.marginLeft = "350px";
    })
}