import createGame from './models/Game'
// import GameInput from './models/GameInput';

import * as gameView from './views/game';
import { elements } from './views/base';
import GameInput from './models/GameInput';

let game;

elements.startGameBtn.addEventListener('click', async () => {
    try {
        game = await createGame();
        gameView.activateGameInput();
        gameView.renderGameScore(game.state);
    }
    catch {
        gameView.renderError("Problem z uruchomieniem gry.");
    }
})

elements.inputGameText.addEventListener('keyup', event => {
    if(event.keyCode !== 32){
        return;
    }
    const currentTime = new Date()
    const lastWord = gameView.extractLastWord(event.target.value)
    const score = game.sendInput(new GameInput(lastWord, currentTime))
    gameView.renderGameScore(game.State)
    gameView.renderLastScore(score)
})
