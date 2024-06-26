class Gameboard {
  constructor() {
    this.board = ["", "", "", "", "", "", "", "", ""];
  }

  getBoard() {
    return this.board;
  }

  resetBoard() {
    this.board.fill("");
  }

  updateBoard(marker, index) {
    this.board.splice(index, 1, marker);
    console.log(this.board);
  }
}

class Player {
  constructor(mark) {
    this.marker = mark;
  }
}

class GameController {
  constructor(displayController) {
    this.displayController = displayController;
    this.player1 = null;
    this.player2 = null;
    this.currentPlayer = null;
    this.gameboard = null;
    this.gameOver = false;
  }

  startGame(playerMarker, difficulty) {
    // Set up markers for player and computer
    this.player = new Player(playerMarker);
    if (playerMarker === "❌") this.computer = new Player("⭕");
    else if (playerMarker === "⭕") this.computer = new Player("❌");

    this.currentPlayer = "❌"; // X goes first.
    this.gameboard = new Gameboard();
    this.gameOver = false;
    this.difficulty = difficulty;
  }

  makeMove(index) {
    // If game is over and cell is full, then don't make move.
    const board = this.gameboard.getBoard();
    if (this.gameOver || board[index] !== "") return;

    const marker = this.currentPlayer;
    this.gameboard.updateBoard(marker, index);
    this.switchPlayer();
    this.checkWin();
  }

  checkWin() {
    if (this.isWin()) {
      // Current player wins!
      this.gameOver = true;
    } else if (this.isTie()) {
      // No one wins!
      this.gameOver = true;
    } else {
      // The game continues.
      this.switchPlayer();
    }
  }

  switchPlayer() {
    if (this.currentPlayer === "❌") this.currentPlayer = "⭕";
    else if (this.currentPlayer === "⭕") this.currentPlayer = "❌";
    // See if it's the AI's turn.
    if (this.computer.marker === this.currentPlayer) this.decideAI();
  }

  decideAI() {}

  // Check win and tie states:

  isWin() {
    const board = this.gameboard.getBoard();
    const winStates = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    // Check if atleast one state has all its indexes the same as current player's.
    return winStates.some((state) =>
      state.every((index) => board[index] === this.currentPlayer)
    );
  }

  isTie() {
    const board = this.gameboard.getBoard();
    return board.every((index) => index !== "");
  }
}

class DisplayController {
  constructor() {
    this.cells = Array.from(document.getElementsByClassName("cell"));
    this.startBtn = document.getElementById("start-btn");
    this.symbolBtn = document.getElementById("symbol-btn");
    this.difficulty = document.getElementById("difficulty");

    // Initialize game controller
    this.gameController = new GameController();

    this.startBtn.addEventListener("click", () => {
      const playerMarker = this.symbolBtn.textContent;
      const difficulty = this.difficulty.value;
      this.gameController.startGame(playerMarker, difficulty);
    });

    this.cells.forEach((cell, index) => {
      cell.addEventListener("click", () => {
        this.gameController.makeMove(index);
      });
    });
  }
}

// Initialize DisplayController
const displayController = new DisplayController();

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
