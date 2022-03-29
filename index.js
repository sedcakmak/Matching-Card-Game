var music = {
  intro: new Howl({
    src: ["./audio/intro.mp3"],
    loop: true,
    autoplay: false,
  }),
};

var sfx = {
  howling: new Howl({
    src: ["./audio/howling.wav"],
  }),
  wrong: new Howl({
    src: ["./audio/wrong.wav"],
  }),
  blop: new Howl({
    src: ["./audio/blop.wav"],
    // loop: false,
    // onend: function () {
    //   console.log("Done playing sfx!");
    // },
  }),
  humming: new Howl({
    src: ["./audio/humming.wav"],
  }),
  bleeeh: new Howl({
    src: ["./audio/40838__scuzzpuck__bleeeh.wav"],
  }),
  grin: new Howl({
    src: ["./audio/grin.wav"],
  }),
  hmph: new Howl({
    src: ["./audio/427972__lipalearning__male-grunt.wav"],
  }),
  laugh: new Howl({
    src: ["./audio/196841__omarstone__hahahaha-cartoon-monster.wav"],
  }),
  yippee: new Howl({
    src: ["./audio/yippee.wav"],
  }),
  roar: new Howl({
    src: ["./audio/growl.wav"],
  }),
  sadness: new Howl({
    src: ["./audio/sadness.wav"],
  }),
  excited: new Howl({
    src: ["./audio/excited.wav"],
  }),
  hello: new Howl({
    src: ["./audio/hello.wav"],
  }),
};

// var sound = new Howl({
//   src: ["./audio/intro.mp3"],
//   loop: true,
// });

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
  sfx.blop.play();

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
  playMonsterSound(firstCard.dataset.framework);
  resetBoard();
}

function playMonsterSound(monster) {
  switch (monster) {
    case "Grinning Purple Monster":
      sfx.grin.play();

      break;
    case "Orange Grumpy Monster":
      sfx.hmph.play();

      break;
    case "Excited Purple Monster":
      sfx.excited.play();

      break;
    case "Grinning Navy Blue Monster":
      sfx.laugh.play();

      break;
    case "Happy Green Monster":
      sfx.humming.play();

      break;
    case "Waving Blue Monster":
      sfx.hello.play();

      break;
    case "Happy Red Monster":
      sfx.bleeeh.play();

      break;
    case "Red Cyclops Monster":
      sfx.yippee.play();

      break;
    case "Sad Blue Monster":
      sfx.sadness.play();

      break;
    case "Scary Pink Monster":
      sfx.roar.play();

      break;
    default:
      sfx.humming.play();
  }
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    sfx.wrong.play();
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
  console.log("flipCards working");
}

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

// Back to forest:  card.classList.add("flip")
//
// console.log(card.getAttribute("data-framework"))
cardElement.forEach((card) => card.addEventListener("click", flipCard));
testEle.addEventListener("click", startOver);
