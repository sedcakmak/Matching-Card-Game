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
    src: ["./audio/victory.wav", "./audio/victory.mp3"],
  }),
};

//   blop: new Howl({
//     src: ["./audio/blop.wav"],
//     // loop: false,
//     // onend: function () {
//     //   console.log("Done playing sfx!");
//     // },
//   }),

const pathButton = document.getElementById("take-path");
const startJourney = document.getElementById("start-journey");
const backgroundElement = document.getElementById("background-intro");
const wrapperElement = document.getElementById("wrapper-cards");
const backtoIntroButton = document.getElementById("back_to_intro");
const bgElement = document.getElementById("background-game");
const toggleSoundsEle = document.getElementById("toggle_sounds");
const musicIcon = document.querySelector(".music_icon");

pathButton.addEventListener("click", hideIntro);
startJourney.addEventListener("click", showIntro, { once: true });
toggleSoundsEle.addEventListener("click", toggleSounds);
backtoIntroButton.addEventListener("click", goBackToIntro);

function showIntro() {
  toggleSoundsEle.style.display = "block";
  music.intro.play();
  fadeIntroButton();
  setTimeout(showIntroText, 3000);
  setTimeout(showPathButton, 6500);
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

function hideIntro() {
  backgroundElement.style.opacity = "0";
  wrapperElement.style.opacity = "1";
  bgElement.style.opacity = "1";
  sfx.play("howling");

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

let isMuted = false;

function toggleSounds() {
  isMuted = !isMuted;
  Howler.mute(isMuted);
  toggleSoundsEle.classList.toggle("music_backgroundColor");
  musicIcon.classList.toggle("icon");
}

// Game Mechanics

const cardElement = document.querySelectorAll(".memory-card");
const testEle = document.getElementById("restart");
const movesEle = document.getElementById("moves");
const modalEle = document.querySelector(".modal-body");

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

  //console.log(localStorage.getItem("score"));
  console.log(getKeyOrDefault("score"));
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  firstCard.classList.add("cardDisabled", "pop_in");
  secondCard.classList.add("cardDisabled", "pop_in");

  playMonsterSound(firstCard.dataset.framework);
  // firstCard.classList.add("pop_in");
  // secondCard.classList.add("pop_in");
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

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    sfx.play("wrong");
    resetBoard();
  }, 1000);
}
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function getKeyOrDefault(key, defaultValue = 1000) {
  return localStorage.getItem(key) || defaultValue;
}

function bestScore() {
  //let bestScore = parseInt(localStorage.getItem("score")) || 1000;
  let bestScore = parseInt(getKeyOrDefault("score"));

  if (bestScore > moves) {
    localStorage.setItem("score", moves);
    console.log(`moves: ${moves} best score: ${bestScore}`);
  } else {
    console.log("best score is" + " " + bestScore);
  }
}

function modalText() {
  modalEle.textContent = `You did it in ${moves} moves! Your best score is: ${localStorage.getItem(
    "score"
  )}`;
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
  // cardElement.forEach(card => card.classList.remove("active"));
  movesEle.textContent = "Moves: 0";
  moves = 0;
  cardElement.forEach((card) => {
    if (card.classList.contains("cardDisabled")) {
      card.classList.add("flip_reset");
      card.classList.remove("cardDisabled", "pop_in");
    }
    card.addEventListener("click", flipCard);
  });
  shuffle();
  hasFlippedCard = false;
  lockBoard = false;
  resetBoard();
}

cardElement.forEach((card) => card.addEventListener("click", flipCard));
testEle.addEventListener("click", startOver);
