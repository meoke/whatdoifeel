# What Do I Feel
[![Build Status](https://travis-ci.org/meoke/whatdoifeel.svg?branch=master)](https://travis-ci.org/meoke/whatdoifeel.svg?branch=master)

## Idea

What Do I Feel is a webpage written for Polish language users who'd like to practise the skill of expressing their emotions.

Your emotional state is detected based on the text you provide on the website. It is visualised as color dots/asterisks appearing above the input field and the changes of website title's color.

![](howtouse.gif)


The website is available at [https://coterazczuje.netlify.app](https://coterazczuje.netlify.app) or you can run in it locally (more information below).

## Technical info

- JS: Vanilla JavaScript + jQuery
- JS tests: tape
- JS bundler: Webpack 
- CSS: Skeleton
- Stemmer: [stemmer_pl](https://www.npmjs.com/package/stemmer_pl)

### Run locally

``` 
git clone https://github.com/meoke/whatdoifeel.git
cd whatdoifeel
npm install
npm run start
```
Go to `localhost:8080` and use the site.

### How does it work?

**Dictionaries**

Here are the official sources (copied also to './dictionaries directory):
- [Stop-words](https://github.com/bieli/stopwords/blob/master/polish.stopwords.txt)
- [Vulgar words](http://marcinmazurek.com.pl/polskie-wulgaryzmy)
- [Nencki Affective Word List](https://exp.lobi.nencki.gov.pl/nawl-analysis) - words with basic emotions (anger, happiness, disgust, sadness, fear) assigned to them
- [Emotions by M.Rosenberg](http://bakcylwiedzy.pl/wp-content/uploads/2015/09/lista-uczu%C4%87_M.Rosenberg.pdf) - suggestions of words expressing our emotions

**Assessment** 

Every word from the user goes through some steps:
- Extract stem using Polish stemmer;

- Is it a stopword/vulgar/rosenberg defined/nencki defined word?;

- What emotion does it represent: anger/disgust/fear/happiness/sadness?;

- How strong is this emotion on a scale 0-7?;

**Examples**

spanikowana -> spanikow -> rosenberg -> 6

jeż -> jeż -> Nencki -> 4.07

**Visualisation**

Based on all the words from user an assessment of his/her Emotional State is presented as a colorful visualisation.

Every new word adds a colored dot on the page (the color depends on the emotion derived from the word). Every new vulgar word adds an asterisk to the visualisation. 

The overall emotional state influences the website's title color.