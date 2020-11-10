import createGame from './models/Game'
import GameInput from './models/GameInput';

import * as gameView from './views/game';
import { elements } from './views/base';

let game;

elements.startGameBtn.on('click', async () => {
    try {
        game = await createGame();
        gameView.activateGameInput();
        gameView.renderGameScore(game.state);
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
    const score = game.sendInput(new GameInput(lastWord, currentTime))
    gameView.renderLastScore(score)
    if(game.IsFinished) {
        gameView.renderGameFinish(game.State)
    }
    else {
        gameView.renderGameScore(game.State)
    }
})
