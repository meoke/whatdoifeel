// prędkość słów -> pulsowanie kropki na końcu miarki?
// treść -> kolor 
// ogólnie narzucony z góry limit znaków, a jego zużycie reprezentuje miarka


export default class ReliefTracker{
    constructor(maxLength) {
        this.word = '';
        this.velocity = 0;
        this.maxLength = maxLength;
        this.relief = this.calculateRelief();
    }

    calculateRelief(){
        return parseInt(this.word.length / this.maxLength) * 100;
    }
}
