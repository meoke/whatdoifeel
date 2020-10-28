export class RapidityCounter {
    constructor() {
        this.lastTimeStamp = new Date(0)
    }

    getScore(timestamp) {
        const differenceMiliSec = timestamp - this.lastTimeStamp
        this.lastTimeStamp = timestamp
        return differenceMiliSec <= 0 ? 10000 : Math.floor(10000/differenceMiliSec)
    }
}

export default RapidityCounter