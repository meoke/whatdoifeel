import {createGame, GameInput} from './models/Game'

import * as gameView from './views/game';
import { elements } from './views/base';
import '../css/style.css';
import '../css/skeleton.css';
import '../css/normalize.css';

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

elements.inputGameText.on('keyup', event => {
    if(event.key !== ' '){
        return;
    }
    const currentTime = new Date()
    const lastWord = gameView.extractLastWord(event.target.value)
    const hue = game.sendInput(new GameInput(lastWord, currentTime))
    gameView.renderLastScore(hue)
    gameView.renderGameScore(game.EmotionalStateHSV);
})