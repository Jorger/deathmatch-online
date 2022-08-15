(() => {
  // Utilidades
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  const BASE_HEIGHT = 732;
  const BASE_WIDTH = 412;
  const CELL_DIMENSION = BASE_WIDTH / 7;
  $(
    "html"
  ).style.cssText += `--h: ${BASE_HEIGHT}px; --w: ${BASE_WIDTH}px; --db: ${CELL_DIMENSION}px`;
  const setHtml = (element, html) => (element.innerHTML = html);
  const ObjectKeys = (obj) => Object.keys(obj);

  const $on = (target, type, callback, parameter = {}) => {
    if (target) {
      target.addEventListener(type, callback, parameter);
    }
  };

  const inlineStyles = (styles) =>
    ObjectKeys(styles).length
      ? `style='${ObjectKeys(styles)
          .map((v) => `${v}:${styles[v]}`)
          .join(";")}'`
      : "";

  /*
  FILAS HORIZINTAL..
  COlumnas Vertical...
  */

  const Game = () => {
    const BOARD_ELEMENTS = ["💀", "⚰️", "🩸", "🎃", "⚱️"];
    // let BOARD_GAME = newBoard();

    // 💀 ⚰️ ⚱️ 👻 🩸 🪓 💣 🚀 🔫 🦇 🎃 🗡️
    const RenderBoard = (board = []) =>
      board.map((cell, row) =>
        cell
          .map(
            (v, col) =>
              `<div class="df a c" i=${`${row * SIZE + col}`} ${inlineStyles({
                left: `${Math.round(CELL_DIMENSION * col)}px`,
                top: `${Math.round(CELL_DIMENSION * row)}px`,
              })}>${BOARD_ELEMENTS[v - 1]}</div>`
          )
          .join("")
      ).join("");

    // const createBoard = () => {

    // }

    setHtml($("#render"), `<div class="df f wi he"><board>${RenderBoard(newBoard())}</board><button id="test">Generate</button></div>`);


    $on($("#test"), "click", () => {
      setHtml($("board"), RenderBoard(newBoard()));
    })
  };

  const Screen = (screen = "Game", params = {}) => {
    const Handler = { Game };
    Handler[screen](params);
  };

  // Renderizar la base del juego...
  setHtml($("#root"), `<div id="render" class="df c wi he"></div>`);
  Screen();
})();
