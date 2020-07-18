import x from './test';
import '../css/style.css';

function showRelief() {
    const input = document.getElementById("angerInput");
    const inputLength = input.value.length;
    
    const relief = document.getElementById("relief");
    relief.textContent = inputLength;
}
  
const el = document.getElementById("angerInput");
el.addEventListener("keyup", showRelief);