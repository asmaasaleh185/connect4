export class Grid {
  constructor() {
    this.axes = [
        // (+)Diagonal
      [
        { x: 1, y: 1 },
        { x: -1, y: -1 },
      ],
      // Horizontal
      [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
      ],
      // Vertical
      [
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ],
      // (-)Diagonal
      [
        { x: 1, y: -1 },
        { x: -1, y: 1 },
      ],
    ];
  }
  get isFull() {
    return this.nDisc == this.nSlots;
  }
  init(nColumns, nRows) {
    this.nColumns = nColumns;
    this.nRows = nRows;
    this.nSlots = nColumns * nRows;
    this.reset();
  }
  reset() {
    this.grid = Array.from({ length: this.nColumns }, () => {
      return Array.from({ length: this.nRows }, () => ({ isEmpty: true }));
    });
    this.dangerousAxis = false;
    this.nDisc = 0;
    this.fullColumn = [];
    this.freeColumns = Array.from({ length: this.nColumns }, (_, i) => i);
    this.columnStack = Array.from({ length: this.nColumns }).fill(0);
  }
  get(x, y) {
    return this.grid[x]?.[y];
  }
  addDisc(disc) {
    const { x, y, player } = disc;
    const slot = this.get(x, y);
    slot.isEmpty = false;
    slot.player = player;
    this.lastDisc = disc;

    this.nDisc++;
    this.columnStack[x]++;

    if (y != this.nRows - 1) return;

    this.fullColumn.push(x);
    this.freeColumns.splice(this.freeColumns.indexOf(x), 1);
  }
  getWinningDisc() {
    const disc = this.lastDisc;
    const player = disc.player;
    let discs;
    const foundWinningDiscs = this.axes.some((axis) => {
      const x = disc.x;
      const y = disc.y;
      discs = [{ x, y }];

      for (const dir of axis) {
        const slots = Array.from({ length: 3 }, (_, i) => ({
          x: x + dir.x * (i + 1),
          y: y + dir.y * (i + 1),
        }));
        slots.some(({ x, y }) => {
          const slot = this.get(x, y);

          if (!slot || slot.isEmpty || slot.player != player) return true;

          discs.push({ x, y });
        });
      }
      if (player == 1 && discs.length == 3) {
        this.dangerousAxis = axis;
        this.dangerousDisc = this.lastDisc;
      }

      if (discs.length >= 4) return true;
    });

    return foundWinningDiscs ? discs : false;
  }
  getNextSlotRow(column) {
    return this.columnStack[column];
  }
  getRandomColumn() {
    const freeColumns = this.freeColumns;
    const randIndex = Math.floor(Math.random() * freeColumns.length);

    return freeColumns[randIndex];
  }

  getCPUColumn() {
    const dangerousAxis = this.dangerousAxis;

    if (!dangerousAxis) return this.getRandomColumn();

    const disc = this.dangerousDisc;

    let x, y;

    const found = dangerousAxis.find((dir) => {
      let i = 1,
        slot;

      do {
        x = disc.x + dir.x * i;
        y = disc.y + dir.y * i;

        slot = this.get(x, y);
        if (!slot || slot.player == 2) return false;

        i++;
      } while (slot.player == 1);
      return this.getNextSlotRow(x) == y;
    });
    return found ? x : this.getRandomColumn();
  }
}
