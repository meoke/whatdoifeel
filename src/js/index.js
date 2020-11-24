import {createGame, GameInput} from './models/Game'

import * as gameView from './views/game';
import { elements } from './views/base';
import '../css/style.css';
import '../css/skeleton.css';
import '../css/normalize.css';

import _ from 'underscore';

let game;
let gameIsRunning = false;

elements.toggleGameBtn.on('click', async () => {
    try {
        if(gameIsRunning){
            game.clearState();
            gameView.clearGameInput();
        }
        else{
            game = await createGame();
            gameView.activateGameInput();
            gameView.toggleBtnToRestartGame();
            gameView.showRosenbergWords(game.RosenbergWords);
            gameIsRunning = true;
        }
        gameView.renderGameScore(game.EmotionalStateHSV);
    }
    catch {
        gameView.renderError("Problem z uruchomieniem gry.");
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

    console.log(lastWord)
    const hue = game.sendInput(new GameInput(lastWord, currentTime))
    gameView.renderLastScore(hue)
    gameView.renderGameScore(game.EmotionalStateHSV);
})