class Gameboard {
  constructor() {
    this.display = this.resetDisplay();
  }

  resetDisplay() {
    return [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  }
}

class Player {
  constructor(id) {
    this.id = id;
    this.name = this.setName();
    this.symbol = this.setSymbol();
  }

  setName() {
    return "A";
  }

  setSymbol() {
    return "B";
  }
}

const gameBoard = new Gameboard();
const player1 = new Player(1);
const player2 = new Player(2);

console.log(gameBoard.display);
console.log(player1, player2);

// ----
// LOGO
// ----
const logo = document.getElementById("logo");
// Flag to track if animation has been reset
let animationReset = false;

// Function to check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Function to handle scroll event
function handleScroll() {
  if (isInViewport(logo) && !animationReset) {
    logo.src = logo.src; // Reset the src attribute to replay the GIF animation
    animationReset = true; // Set flag to true once animation is reset
  } else if (!isInViewport(logo)) {
    animationReset = false; // Reset flag if element goes out of view
  }
}

// Add scroll event listener to window
window.addEventListener("scroll", handleScroll);
document.addEventListener("DOMContentLoaded", handleScroll);
