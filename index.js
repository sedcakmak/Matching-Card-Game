const sfx = new Howl({
  src: ["./audio/sfx.webm", "./audio/sfx.mp3"],
  sprite: {
    bleeeh: [0, 841.7233560090704],
    blop: [2000, 81.26984126984115],
    excited: [4000, 2208.2539682539687],
    grin: [8000, 2970.8616780045354],
    growl: [12000, 1512.2675736961444],
    hello: [15000, 1291.8367346938774],
    hmph: [18000, 944.3083900226768],
    howling: [20000, 5394.67120181406],
    humming: [27000, 2000],
    laugh: [30000, 1720.4535147392298],
    sadness: [33000, 1219.138321995466],
    wrong: [36000, 755.170068027212],
    yippee: [38000, 1155.3514739229058],
  },
});

var music = {
  intro: new Howl({
    src: ["./audio/intro.mp3"],
    loop: true,
    autoplay: false,
  }),
};

//   blop: new Howl({
//     src: ["./audio/blop.wav"],
//     // loop: false,
//     // onend: function () {
//     //   console.log("Done playing sfx!");
//     // },
//   }),

const pathButton = document.getElementById("intro-button");
const startJourney = document.getElementById("start-journey");
const backgroundElement = document.getElementById("background-intro");
const wrapperElement = document.getElementById("wrapper-cards");
const backtoIntroButton = document.getElementById("back_to_intro");
const bgElement = document.getElementById("background-game");
const toggleSoundsEle = document.getElementById("toggle_sounds");
const musicIcon = document.querySelector(".music_icon");

pathButton.addEventListener("click", hideIntro);
startJourney.addEventListener("click", showIntro);
toggleSoundsEle.addEventListener("click", toggleSounds);
backtoIntroButton.addEventListener("click", goBackToIntro);

function showIntro() {
  toggleSoundsEle.style.display = "block";
  toggleSounds();
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
    "Under a starry night, you find yourself in a pitch black forest. You see only one path to move forward. ";

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

function toggleSounds() {
  toggleSoundsEle.classList.toggle("music");
  musicIcon.classList.toggle("icon");
  return music.intro.playing() ? music.intro.pause() : music.intro.play();
}

// function toggleIcon() {
//   if (musicIcon.style.backgroundImage === "url('./images/pause.svg')") {
//     musicIcon.style.backgroundImage = "url('./images/play.svg')";
//   } else {
//     musicIcon.style.backgroundImage = "url('./images/pause.svg')";
//   }
// }

// Game Mechanics

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
  sfx.play("blop");

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
  moves++;
  movesEle.innerHTML = `${moves} moves`;
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  firstCard.classList.add("cardDisabled");
  secondCard.classList.add("cardDisabled");

  playMonsterSound(firstCard.dataset.framework);
  resetBoard();
}

function playMonsterSound(monster) {
  switch (monster) {
    case "Grinning Purple Monster":
      sfx.play("grin");

      break;
    case "Orange Grumpy Monster":
      sfx.play("hmph");

      break;
    case "Excited Purple Monster":
      sfx.play("excited");

      break;
    case "Grinning Navy Blue Monster":
      sfx.play("laugh");

      break;
    case "Happy Green Monster":
      sfx.play("humming");

      break;
    case "Waving Blue Monster":
      sfx.play("hello");

      break;
    case "Happy Red Monster":
      sfx.play("bleeeh");

      break;
    case "Red Cyclops Monster":
      sfx.play("yippee");

      break;
    case "Sad Blue Monster":
      sfx.play("sadness");

      break;
    case "Scary Pink Monster":
      sfx.play("growl");

      break;
    default:
      sfx.play("humming");
  }
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
  // cardElement.forEach(card => card.classList.remove("active"));
  movesEle.innerHTML = `0 moves`;
  moves = 0;
  cardElement.forEach((card) => {
    if (card.classList.contains("cardDisabled")) {
      card.classList.add("flip_reset");
      card.classList.remove("cardDisabled");
    }
    card.addEventListener("click", flipCard);
  });
  hasFlippedCard = false;
  lockBoard = false;
  resetBoard();
}

cardElement.forEach((card) => card.addEventListener("click", flipCard));
testEle.addEventListener("click", startOver);
