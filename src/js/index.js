import $ from "jquery";

import '../css/style.css';
import '../css/skeleton.css';
import '../css/normalize.css';

import Controller from './controller';
import {EmotionalStateEvaluationFactory} from './models/EmotionalStateEvaluation';
import {EmotionalStateEvaluationView} from './views/Evaluation';

_setupEventHandlers();

const evaluationModelFactory = new EmotionalStateEvaluationFactory();
const evaluationView = new EmotionalStateEvaluationView();
const app = new Controller(evaluationModelFactory, evaluationView);

function _setupEventHandlers() {
    $('.closebtn').on('click', () => {
        $("#aboutContainer").hide("slow", () => {
            $("#aboutButton").show("slow");
        });
    });
    
    $('#aboutButton').on('click', () => {
        $("#aboutButton").hide("slow");
        $( "#aboutContainer" ).show("slow");
    });
}