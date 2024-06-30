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
  }
}

class human {
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
    // Set up markers for human and computer
    this.human = new human(playerMarker);
    if (playerMarker === "❌") this.computer = new human("⭕");
    else if (playerMarker === "⭕") this.computer = new human("❌");

    this.currentPlayer = "❌"; // X goes first.
    this.gameboard = new Gameboard();
    this.gameOver = false;
    this.difficulty = difficulty;

    // Make AI do move if it's first.
    if (playerMarker === "⭕") this.decideAI();
  }

  makeMove(index) {
    // If game is over and cell is full, then don't make move.
    const board = this.gameboard.getBoard();
    console.log(board, this.gameOver);

    if (this.gameOver || board[index] !== "") return;

    // Human's Turn
    playBtnSFX();
    this.gameboard.updateBoard(this.human.marker, index);
    this.checkWin("human");
    this.switchPlayer();

    // AI's Turn
    this.decideAI();
  }

  checkWin(checkWho) {
    const board = this.gameboard.getBoard();
    const currentMarker = this.currentPlayer;
    displayController.updateDisplay();
    if (this.isWin(board, currentMarker)) {
      // Current human wins!
      this.gameOver = true;
      if (checkWho === "human") {
        displayController.gameOver(`You win!`);
      } else {
        displayController.gameOver(`You lose!`);
      }
    } else if (this.isLose(board, currentMarker)) {
      // Current AI wins!
      this.gameOver = true;
      if (checkWho === "human") {
        displayController.gameOver(`You win!`);
      } else {
        displayController.gameOver(`You lose!`);
      }
    } else if (this.isTie(board)) {
      // No one wins!
      this.gameOver = true;
      displayController.gameOver(`It's a draw!`);
    } else {
      // The game continues.
      this.switchPlayer();
    }
  }

  switchPlayer() {
    if (this.currentPlayer === "❌") this.currentPlayer = "⭕";
    else if (this.currentPlayer === "⭕") this.currentPlayer = "❌";
  }

  decideAI() {
    if (this.gameOver) return;
    // Minimax & precision algorithm
    const newBoard = [...this.gameboard.getBoard()];
    const possibleMoves = this.getAvailableMoves(newBoard);
    const bestIndex = this.minimax(newBoard, 9, this.computer.marker).index;
    const indexAI = this.getIndex(possibleMoves, bestIndex);

    this.gameboard.updateBoard(this.computer.marker, indexAI);
    this.checkWin("computer");
    this.switchPlayer();
    displayController.updateDisplay();
  }

  getIndex(possibleMoves, bestIndex) {
    let precision;
    if (this.difficulty === "easy") precision = 0.3;
    if (this.difficulty === "medium") precision = 0.6;
    if (this.difficulty === "hard") precision = 0.9;
    if (this.difficulty === "impossible") precision = 1;
    const randomNumber = Math.random();

    if (precision > randomNumber) {
      return bestIndex;
    } else {
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
      return possibleMoves[randomIndex];
    }
  }

  getAvailableMoves(newBoard) {
    return newBoard.reduce((moves, cell, index) => {
      if (cell === "") moves.push(index);
      return moves;
    }, []);
  }

  // Minimax Algorithm

  minimax(newBoard, depth, currentMarker) {
    // Check for terminal state and return respective score
    const availableMoves = this.getAvailableMoves(newBoard);

    if (this.isWin(newBoard, this.computer.marker)) {
      return { score: 10 };
    } else if (this.isLose(newBoard, this.computer.marker)) {
      return { score: -10 };
    } else if (this.isTie(newBoard)) {
      return { score: 0 };
    }

    const moves = [];

    // Loop through available moves.
    availableMoves.forEach((moveIndex) => {
      const move = {};
      move.index = moveIndex;

      // Make a move.
      newBoard[moveIndex] = currentMarker;

      // Call minimax recursively and store the score.
      if (currentMarker === this.computer.marker) {
        const result = this.minimax(newBoard, depth - 1, this.human.marker);
        move.score = result.score;
      } else {
        const result = this.minimax(newBoard, depth - 1, this.computer.marker);
        move.score = result.score;
      }

      // Undo and store the move.
      newBoard[moveIndex] = "";
      moves.push(move);
    });

    // Choose the best move.
    let bestMove;
    if (currentMarker === this.computer.marker) {
      let bestScore = -Infinity;
      moves.forEach((move) => {
        if (move.score === bestScore) {
          if (Math.random() < 0.5) {
            bestScore = move.score;
            bestMove = move;
          }
        }
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      });
    } else {
      let bestScore = +Infinity;
      moves.forEach((move) => {
        if (move.score === bestScore) {
          if (Math.random() < 0.5) {
            bestScore = move.score;
            bestMove = move;
          }
        }
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      });
    }
    return bestMove;
  }

  getAvailableMoves(board) {
    return board.reduce((moves, cell, index) => {
      if (cell === "") moves.push(index);
      return moves;
    }, []);
  }

  // Check win and tie states:

  isWin(board, currentMarker) {
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

    // Check if atleast one state has all its indexes the same as current human's.
    return winStates.some((state) =>
      state.every((index) => board[index] === currentMarker)
    );
  }

  isLose(board, currentMarker) {
    // Flip markers then call isWin().
    let opposingMarker;
    if (currentMarker === "❌") opposingMarker = "⭕";
    else if (currentMarker === "⭕") opposingMarker = "❌";
    return this.isWin(board, opposingMarker);
  }

  isTie(board) {
    return board.every((index) => index !== "");
  }
}

class DisplayController {
  constructor() {
    this.cells = Array.from(document.getElementsByClassName("cell"));
    this.startBtn = document.getElementById("start-btn");
    this.symbolBtn = document.getElementById("symbol-btn");
    this.difficultySelect = document.getElementById("difficulty");
    this.gameOverText = document.getElementById("gameover");

    // Initialize game controller
    this.gameController = new GameController();

    this.startBtn.addEventListener("click", () => {
      this.startBtn.textContent = "Restart";
      const playerMarker = this.symbolBtn.textContent;
      const difficulty = this.difficultySelect.value;
      this.gameController.startGame(playerMarker, difficulty);
      this.gameOver(`You're playing as ${playerMarker}!`);
      this.updateDisplay();
      playResetSFX();
    });

    this.symbolBtn.addEventListener("click", () => {
      const currentText = this.symbolBtn.textContent;
      if (currentText === "❌") this.symbolBtn.textContent = "⭕";
      else if (currentText === "⭕") this.symbolBtn.textContent = "❌";
      playBtnSFX();
    });

    this.cells.forEach((cell, index) => {
      cell.addEventListener("click", () => {
        this.gameController.makeMove(index);
      });
    });

    this.difficultySelect.addEventListener("change", () => {
      this.startBtn.textContent = "Unsaved Changes!";
      playBtnSFX();
    });
  }

  updateDisplay() {
    const board = this.gameController.gameboard.getBoard();
    this.cells.forEach((cell, index) => {
      if (cell.textContent !== "") {
        cell.classList.add("filled");
      } else {
        cell.classList.remove("filled");
      }
      cell.textContent = board[index];
    });
  }

  gameOver(message) {
    this.cells.forEach((cell) => {
      cell.classList.add("filled");
      this.gameOverText.textContent = message;
    });
  }
}

// Initialize DisplayController and Automatically start game
const displayController = new DisplayController();
displayController.gameController.startGame("❌", "easy");
displayController.gameController.gameOver = true;
displayController.gameOver();

// -----
// AUDIO
// -----
function getRandomNumber() {
  return Math.floor(Math.random() * 3) + 1;
}

function playBtnSFX() {
  let randomNumber = getRandomNumber();
  const sound = new Audio();
  sound.src = `audio/btn-${randomNumber}.mp3`;
  sound.play();
}

function playResetSFX() {
  const sound = new Audio();
  sound.src = `audio/reset.mp3`;
  sound.play();
}

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
