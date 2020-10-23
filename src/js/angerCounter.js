const {readFileSync} = require('fs');

let stopwords;
try {
    stopwords = readFileSync('data/stopwords_PL.txt', 'utf-8').split(/\r\n|\n|\r/);
} catch(error) {
    throw error
};

export default function getScore(word) {
    if(isStopword(word)){
        return 0;
    }
    return 10;
}


function isStopword(word) {
    return stopwords.includes(word);
}

export { getScore }
