export class Navigation {
  constructor() {
    this.$transitionScreen = document.querySelector(".transition-screen");
  }
  init(game, data) {
    this.game = game;
    this.data = data;

    this.listenEvents();
  }

  listenEvents() {
    document
      .querySelector(".btn-pvc")
      .addEventListener("click", this.toCPUGame.bind(this));
    document
      .querySelector(".btn-pvp")
      .addEventListener("click", this.toGame.bind(this));
    document
      .querySelector(".btn-rules")
      .addEventListener("click", this.toRules.bind(this));
    document
      .querySelector(".btn-ok-rules")
      .addEventListener("click", this.acceptRules.bind(this));
    document
      .querySelector(".btn-menu")
      .addEventListener("click", this.pause.bind(this));
    document
      .querySelector(".btn-restart")
      .addEventListener("click", this.restart.bind(this));
    document
      .querySelector(".btn-play")
      .addEventListener("click", this.start.bind(this));
    document
      .querySelector(".btn-continue")
      .addEventListener("click", this.unpause.bind(this));
    document
      .querySelector(".btn-restart-menu")
      .addEventListener("click", this.restart.bind(this));
    document
      .querySelector(".btn-quit")
      .addEventListener("click", this.quit.bind(this));
    document
      .querySelector(".ingame-menu")
      .addEventListener("click", this.closeMenu.bind(this));
  }

  fadeIn() {
    this.$transitionScreen.classList.add("active");
    this.data.transition = true;
    return new Promise((resolve) => {
      this.$transitionScreen.addEventListener("transitionend", resolve, {
        once: true,
      });
    });
  }
  fadeOut() {
    this.$transitionScreen.classList.remove("active");
    delete this.data.transition;
  }

  toRules() {
    this.data.rules = true;
  }

  acceptRules() {
    delete this.data.rules;
  }

  async toGame() {
    await this.fadeIn();

    this.data.ingame = true;
    this.data.state = "start";
    delete this.data.pvc;
    this.game.againstCPU = false;
    this.fadeOut();
  }

  async toCPUGame() {
    await this.fadeIn();
    this.data.ingame = true;
    this.data.state = "start";
    this.data.pvc = true;
    this.game.againstCPU = true;
    this.fadeOut();
  }

  start() {
    this.game.start();
    this.data.state = "playing";
  }

  async restart() {
    this.unpause();

    await this.fadeIn();
    this.data.state = "start";
    delete this.data.isDraw;

    this.game.reset();
    this.fadeOut();
  }

  pause() {
    this.data.paused = true;
  }

  unpause() {
    delete this.data.paused;
  }

  async quit() {
    await this.fadeIn();

    delete this.data.isDraw;
    delete this.data.ingame;
    delete this.data.paused;
    this.game.reset();
    this.fadeOut();
  }

  closeMenu(event) {
    if (!event.target.classList.contains("ingame-wrapper")) return;
    this.unpause();
  }

  togglePause() {
    if (!this.data.ingame) return;
    if (this.data.paused) this.unpause();
    else this.pause();
  }
}
