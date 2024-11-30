export class Control {
  constructor() {
    this.selectedColumn = 0;
  }

  init(game, navigation, $columns) {
    this.game = game;
    this.navigation = navigation;
    this.$columns = $columns;
    this.events();
  }
  events() {
    this.$columns.forEach(($column, i) => {
      $column.addEventListener("pointerover", this.selectColumn.bind(this, i));
      $column.addEventListener("click", this.onClickColumn.bind(this, i));
    });
    addEventListener("keydown", this.onKeyDown.bind(this));
  }

  onClickColumn(column) {
    this.selectColumn(column);
    this.confirmColumn();
  }

  onKeyDown(event) {
    switch (event.keyCode) {
      case 37:
        return this.moveColumnSelection(false); // Left arrow key
      case 39:
        return this.moveColumnSelection(true); // Right arrow key
      case 27:
        return this.navigation.togglePause(); // Escape key
      case 32:
        this.confirmColumn(); // Spacebar
    }
  }

  selectColumn(column) {
    this.$columns[this.selectedColumn].classList.remove("column-selected");
    this.$columns[column].classList.add("column-selected");
    this.selectedColumn = column;
  }

  moveColumnSelection(nextColumn) {
    if (!this.game.isPlaying || this.navigation.data.paused) return;
    const freeColumns = this.freeColumns;
    let index = freeColumns.indexOf(this.selectedColumn);
    if (nextColumn) index = (index + 1) % freeColumns.length;
    else index = index - 1 < 0 ? freeColumns.length - 1 : index - 1;
    this.selectColumn(freeColumns[index]);
  }

  confirmColumn() {
    if (!this.game.isPlaying || this.navigation.data.paused) return;
    this.game.onColumnChoosed(this.selectedColumn);
  }

  newTurn(fullColumns, freeColumns) {
    for (const column of fullColumns) {
      this.$columns[column].classList.add("column-full");
    }
    this.freeColumns = freeColumns;
    if (freeColumns.includes(this.selectedColumn))
      return this.selectColumn(this.selectedColumn);
    this.selectColumn(freeColumns[0]);
  }
}
