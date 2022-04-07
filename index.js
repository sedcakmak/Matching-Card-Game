const sfx = new Howl({
  src: ["./audio/sfx.webm", "./audio/sfx.mp3"],
  sprite: {
    Happy_Red_Monster: [0, 841.7233560090704],
    blop: [2000, 81.26984126984115],
    Excited_Purple_Monster: [4000, 2208.2539682539687],
    Grinning_Purple_Monster: [8000, 2970.8616780045354],
    Scary_Pink_Monster: [12000, 1512.2675736961444],
    Waving_Blue_Monster: [15000, 1291.8367346938774],
    Orange_Grumpy_Monster: [18000, 944.3083900226768],
    howling: [20000, 5394.67120181406],
    Happy_Green_Monster: [27000, 2000],
    Grinning_Navy_Blue_Monster: [30000, 1720.4535147392298],
    Sad_Blue_Monster: [33000, 1219.138321995466],
    wrong: [36000, 755.170068027212],
    Red_Cyclops_Monster: [38000, 1155.3514739229058],
  },
});

var music = {
  intro: new Howl({
    src: ["./audio/intro.mp3"],
    loop: true,
    autoplay: false,
    volume: 1,
  }),
  victory: new Howl({
    src: ["./audio/win.wav"],
  }),
  click: new Howl({
    src: ["./audio/click.wav"],
  }),
};

const pathButton = document.getElementById("take-path");
const startJourney = document.getElementById("start-journey");
const backgroundIntro = document.getElementById("background-intro");
const wrapperElement = document.getElementById("wrapper-cards");
const backtoIntroButton = document.getElementById("back_to_intro");
const backgroundGame = document.getElementById("background-game");
const toggleSoundsEle = document.getElementById("toggle_sounds");
const musicIcon = document.querySelector(".music_icon");
const checkboxEle = document.getElementById("checkbox");
const gameText = document.querySelector(".game-text");

pathButton.addEventListener("click", showGameBoard);
startJourney.addEventListener("click", showIntro, { once: true });
toggleSoundsEle.addEventListener("click", toggleSounds);
backtoIntroButton.addEventListener("click", goBackToIntro);
checkboxEle.addEventListener("click", switchToggle);

function showIntro() {
  toggleSoundsEle.style.display = "block";
  music.intro.play();
  fadeIntroButton();
  setTimeout(showIntroText, 3000);
  setTimeout(showPathButton, 6500);
  setTimeout(function () {
    startJourney.style.display = "none";
  }, 2000);
}

function showPathButton() {
  pathButton.style.opacity = 1;
}

function fadeIntroButton() {
  startJourney.style.opacity = 0;
}

function showIntroText() {
  var content =
    "Under a starry night, you found yourself in a pitch black forest. There is only one path to move forward. ";

  var ele = "<span>" + content.split("").join("</span><span>") + "</span>";

  $(ele)
    .hide()
    .appendTo("p")
    .each(function (i) {
      $(this)
        .delay(50 * i)
        .css({
          display: "inline",
          fontStyle: "italic",
          opacity: 0,
        })
        .animate(
          {
            opacity: 1,
          },
          1000
        );
    });
}

function showGameBoard() {
  backgroundIntro.style.opacity = "0";
  wrapperElement.style.opacity = "1";
  backgroundGame.style.opacity = "1";

  sfx.play("howling");

  var fadeouttime = 1500;
  setTimeout(function () {
    music.intro.fade(1, 0, fadeouttime);
  }, fadeouttime);

  setTimeout(function () {
    backgroundIntro.style.display = "none";
  }, 2000);
  setTimeout(function () {
    gameText.style.opacity = "1";
    wrapperElement.style.display = "block";
    shuffle();
  }, 4000);
}

function goBackToIntro() {
  window.scrollTo(0, 0);
  location.reload();
}

let isMuted = false;

function toggleSounds() {
  isMuted = !isMuted;
  Howler.mute(isMuted);
  toggleSoundsEle.classList.toggle("music_backgroundColor");
  musicIcon.classList.toggle("icon");
}

function switchToggle(event) {
  music.click.play();
  if (event.target.value === "on") {
    event.target.value = "off";
  } else {
    event.target.value = "on";
  }
}

// Game Mechanics

const cardElement = document.querySelectorAll(".memory-card");
const restartButton = document.getElementById("restart");
const movesEle = document.getElementById("moves");
const modalEle = document.querySelector(".modal-body");
const bestScoreBoardText = document.getElementById("best-score-text");

let moves = 0;

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  this.classList.remove("flip_reset");
  this.classList.add("flip");
  sfx.play("blop");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
  secondCard = this;
  lockBoard = true;

  checkForMatch();
  checkWin();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();

  moves++;
  movesEle.textContent = `Moves: ${moves}`;
}

let frontFaces = document.querySelectorAll(".front-face");
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  firstCard.classList.add("cardDisabled");
  secondCard.classList.add("cardDisabled");

  frontFaces.forEach((card) => {
    if (secondCard.dataset.framework === card.id) {
      card.classList.add("pop_in");
    }
  });
  playMonsterSound(firstCard.dataset.framework);
  resetBoard();
}

function checkWin() {
  let disabledCards = [];

  cardElement.forEach((card) => {
    if (card.classList.contains("cardDisabled")) {
      disabledCards.push(card);
    }
    if (disabledCards.length === 20) {
      sfx.stop();
      bestScore();
      modalText();
      setTimeout(function () {
        $("#gameWonModal").modal("toggle");
        music.victory.play();
      }, 500);
    }
  });
}

function playMonsterSound(monsterSound) {
  sfx.play(monsterSound);
}

let resetTime = 1000;
function unflipCards() {
  if (checkboxEle.value === "off") {
    resetTime = 2500;
  } else {
    resetTime = 1000;
  }

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    sfx.play("wrong");
    resetBoard();
  }, resetTime);
}
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function getKeyOrDefault(key, defaultValue = 1000) {
  return localStorage.getItem(key) || defaultValue;
}

function bestScore() {
  let bestScore = parseInt(getKeyOrDefault("score"));
  if (bestScore > moves) localStorage.setItem("score", moves);
}

function bestScoreBoard() {
  if (getKeyOrDefault("score") === 1000) {
    bestScoreBoardText.textContent = `Best Score:`;
  } else {
    bestScoreBoardText.textContent = `Best Score: ${getKeyOrDefault("score")}`;
  }
}
bestScoreBoard();

function modalText() {
  movesText = document.getElementById("moves-text");
  bestScoreText = document.getElementById("best-score");
  movesText.textContent = `You did it in ${moves} moves.`;
  bestScoreText.textContent = `Your best score is: ${localStorage.getItem(
    "score"
  )}!`;
}

function shuffle() {
  cardElement.forEach((card) => {
    let randomPosition = Math.floor(Math.random() * 20);
    card.style.order = randomPosition;
  });
}

function startOver() {
  movesEle.textContent = "Moves: 0";
  bestScoreBoard();
  moves = 0;

  frontFaces.forEach((card) => {
    card.classList.remove("pop_in");
  });
  cardElement.forEach((card) => {
    card.classList.add("flip_reset");
    card.classList.remove("cardDisabled");
    card.addEventListener("click", flipCard);
  });

  shuffle();
  resetBoard();
}

cardElement.forEach((card) => card.addEventListener("click", flipCard));
restartButton.addEventListener("click", startOver);
