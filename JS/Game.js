import { Grid } from "./Grid.js";
import { View } from "./View.js";

class Game {
  constructor() {
    this.isPlayer1 = true;
    this.startWithPlayer1 = true;
    this.scores = [0, 0];
    this.turnDuration = 30;

    this.grid = new Grid();
    this.view = new View();
  }

  init() {
    const nColumn = 7;
    const nRow = 6;

    this.grid.init(nColumn, nRow);
    this.view.init(this, nColumn, nRow, this.turnDuration);
    this.view.updateScores(this.scores);
  }

  reset() {
    clearTimeout(this.turnTimeOut);

    this.isPlayer1 = true;
    this.startWithPlayer1 = true;
    this.scores = [0, 0];
    this.grid.reset();
    this.view.updateScores(this.scores);
    this.view.resetGrid();
  }

  start() {
    this.isPlaying = true;
    this.grid.reset();
    this.view.resetGrid();
    this.startWithPlayer1 = !this.startWithPlayer1;
    this.isPlayer1 = !this.startWithPlayer1;
    this.newTurn();
  }

  newTurn() {
    const onTimeOut = this.chooseRandomColumn.bind(this);
    this.turnTimeOut = setTimeout(onTimeOut, this.turnDuration * 1000);
    this.view.newTurn(
      this.isPlayer1,
      this.grid.fullColumn,
      this.grid.freeColumns
    );
    if (this.againstCPU && !this.isPlayer1)
      this.onColumnChoosed(this.grid.getCPUColumn());
  }

  chooseRandomColumn() {
    this.onColumnChoosed(this.grid.getRandomColumn());
  }

  async onColumnChoosed(column) {
    if (!this.isPlaying || this.isDropping) return;
    clearTimeout(this.turnTimeOut);
    await this.dropDisc(column);
    const winningDisc = this.grid.getWinningDisc();
    if (winningDisc) return this.end(winningDisc);
    else if (this.grid.isFull) return this.end(null, true);

    this.isPlayer1 = !this.isPlayer1;

    this.newTurn();
  }

  async dropDisc(column) {
    const row = this.grid.getNextSlotRow(column);
    const disc = { x: column, y: row, player: this.isPlayer1 ? 1 : 2 };

    this.grid.addDisc(disc);

    this.isDropping = true;

    await this.view.addDisc(disc);
    this.isDropping = false;
  }

  end(winningDisc, isDraw = false) {
    clearTimeout(this.turnTimeOut);
    this.isPlaying = false;
    this.view.end(winningDisc, isDraw);
    if (isDraw) return;

    this.scores[this.isPlayer1 ? 0 : 1]++;
    this.view.updateScores(this.scores);
  }
}
new Game().init();
