import $ from "jquery";

import '../css/style.css';
import '../css/skeleton.css';
import '../css/normalize.css';

import Controller from './controller'
import {EmotionalStateEvaluationFactory} from './models/EmotionalStateEvaluation'
import {Evaluation as EvaluationView} from './views/Evaluation'

_setupEventHandlers();

const evaluationModelFactory = new EmotionalStateEvaluationFactory();
const evaluationView = new EvaluationView();
const app = new Controller(evaluationModelFactory, evaluationView);

function _setupEventHandlers() {
    $('.closebtn').on('click', e => {
        $("#aboutContainer").hide("slow", () => {
            $("#aboutButton").show("slow");
        });
    })
    
    $('#aboutButton').on('click', e => {
        $("#aboutButton").hide("slow");
        $( "#aboutContainer" ).show("slow");
    })
}