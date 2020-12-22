import {Evaluation, EvaluationInput} from './models/Evaluation'

import * as gameView from './views/game';
import { elements } from './views/base';
import config from './config'

import '../css/style.css';
import '../css/skeleton.css';
import '../css/normalize.css';

import _ from 'underscore';

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
    const wordsSeparators = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\s]/g;

    const isWordSeparator = char => char.match(wordsSeparators)


    const getLastOfNotEmptyStr = iterable => iterable[iterable.length - 1]

    const inputVal = event.target.value
    if(_.isEmpty(inputVal))
        return;

    const lastChar = getLastOfNotEmptyStr(inputVal)
    if(!isWordSeparator(lastChar))
        return;

    const getLastWord = str => {
        const words = str.split(wordsSeparators).filter(a=>a)
        return _.last(words);
    }

    const currentTime = new Date()
    const lastWord = getLastWord(inputVal);

    const emotion = evaluation.sendInput(new EvaluationInput(lastWord, currentTime))
    gameView.renderLastScore(emotion)
    gameView.renderGameScore(evaluation.EmotionalStateHSV);
})