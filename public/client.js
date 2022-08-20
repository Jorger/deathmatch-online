(() => {
  // Utilidades
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  $(
    "html"
  ).style.cssText += `--h: ${HEIGHT}px; --w: ${WIDTH}px; --db: ${CELL}px`;
  const setHtml = (element, html) => (element.innerHTML = html);
  const ObjectKeys = (obj) => Object.keys(obj);
  const clone = (value) => JSON.parse(JSON.stringify(value));

  const $on = (target, type, callback, parameter = {}) => {
    if (target) {
      target.addEventListener(type, callback, parameter);
    }
  };

  /**
   * Agregar estilos inline a un elemento
   * @param {*} target
   * @param {*} styles
   */
  const addStyle = (target, styles) => {
    if (target) {
      for (let style in styles) {
        target.style[style] = styles[style];
      }
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

  const Game = ({ BOARD = newBoard() }) => {
    const BOARD_ELEMENTS = ["💀", "⚰️", "🩸", "🔥", "⚱️"];
    // let BOARD_GAME = newBoard();

    // 💀 ⚰️ ⚱️ 👻 🩸 🪓 💣 🚀 🔫 🦇 🎃 🗡️ 🔥
    const RenderBoard = (board = []) =>
      board
        .map((cell) =>
          cell
            .map(
              (v) =>
                `<div class="df a c" id="t-${`${v.i}`}" ${inlineStyles({
                  left: `${v.l}px`,
                  top: `${v.t}px`,
                })}>${BOARD_ELEMENTS[v.v - 1]}</div>`
            )
            .join("")
        )
        .join("");

    setHtml(
      $("#render"),
      `<div class="df f wi he"><board>${RenderBoard(
        BOARD
      )}</board><button id="test">Generate</button></div>`
    );

    $on($("#test"), "click", () => {
      BOARD = newBoard();
      console.log(BOARD);
      console.log(isValidBoard(BOARD));
      setHtml($("board"), RenderBoard(BOARD));
    });

    const validateMove = (move = []) => {
      for (let i = 0; i < 2; i++) {
        const next = +!i;
        addStyle($(`#t-${move[i].i}`), {
          left: `${move[next].l}px`,
          top: `${move[next].t}px`,
        });
        BOARD[move[i].p.i][move[i].p.c] = {
          ...BOARD[move[i].p.i][move[i].p.c],
          v: move[next].v,
          i: move[next].i,
        };
      }
    };

    // Agregra los eventos...
    // 0 Guarda el índice del elemento que está ene sa posición...
    /*
      0: La posición fila y columna de elemento seleccionado {}
    */
    let eventMove = {};
    /**
     * Dado dos puntos, regresa la dirección...
     * @param {*} p1
     * @param {*} p2
     * @returns
     */
    const getDirection = (p1 = { x: 0, y: 0 }, p2 = { x: 0, y: 0 }) => {
      const angle = (Math.atan2(p1.y - p2.y, p1.x - p2.x) * 180) / Math.PI;
      return (
        [
          ["left", angle < -170 || angle > 170],
          ["right", angle > -10 && angle < 10],
          ["bottom", angle < -67.5 && angle > -112.5],
          ["top", angle > 67.5 && angle < 112.5],
        ].filter((v) => v[1])?.[0]?.[0] || ""
      );
    };

    /**
     * Dada los coordenadas, retorna el elemento que existe en esa posición...
     * @param {*} param0
     * @returns
     */
    const getIndexCell = ({ x = 0, y = 0 }) => {
      for (let i = 0; i < SIZE; i++) {
        for (let c = 0; c < SIZE; c++) {
          const { l, t } = BOARD[i][c];
          if (x >= l && x <= l + CELL && y >= t && y <= t + CELL) {
            return BOARD[i][c];
          }
        }
      }
    };

    /**
     * Obtiene las coordenadas...
     * @param {*} e
     * @returns
     */
    const getPosition = (e) => {
      const { left, top } = e.target.getBoundingClientRect();
      const event = ["touchstart", "touchmove"].includes(e.type)
        ? e.touches[0] || e.changedTouches[0]
        : e;

      return {
        x: Math.floor(event.pageX - left),
        y: Math.floor(event.pageY - top),
      };
    };

    //Para la captura de los eventos...
    const handleEvent = {
      start: (e) => (eventMove.start = getPosition(e)),
      move: (e) => {
        if (eventMove.start && !eventMove.end) {
          const coordenates = getPosition(e);
          const origin = getIndexCell(eventMove.start);
          const destinity = getIndexCell(coordenates);
          const direction = getDirection(eventMove.start, coordenates);
          if (origin.i !== destinity?.i && direction) {
            const move = {
              left: [origin.p.i, origin.p.c + 1],
              right: [origin.p.i, origin.p.c - 1],
              bottom: [origin.p.i + 1, origin.p.c],
              top: [origin.p.i - 1, origin.p.c],
            }[direction];
            if (BOARD?.[move[0]]?.[move[1]]) {
              eventMove.end = coordenates;
              validateMove([origin, BOARD[move[0]][move[1]]]);
            } else {
              // TODO: Se debe validar el tipo de valor que tenía en start por que puede ser de un sólo click...
              eventMove = {};
            }
          }
        }
      },
      end: (e) => {
        console.log("EN end:", e.type);
        // TODO: Se debe validar el tipo de valor que tenía en start por que puede ser de un sólo click...
        eventMove = {};
      },
    };

    //Para los eventos...
    const addListenerMulti = (el, ...evts) => {
      for (let event of evts) {
        el.addEventListener(
          event[0],
          event[1],
          event[0].includes("touch") ? { passive: true } : false
        );
      }
    };

    addListenerMulti(
      $("board"),
      ["mousedown", handleEvent.start],
      ["mousemove", handleEvent.move],
      ["mouseup", handleEvent.end],
      ["touchstart", handleEvent.start],
      ["touchmove", handleEvent.move],
      ["touchend", handleEvent.end],
      ["mouseleave", handleEvent.end]
    );
  };

  const Screen = (screen = "Game", params = {}) => {
    const Handler = { Game };
    Handler[screen](params);
  };

  // Renderizar la base del juego...
  setHtml($("#root"), `<div id="render" class="df c wi he"></div>`);
  Screen();
  $on(document, "contextmenu", (event) => event.preventDefault());
})();
