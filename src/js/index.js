// import '../css/style.css';
// import Game from './game';
// import getFileStream from './fileStreamProvider';

const { default: Game } = require("./game");

// const fstream = getFileStream("stopwords_PL.txt").then(data => {
//     console.log(data)
// })
// fstream()
// console.log(fstream.text())

// function showRelief() {
//     const input = document.getElementById("angerInput");
//     const inputLength = input.value.length;
    
//     const relief = document.getElementById("relief");
//     relief.textContent = inputLength;
// }

function initGame() {
    const game = new Game()
}