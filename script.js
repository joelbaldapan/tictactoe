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
    return prompt("What is your name?");
  }

  setSymbol() {
    return prompt("What is your symbol?");
  }
}

const gameBoard = new Gameboard();
const player1 = new Player(1);
const player2 = new Player(2);

console.log(gameBoard.display);
console.log(player1, player2);
