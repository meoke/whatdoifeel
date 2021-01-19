import $ from "jquery";

import '../css/normalize.css';
import '../css/skeleton.css';
import '../css/style.css';

import {Controller} from './Controller';
import {EmotionalStateEvaluationFactory} from './models/EmotionalStateEvaluation';
import {EmotionalStateEvaluationView} from './views/EmotionalStateEvaluation';

_setupEventHandlers();

const evaluationModelFactory = new EmotionalStateEvaluationFactory();
const evaluationView = new EmotionalStateEvaluationView();
const app = new Controller(evaluationModelFactory, evaluationView);  // eslint-disable-line no-unused-vars

(async () => {
    await app.start();

})().catch(e => {
    app.showError("Nie można uruchomić aplikacji...", e.message);
});


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