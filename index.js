const buttonElement = document.getElementById("intro-button");
const backgroundElement = document.getElementById("background-intro");
const wrapperElement = document.getElementById("wrapper-cards");
const bgElement = document.getElementById("background-game");
// const audioElement = document.getElementById("howling");
let audio = new Audio("./images/howling.wav");

buttonElement.addEventListener("click", hideIntro);

function hideIntro() {
  backgroundElement.style.opacity = "0";
  wrapperElement.style.opacity = "1";
  bgElement.style.opacity = "1";
  audio.play();
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
