import {createGame, GameInput} from './models/Game'

import * as gameView from './views/game';
import { elements } from './views/base';
import '../css/style.css';

let game;

elements.startGameBtn.on('click', async () => {
    try {
        game = await createGame();
        gameView.activateGameInput();
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