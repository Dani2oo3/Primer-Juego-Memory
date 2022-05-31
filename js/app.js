// Sintaxis JQUERY: https://stackoverflow.com/questions/4069982/document-getelementbyid-vs-jquery
// document.getElementById('contents'); //returns a HTML DOM Object
// var contents = $('#contents');  //returns a jQuery Object

// number of movements to hide each star
var STARS_LEVEL = [15, 25, 35]; 
//var STARS_LEVEL = [2, 4, 6];
/*
 * Create a list that holds all of your cards
 */
let arrayPrueba = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"];
const ARRAYLLENO = arrayPrueba.concat(arrayPrueba);
let cont = 0;
let initTime = new Date().getTime()/1000;



// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// generates LI items inside UL with board id. Shuffle them and create each card.
function createBoard() {
    arrayFinish = shuffle(ARRAYLLENO);
    for(let i = 0; i < arrayFinish.length; i++){
        $('#board').append(createCard(i, arrayFinish[i]));
    }
}

// generates LI items inside UL with stars id.
function createStars() {
    for (let i = STARS_LEVEL.length; i > 0; i--){
        $('#stars').append(createStar(i - 1));
    }
}

// creates the LI for one star
function createStar(index) {
    return "<li><span class='fa fa-star' id = 'star" + index + "'></span></li>";
}

// init variables for a new game
function initCounters() {
    initTime = new Date().getTime()/1000
    guessed = 0;
    moves = 0;
    starsCounter = STARS_LEVEL.length;
}

// adds listeners for cards and reset button
function addListeners() {
    // it depends on where the user clicks we got the event on the span or the li element.
    $('#board').on('click', 'span', function(event) {
        event.stopPropagation();
        manageMovement(event.target.parentElement);
    });
    $('#board').on('click', 'li', function(event) {
        event.stopPropagation();
        manageMovement(event.target);
    });
    $('.restart').on('click', 'span', function(event) {
        restartGame();
    })
}

let openedCard;
// manages user movement, for both span or li events.
function manageMovement(card) {
    showCard(card);
    if (openedCard == null) {
        // first clicked card
        openedCard = card;
    } else {
        incrementMoves();
        // second clicked card
        if (getSymbolFromId(card) === getSymbolFromId(openedCard)) {
            // matching cards
            lockCards(card, openedCard);
        } else {
            // no matching cards
            hideCards(card, openedCard);
        }
        openedCard = null;
    }
}

// prepares card id using index and symbol
function generateId(index, symbol) {
    return "card" + index + "_" + symbol;
}

// extracts symbol from card id
function getSymbolFromId(card) {
    return card.id.substring(card.id.indexOf('_')+1);
}

// creates the LI for one card, with card<index>_<symbol> as id, and the symbol as content.
function createCard(index, symbol) {
   return "<li class='card' id = 'card" + index + "_" + symbol + "'> <span class='fa fa-" + symbol + "'></span></li>";
}

 // makes a card visible
function showCard(card) {
    console.log(card);
    // class shows makes the icon visible. class open changes background color.
    $('#' + card.id).toggleClass("show open");
}

// keeps a card visible after matching
function showMatchedCard(card) {
    $('#' + card.id).toggleClass("match");
}

// shows matched cards and does necessary business to control the end of the game
var newCont = 0;
function lockCards(card1, card2) {
    showMatchedCard(card1);
    showMatchedCard(card2);
    newCont++;
    gameFinished();
}

// shows failed color, and half a second later, hides the card
function showFailedCard(card) {
        $('#' + card.id).toggleClass("failed");
}

// hides the two cards
function hideCards(card1, card2) {
    showFailedCard(card1);
    showFailedCard(card2);
    setTimeout(function() {
        $('#' + card1.id).toggleClass("failed show open");
        $('#' + card2.id).toggleClass("failed show open");
    }, 500);
}

// increments movement counter, updates UI: number of movements and stars
function incrementMoves() {
    cont++;
    let contMoves = document.getElementById("counter");
    contMoves.innerHTML = cont;

    for (let i = 0; i < STARS_LEVEL.length; i++) {
        if (cont == STARS_LEVEL[i]){
         $('#star' + i).toggleClass("fa-star-o fa-star");
         starsCounter--;
        }
    }
}

// formats seconds to mm:ss
// method taken from https://stackoverflow.com/a/17781037
function formatSeconds(seconds)
{
    var date = new Date(1970, 0, 1);
    date.setSeconds(seconds);
    return date.toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
}

// calculates the number of seconds from initTime to now
function getSeconds() {
    let newTime = new Date().getTime()/1000;
    return newTime - initTime;
}

// updates timer with current seconds, every second
function updateTimer() {
    document.getElementById('timer').innerHTML = (formatSeconds(getSeconds()));
}

// stops timer
function stopTimer() {
    clearTimeout(timerTimeOut);
}

// shows timer, starting its update loop
 var interval;
function showTimer() {
    interval = setInterval(updateTimer,1000);
}

function restartGame() {
location.reload();
}

function gameFinished() {
    if (newCont >= arrayPrueba.length) {
        let res = window.confirm('Congratulations!!! You have won with ' + cont + ' movements in ' + formatSeconds(getSeconds()) + ' . You are a ' + starsCounter + ' stars player!! \n Do you want to play again?' )
        if (res) {
           location.reload(); 
        } else { 
            clearInterval(interval);
            window.location.assign('https://www.youtube.com/watch?v=1q6Swwvp5qk');
        }
    }
}

// inits a new game
function initGame() {
    createBoard();
    createStars();
    initCounters();
    addListeners();
    showTimer();
}

initGame();