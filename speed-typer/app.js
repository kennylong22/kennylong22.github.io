const QUOTE_API_URL = 'https://api.quotable.io/random';

const timer = document.querySelector('.timer');
const quoteDisplay = document.querySelector('.quote-display');
const quoteInput = document.querySelector('.quote-input');

const score = document.querySelector('.score');
const avgTime = document.querySelector('.average-time');
const wordsPerMin = document.querySelector('.words-per-min');

const introScreen = document.querySelector('.intro-screen');
const game = document.querySelector('.game');

const btns = document.querySelectorAll('.intro-screen-btns--btn');
const btnShort = document.querySelector('.intro-screen-btns--btn__short');
const btnMed = document.querySelector('.intro-screen-btns--btn__med');
const btnLong = document.querySelector('.intro-screen-btns--btn__long');

const modalOverlay = document.querySelector('.modal-overlay');
const modalScore = document.querySelector('.modal--score');
const modalAvgTime = document.querySelector('.modal--average-time');
const modalWordsPerMin = document.querySelector('.modal--words-per-minute');
const modalCloseBtn = document.querySelector('.modal--close-btn');

// start new game when one of these btns gets clicked
btns.forEach((btn) => {
    btn.addEventListener('click', () => {
        introScreen.classList.add('disabled');
        game.classList.remove('disabled');
        renderQuote();
    })
})

// each btn determines how many quotes the user will type
btnShort.addEventListener('click', (e) => {
    startGame(3);
});

btnMed.addEventListener('click', (e) => {
    startGame(5);
});

btnLong.addEventListener('click', (e) => {
    startGame(10);
});

let totalScore;
let gameLength;
let initialTime;
let totalWordsTyped;

// initial values for each new game
function startGame(numPhrases) {
   quoteInput.removeAttribute('disabled');
   quoteInput.focus();
   totalScore = 0;
   gameLength = numPhrases;
   initialTime = new Date();
   totalWordsTyped = 0;
   wordsPerMin.innerText = `--`;
}

// request quote from API
async function getQuote() {
    const res = await axios.get(QUOTE_API_URL);
    const str = res.data.content;
    return str;
}

// render quote onto the page
async function renderQuote() {
    const quote = await getQuote();
    quoteDisplay.innerHTML = '';
    const quoteCharsArr = quote.split('');
    // create a span for each character in the quote
    quoteCharsArr.forEach((char) => {
        const character = document.createElement('span');
        character.innerText = char;
        quoteDisplay.appendChild(character);
    })
    quoteInput.value = null;

    // set timer
    getTimer();
   
    // calculate average time per quote
    getAvgTime();

    // update score
    getScore();
}

// value will be set to new Date() each time a new quote is rendered
let startTime;

function getTimer() {
    // timer will reset to 0 each time a new quote is rendered
    timer.innerText = 0;
    startTime = new Date();
    setInterval(() => {
        // displays how much time has passed since startTime
        timer.innerText = getElapsedTime();
    }, 1000)
}

function getElapsedTime() {
    if (totalScore >= 0) {
        // diff between current time and startTime (in secs)
        return Math.floor((new Date() - startTime) / 1000);
    } else {
        return 0;
    }
}

function getAvgTime() {
    // how much time has passed since the game started
    let totalTime = new Date() - initialTime;
    // average time to type each quote (in secs)
    let averageTime = (totalTime / 1000) / totalScore;
    // if totalScore is 0
    if (averageTime === Infinity) {
        avgTime.innerText = '--';
    } else {
        avgTime.innerText = `${averageTime.toFixed(2)}s`;
        modalAvgTime.innerText = `${averageTime.toFixed(2)}s`;
    }
   
}

function getScore() {
    if (totalScore === 0) {
        score.innerText = '--';
    } else {
        score.innerText = totalScore;
    }
    
    // end game if score matches the gameLength determined by the user
    if (totalScore === gameLength) {
        endGame();
   }
}

function endGame() {
    // open modal
    modalOverlay.classList.add('open-modal');
    modalScore.innerText = totalScore;
    quoteDisplay.innerText = '';
    quoteInput.setAttribute('disabled', '');
    // timer.innerText will only be 0 if totalScore variable is negative (see getElapsedTime function)
    totalScore = -1;
}

// go back to intro screen when modal is closed
modalCloseBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('open-modal');
    introScreen.classList.remove('disabled');
    game.classList.add('disabled');
})


quoteInput.addEventListener('input', () => {
    // creates new array of spans that were previously generated from the quote
    const displayArr = quoteDisplay.querySelectorAll('span');
    // creates new array from characters typed by the user
    const inputArr = quoteInput.value.split('');
    displayArr.forEach((charSpan, idx) => {
        if (inputArr[idx] == null) {
            charSpan.classList.remove('correct');
            charSpan.classList.remove('incorrect');
        }
        // if span in the quote display matches what the user typed
        else if (charSpan.innerText === inputArr[idx]) {
            // span in the quote display will be green
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
        } else {
            // span in the quote display will be red
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct');
        }
    });
    // if user types the complete quote
    if (quoteDisplay.innerText === quoteInput.value) {
        totalScore++;
        // render new quote from API
        renderQuote();
         // get total number of words typed
        getTypedWords(quoteInput.value);
    }
})

// passing in quoteInput.value as the argument only if the quote is correctly typed
function getTypedWords(str) {
    // length of this array will equal the amount of words typed from the user
    const strWordsArr = str.split(' ');
    // update value of totalWordsTyped
    totalWordsTyped += strWordsArr.length;
    let currTime = new Date();
    let timeElapsed = currTime - initialTime;
    // words per ms * 60,000
    let wordsPerMinute = (totalWordsTyped / timeElapsed) * 60000;
    wordsPerMin.innerText = `${wordsPerMinute.toFixed(2)}`;
    modalWordsPerMin.innerText = `${wordsPerMinute.toFixed(2)}`;
}
