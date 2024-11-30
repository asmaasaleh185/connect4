import { Navigation } from "./Navigation.js";
import { Control } from "./Control.js";

export class View {
  constructor() {
    this.data = document.body.dataset;
    this.timerData = document.querySelector(".timer").dataset;
    this.score1Data = document.querySelector(".score1").dataset;
    this.score2Data = document.querySelector(".score2").dataset;
    this.navigation = new Navigation();
    this.control = new Control();
  }

  init(game, nColumn, nRow, turnDuration) {
    const { $columns, $slots } = this.buildGrid(nColumn, nRow);
    this.$slots = $slots;
    this.$columns = $columns;
    this.turnDuration = turnDuration;
    this.navigation.init(game, this.data);
    this.control.init(game, this.navigation, $columns);
  }

  buildGrid(nColumn, nRow) {
    const $columns = [];
    const $slots = [];
    const $grid = document.querySelector(".grid-wrapper");
    for (let i = 0; i < nColumn; i++) {
      const $column = document.createElement("div");
      $column.classList.add("column");
      for (let j = 0; j < nRow; j++) {
        const $slot = document.createElement("div");
        $slot.classList.add("slot");
        $slots.push($slot);
        $column.appendChild($slot);
      }
      $columns.push($column);
      $grid.appendChild($column);
    }
    return { $columns, $slots };
  }

  newTurn(isPlayer1, fullColumns, freeColumns) {
    this.data.player = isPlayer1 ? 1 : 2;
    const timerData = this.timerData;
    timerData.value = this.turnDuration;
    const onInterval = () => {
      timerData.value--;
    };
    this.timerInterval = setInterval(onInterval, 1000);
    this.control.newTurn(fullColumns, freeColumns);
  }

  getSlot(x, y) {
    const index = x * 6 + 5 - y;
    return this.$slots[index];
  }

  async addDisc(disc) {
    clearInterval(this.timerInterval);
    this.data.drop = true;
    const $slot = this.getSlot(disc.x, disc.y);

    $slot.style.translate = `0 -${(6 - disc.y) * 100}%`;
    $slot.offsetWidth;
    $slot.classList.add(`slot-p${disc.player}`);
    $slot.style.removeProperty("translate");

    await new Promise((r) => $slot.addEventListener("transitionend", r));
    delete this.data.drop;
  }

  resetGrid() {
    clearInterval(this.timerInterval);

    for (const $column of this.$columns) $column.className = "column";
    for (const $slot of this.$slots) $slot.className = "slot";
  }

  end(winningDisc, isDraw) {
    clearInterval(this.timerInterval);
    this.data.state = "end";
    this.data.isDraw = isDraw;

    if (isDraw) return;
    for (const disc of winningDisc) {
      this.getSlot(disc.x, disc.y).classList.add("slot-win");
    }
  }

  updateScores(scores) {
    this.score1Data.value = scores[0];
    this.score2Data.value = scores[1];
  }
}
