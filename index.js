// window.onload = function () {
//   document.getElementById("audio_intro").play();
// };
const buttonElement = document.getElementById("intro-button");
const buttonElement2 = document.getElementById("intro-button2");
const backgroundElement = document.getElementById("background-intro");
const wrapperElement = document.getElementById("wrapper-cards");
const bgElement = document.getElementById("background-game");
// const audioElement = document.getElementById("howling");
// let audio_howling = new Audio("./images/howling.wav");
// let audio_intro = new Audio("./images/intro.wav");

buttonElement.addEventListener("click", hideIntro);
buttonElement2.addEventListener("click", playIntro);

 function playIntro() {
   console.log("working");
   document.getElementById("audio_intro").play();
 }

function hideIntro() {
  backgroundElement.style.opacity = "0";
  wrapperElement.style.opacity = "1";
  bgElement.style.opacity = "1";
  // audio_howling.play();
  setTimeout(function () {
    backgroundElement.style.display = "none";
  }, 2000);
  setTimeout(function () {
    wrapperElement.style.display = "block";
    shuffle();
  }, 4000);
}

const cardElement = document.querySelectorAll(".memory-card");
const testEle = document.getElementById("testing");

let moves = 0;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flip");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1500);
}
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function shuffle() {
  cardElement.forEach((card) => {
    let randomPosition = Math.floor(Math.random() * 20);
    card.style.order = randomPosition;
  });
}

// (function shuffle() {
//   cardElement.forEach((card) => {
//     let randomPosition = Math.floor(Math.random() * 20);
//     card.style.order = randomPosition;
//   });
// })();

function startOver() {
  shuffle();
  console.log("workingg");
}

cardElement.forEach((card) => card.addEventListener("click", flipCard));
testEle.addEventListener("click", startOver);
