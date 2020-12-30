import config from './config'

import '../css/style.css';
import '../css/skeleton.css';
import '../css/normalize.css';

import Controller from './Controller'
import {EmotionalStateEvaluationFactory} from './models/EmotionalStateEvaluation'
import {Evaluation as EvaluationView} from './views/Evaluation'

const evaluationModelFactory = new EmotionalStateEvaluationFactory();
const evaluationView = new EvaluationView();
const app = new Controller(evaluationModelFactory, evaluationView);