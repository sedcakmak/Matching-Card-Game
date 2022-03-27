// window.onload = function () {
//   document.getElementById("audio_intro").play();
// };

var music = {
  intro: new Howl({
    src: ["./images/intro4.mp3"],
    loop: true,
    autostart: false,
  }),
};

var sfx = {
  howling: new Howl({
    src: ["./images/howling.wav"],
  }),
  boost: new Howl({
    src: ["https://assets.codepen.io/21542/howler-sfx-levelup.mp3"],
    loop: false,
    onend: function () {
      console.log("Done playing sfx!");
    },
  }),
};

// var sound = new Howl({
//   src: ["./images/intro4.mp3"],
//   loop: true,
// });

const buttonElement = document.getElementById("intro-button");
const buttonElement2 = document.getElementById("intro-button2");
const backgroundElement = document.getElementById("background-intro");
const wrapperElement = document.getElementById("wrapper-cards");
const backtoIntroButton = document.getElementById("back_to_intro");
const bgElement = document.getElementById("background-game");
// const audioElement = document.getElementById("howling");
//let audio_howling = new Audio("./images/howling.wav");
// let audio_intro = new Audio("./images/intro.wav");
const muteButton = document.getElementById("mute_sounds");

backtoIntroButton.addEventListener("click", goBackToIntro);
buttonElement.addEventListener("click", hideIntro);
buttonElement2.addEventListener("click", playIntro);
// muteButton.addEventListener("click", mutePage);

function playIntro() {
  if (!music.intro.playing()) {
    music.intro.play();
  }
}

function hideIntro() {
  backgroundElement.style.opacity = "0";
  wrapperElement.style.opacity = "1";
  bgElement.style.opacity = "1";
  sfx.howling.play();

  var fadeouttime = 1500;
  setTimeout(function () {
    music.intro.fade(1, 0, fadeouttime);
  }, fadeouttime);

  setTimeout(function () {
    backgroundElement.style.display = "none";
  }, 2000);
  setTimeout(function () {
    wrapperElement.style.display = "block";
    shuffle();
  }, 4000);
}
function goBackToIntro() {
  location.reload();
}

function mutePage() {
  console.log("mutePage working");
  return music.intro.playing() ? music.intro.pause() : playIntro();
}

const cardElement = document.querySelectorAll(".memory-card");
const testEle = document.getElementById("restart");
const movesEle = document.querySelector(".moves");

let moves = 0;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  this.classList.remove("flip_reset");
  this.classList.add("flip");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
  console.log("flipCard working");
  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
  moves++;
  movesEle.innerHTML = `${moves} moves`;
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  firstCard.classList.add("cardDisabled");
  secondCard.classList.add("cardDisabled");
  console.log("disableCards working");

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1000);
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

function flipCards() {
  console.log("workingggg");
}

function startOver() {
  shuffle();
  // cardElement.forEach(card => card.classList.remove("active"));
  movesEle.innerHTML = `0 moves`;
  moves = 0;
  cardElement.forEach((card) => {
    if (card.classList.contains("cardDisabled")) {
      // card.style.transform ="rotate(7deg)";
      card.classList.add("flip_reset");
      card.classList.remove("cardDisabled");
    }
    card.addEventListener("click", flipCard);
  });
  hasFlippedCard = false;
  lockBoard = false;
  resetBoard();
}

// Back to forest:  card.classList.add("flip")
//
// console.log(card.getAttribute("data-framework"))
cardElement.forEach((card) => card.addEventListener("click", flipCard));
testEle.addEventListener("click", startOver);
