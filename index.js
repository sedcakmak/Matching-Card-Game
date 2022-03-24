// window.onload = chooseCards2;

const cards = [
  "./images/Card 1.png",
  "./images/Card 2.png",
  "./images/Card 3.png",
  "./images/Card 4.png",
  "./images/Card 5.png",
  "./images/Card 6.png",
  "./images/Card 7.png",
  "./images/Card 8.png",
  "./images/Card 9.png",
  "./images/Card 10.png",
];

function chooseCrds() {
  var randomNum = Math.floor(Math.random() * cards.length);
  document.getElementById("firstRow").src = cards[randomNum];
  document.getElementById("secondRow").src = cards[randomNum];
  document.getElementById("thirdRow").src = cards[randomNum];
  document.getElementById("fourthRow").src = cards[randomNum];
  document.getElementById("fifthRow").src = cards[randomNum];
}

function choosedCards2() {
  var cardscopy = cards.slice(); //getting new copy of initial input
  function getRandomImg() {
    return cardscopy.splice(
      [Math.floor(Math.random() * cardscopy.length)],
      (1)[0]
    ); //calculating a new random image and removing it from copy to exclude duplicates
  }

  document.getElementById("firstRow").src = "images/" + getRandomImg();
  document.getElementById("secondRow").src = "images/" + getRandomImg();
  document.getElementById("thirdRow").src = "images/" + getRandomImg();
}

const buttonElement = document.getElementById("intro-button");
const backgroundElement = document.getElementById("background-intro");
const wrapperElement = document.getElementById("wrapper-cards");

buttonElement.addEventListener("click", hideIntro);

function hideIntro() {
  backgroundElement.style.opacity = "0";
  wrapperElement.style.opacity = "1";
  setTimeout(function () {
    backgroundElement.style.display = "none";
  }, 2000);
  setTimeout(function () {
    wrapperElement.style.display = "block";
    console.log("now");
  }, 2000);
}

// buttonElement.ontransitionend = () => {
//   alert("Transition ended");
// };
