(() => {
  // Utilidades
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  $(
    "html"
  ).style.cssText += `--h: ${HEIGHT}px; --w: ${WIDTH}px; --db: ${CELL}px`;
  const setHtml = (element, html) => (element.innerHTML = html);
  const ObjectKeys = (obj) => Object.keys(obj);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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

  const hasClass = (target, className) => {
    if (target) {
      className.split(" ").forEach((classText) => {
        return target.classList.contains(classText);
      });
    }
  };

  const classList = (target, className, type = "add") => {
    if (target) {
      className.split(" ").forEach((classText) => {
        target.classList[type](classText);
      });
    }
  };

  const inlineStyles = (styles) =>
    ObjectKeys(styles).length
      ? `style='${ObjectKeys(styles)
          .map((v) => `${v}:${styles[v]}`)
          .join(";")}'`
      : "";

  const uniqueValues = (value = []) => {
    const newValue = [];
    for (let i = 0; i < value.length; i++) {
      let exist = false;

      for (let c = 0; c < newValue.length; c++) {
        let counter = 0;
        for (let d = 0; d < newValue[c].length; d++) {
          counter += +(newValue[c][d] === value[i][d]);
        }

        if (counter === value[i].length) {
          exist = true;
          break;
        }
      }

      if (!exist) {
        newValue.push(value[i]);
      }
    }

    return newValue;
  };

  /*
  FILAS HORIZINTAL..
  COlumnas Vertical...
  */

  const Game = ({ BOARD = newBoard() }) => {
    const BOARD_ELEMENTS = ["💀", "🎃", "🕯️", "⚰️", "🧨"];
    // let BOARD_GAME = newBoard();

    // 💀 ⚰️ ⚱️ 👻 🩸 🪓 💣 🚀 🔫 🦇 🎃 🗡️ 🔥 💉 🧨
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
      `<div class="df f wi he"><button id="test">Generate</button><board>${RenderBoard(
        BOARD
      )}</board></div>`
    );

    $on($("#test"), "click", () => {
      BOARD = newBoard();
      console.log(BOARD);
      // console.log(isValidBoard(BOARD));
      setHtml($("board"), RenderBoard(BOARD));
    });

    const blockBoard = (d = false, o = false) =>
      classList(
        $("board"),
        `d${o || hasClass($("board"), "o") ? " o" : ""}`,
        d || o ? "add" : "remove"
      );

    // Función que valida si se ha hecho match de figuras...
    const validateMatch = (copyBoard = []) => {
      const validateLine = (r = 0, c = 0, v = 0, horizontal = true) => {
        const cells = [[r, c]];
        for (let times = 0; times < 2; times++) {
          let counter = 1;
          do {
            const increase = counter * (!times ? -1 : 1);
            const row = horizontal ? r : r + increase;
            const col = horizontal ? c + increase : c;
            if (
              col >= 0 &&
              col < SIZE &&
              row >= 0 &&
              row < SIZE &&
              copyBoard[row][col].v === v
            ) {
              cells.push([row, col]);
            } else {
              break;
            }
            counter++;
          } while (1);
        }
        return cells;
      };

      const validateSquare = (f = 0, c = 0, v = 0) => [
        [f, c],
        ...([
          [
            [f + 1, c],
            [f + 1, c + 1],
            [f, c + 1],
          ],
          [
            [f - 1, c],
            [f - 1, c + 1],
            [f, c + 1],
          ],
          [
            [f - 1, c],
            [f - 1, c - 1],
            [f, c - 1],
          ],
          [
            [f + 1, c],
            [f + 1, c - 1],
            [f, c - 1],
          ],
        ].find((s) => s.every((p) => copyBoard?.[p[0]]?.[p[1]]?.v === v)) ||
          []),
      ];

      const validations = [];
      for (let i = 0; i < SIZE; i++) {
        for (let c = 0; c < SIZE; c++) {
          const position = [i, c];
          const horizontal = validateLine(i, c, copyBoard[i][c].v);
          const vertical = validateLine(i, c, copyBoard[i][c].v, false);
          const square = validateSquare(i, c, copyBoard[i][c].v);
          const isGhost = square.length === 4;
          const isAxe = horizontal.length >= 4;
          const isSyringe = vertical.length >= 4;
          const isBoom = horizontal.length >= 3 && vertical.length >= 3;
          const prize = isBoom
            ? 9
            : isAxe
            ? 7
            : isSyringe
            ? 8
            : isGhost
            ? 6
            : 0;
          const itemsRemove = uniqueValues([
            ...(horizontal.length >= 3 ? horizontal : []),
            ...(vertical.length >= 3 ? vertical : []),
            ...(square.length >= 3 ? square : []),
          ]);
          validations.push({
            itemsRemove,
            position,
            prize,
          });
        }
      }

      const prizes = validations
        .map((v) => (v.prize ? v : []))
        .filter((v) => v.length !== 0);
      let listPrizes = [];

      for (let i = 0; i < prizes.length; i++) {
        const baseItems = prizes[i].itemsRemove;
        listPrizes.push([i]);

        for (let c = 0; c < prizes.length; c++) {
          if (c !== i) {
            const position = prizes[c].position;
            const exist =
              (
                baseItems.find(
                  (v) => v[0] === position[0] && v[1] === position[1]
                ) || []
              ).length !== 0;
            if (exist) {
              listPrizes[listPrizes.length - 1].push(c);
            }
          }
        }
      }

      listPrizes = uniqueValues(listPrizes.map((v) => v.sort()));
      const removePrizes = [];
      for (let i = 0; i < listPrizes.length; i++) {
        for (let c = 0; c < listPrizes.length; c++) {
          if (c !== i) {
            if (listPrizes[i].every((elem) => listPrizes[c].includes(elem))) {
              removePrizes.push(i);
            }
          }
        }
      }
      listPrizes = listPrizes.filter((_, i) => !removePrizes.includes(i));
      const finalPrizez = [];
      for (let i = 0; i < listPrizes.length; i++) {
        const randomPrize = randomNumber(0, listPrizes[i].length - 1);
        const prize = prizes[listPrizes[i][randomPrize]];
        finalPrizez.push([prize.position, prize.prize]);
      }

      const itemsRemove = uniqueValues(
        validations
          .map((v) => v.itemsRemove)
          .flat()
          .filter(
            (r) =>
              !(
                (
                  finalPrizez?.find(
                    (v) => v?.[0]?.[0] === r[0] && v?.[0]?.[1] === r[1]
                  ) || []
                ).length !== 0
              )
          )
      );

      return {
        itemsRemove,
        prizes: finalPrizez,
      };
    };

    const validateMove = async (move = []) => {
      // const make movement
      // await delay(70);
      // console.log("VALOR ORIGINAL", clone(move));
      // Se bloquea el board...
      blockBoard(true);
      // border: reverse ? '1px solid red' : '1px solid blue',
      // Mueve las figuras a su posición o la devuelve a donde estaban...
      const changePosition = (reverse = false) => {
        for (let i = 0; i < 2; i++) {
          addStyle($(`#t-${move[i].i}`), {
            left: `${move[reverse ? i : +!i].l}px`,
            top: `${move[reverse ? i : +!i].t}px`,
          });
        }
      };

      // Cambia la posición de las figuras..
      changePosition();
      // Se debe validar si hay match...
      const copyBoard = clone(BOARD);
      for (let i = 0; i < 2; i++) {
        copyBoard[move[i].p.i][move[i].p.c] = {
          ...copyBoard[move[i].p.i][move[i].p.c],
          v: move[+!i].v,
          i: move[+!i].i,
        };
      }
      const { itemsRemove = [], prizes = [] } = validateMatch(copyBoard);
      console.log("prizes", prizes);
      console.log("itemsRemove", itemsRemove);
      await delay(200);
      if (itemsRemove.length === 0) {
        changePosition(true);
        blockBoard();
      }
      // blockBoard();
      // for (let i = 0; i < 2; i++) {
      //   const next = +!i;
      //   addStyle($(`#t-${move[i].i}`), {
      //     left: `${move[next].l}px`,
      //     top: `${move[next].t}px`,
      //   });
      //   BOARD[move[i].p.i][move[i].p.c] = {
      //     ...BOARD[move[i].p.i][move[i].p.c],
      //     v: move[next].v,
      //     i: move[next].i,
      //   };
      // }
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
        // console.log("EN end:", e.type);
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
