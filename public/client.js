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
      for(let classText of className.split(" ")) {
        return target.classList.contains(classText);
      }
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
    const BOARD_ELEMENTS = [
      "💀",
      "🔥",
      "🧛",
      "🧟‍♂️",
      "👹",
      "🩸",
      "🪓",
      "💉",
      "💣",
    ];
    // const ICON_PRIZE = ["🩸", "🪓", "💉", "💣"];
    // let BOARD_GAME = newBoard();

    // 💀 ⚰️ ⚱️ 👻 🩸 🪓 💣 🚀 🔫 🦇 🎃 🗡️ 🔥 💉 🧨 🕯️ 🧟‍♂️
    const RenderBoard = (board = []) =>
      board
        .map((cell) =>
          cell
            .map(
              (v) =>
                `<item class="df a c" id="t-${`${v.i}`}" ${inlineStyles({
                  left: `${v.l}px`,
                  top: `${v.t}px`,
                })}>${BOARD_ELEMENTS[v.v - 1]}</item>`
            )
            .join("")
        )
        .join("");

    setHtml(
      $("#render"),
      `<div class="df f wi he" ${inlineStyles({
        "margin-top": "230px",
      })}>
      <h1>DeathMatch</h1>
      <p>Acá se muestra más data</p>
      <board>${RenderBoard(
        BOARD
      )}</board><button id="test">Generate</button></div>`
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

      /**
       * Se revisa cada posición, para saber si existe match
       * Se valida horizontal, vertical, cuadrado y L...
       */
      const validations = [];
      for (let i = 0; i < SIZE; i++) {
        for (let c = 0; c < SIZE; c++) {
          const position = [i, c];
          const horizontal = validateLine(i, c, copyBoard[i][c].v);
          const vertical = validateLine(i, c, copyBoard[i][c].v, false);
          const square = validateSquare(i, c, copyBoard[i][c].v);
          const isExtraLife = square.length === 4;
          const isHorizontal = horizontal.length >= 4;
          const isVertical = vertical.length >= 4;
          const isL = horizontal.length >= 3 && vertical.length >= 3;
          const prize = isL
            ? 9
            : isHorizontal
            ? 7
            : isVertical
            ? 8
            : isExtraLife
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

      // Se filtra sólo aquellos que tengan premios...
      const prizes = validations
        .map((v) => (v.prize ? v : []))
        .filter((v) => v.length !== 0);
      let listPrizes = [];

      // Se agrupa los premios similares...
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

      // Se ordena y se dejan sólo los premios similares...
      listPrizes = uniqueValues(listPrizes.map((v) => v.sort()));
      const removePrizes = [];
      // Se valida que premios contiene a los otros premios...
      for (let i = 0; i < listPrizes.length; i++) {
        for (let c = 0; c < listPrizes.length; c++) {
          if (c !== i) {
            if (listPrizes[i].every((elem) => listPrizes[c].includes(elem))) {
              removePrizes.push(i);
            }
          }
        }
      }
      // Se deja los premios que no sean repetidos...
      listPrizes = listPrizes.filter((_, i) => !removePrizes.includes(i));
      const finalPrizez = [];
      // De los premios que quedan, se obtiene aleatoriamente el premio que se dará...
      for (let i = 0; i < listPrizes.length; i++) {
        const randomPrize = randomNumber(0, listPrizes[i].length - 1);
        const prize = prizes[listPrizes[i][randomPrize]];
        finalPrizez.push([prize.position, prize.prize]);
      }

      // Se devuevel los items que se deben ir del board...
      // Además se saca de la lista la posición de los premios..
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

    // Mueve las figuras a su posición o la devuelve a donde estaban...
    const changePositionElements = (move = [], reverse = false) => {
      for (let i = 0; i < 2; i++) {
        addStyle($(`#t-${move[i].i}`), {
          left: `${move[reverse ? i : +!i].l}px`,
          top: `${move[reverse ? i : +!i].t}px`,
        });
      }
    };

    const tmpRenderBoardConsole = (tmpBoard = []) => {
      for (let i = 0; i < SIZE; i++) {
        let tmpCol = "";
        for (let c = 0; c < SIZE; c++) {
          if (tmpBoard[i][c].v) {
            tmpCol += BOARD_ELEMENTS[tmpBoard[i][c].v - 1];
          } else {
            tmpCol += "🚫";
          }
        }
        console.log(tmpCol);
      }
    };

    const removeAnimateBoardElements = async (
      copyBoard = [],
      itemsRemove = [],
      prizes = []
    ) => {
      console.log("itemsRemove", itemsRemove);
      console.log("prizes", prizes);
      //❤️

      // Test de cambiar el valor por el premio...
      console.log("itera prizes");
      for (let i = 0; i < prizes.length; i++) {
        // Se cambia en el board el valor del premio...
        copyBoard[prizes[i][0][0]][prizes[i][0][1]].v = prizes[i][1];
        // Se renderiza el primeio en el HTML...
        setHtml(
          $(`#t-${copyBoard[prizes[i][0][0]][prizes[i][0][1]].i}`),
          BOARD_ELEMENTS[prizes[i][1] - 1]
        );
      }
      // Test de ocultar...
      // // for (let i = 0; i < SIZE; i++) {
      // //   for (let c = 0; c < SIZE; c++) {
      // //     const {i:id = 0} = copyBoard[i][c];
      // //     classList($(`#t-${id}`), "h");
      // //   }
      // // }
      const originalItemsRemove = [];
      for (let i = 0; i < itemsRemove.length; i++) {
        // El valor (v) se necesita para el puntaje v = 0...
        const { i: id = 0 } = copyBoard[itemsRemove[i][0]][itemsRemove[i][1]];
        originalItemsRemove.push(id);
        // Se añade la clase de ocultar los elementos...
        classList($(`#t-${id}`), "h");
        // Se establece que el valor en 0 en el board, para así imdicar que se han eliminado
        // y se pueda validar los espacios vacíos...
        copyBoard[itemsRemove[i][0]][itemsRemove[i][1]].v = 0;
      }

      // Ahora se debe traer la cantidad de elementos que hay en el board...
      // Para así determinar cuales no se deben mostrar en la nueva board...
      // const BOARD_ELEMENTS = ["💀", "🔥", "🧛", "🧟‍♂️", "👹"];
      const newBoardItems = newBoard(
        new Array(MAX_ELEMENTS)
          .fill(null)
          .map((_, i) => [i + 1, elementOnBoard(copyBoard, i + 1).length])
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2)
          .map((v) => v[0])
      );
      // Ahora se debe determinar los espacios vacíos que han quedado...
      // En este caso hacia abajo para así saber los espacios que quedan arriba
      // y que se deben completar con los nuevos ítemas de la nueva board...
      console.log("ITERA EL BOARD");
      // debugger;
      for (let i = 0; i < SIZE; i++) {
        for (let c = 0; c < SIZE; c++) {
          // Tiene un elemento y no tiene base...
          if (
            c + 1 < SIZE &&
            copyBoard[c][i].v &&
            !copyBoard?.[c + 1]?.[i]?.v
          ) {
            // Ahora mover hacia abajo uno los elementos que están arriba...
            for (let d = c; d >= 0; d--) {
              if (d + 1 < SIZE && copyBoard?.[d]?.[i]?.v) {
                copyBoard[d + 1][i].v = copyBoard[d][i].v;
                copyBoard[d + 1][i].i = copyBoard[d][i].i;
                copyBoard[d][i].v = 0;
              }
            }
          }
        }
      }
      // Temporal para ver el nuevo board cuando se mueve hacia abajo...
      // Temporal para ver el nuevo board cuando se mueve hacia abajo...
      // console.log("newBoardItems", newBoardItems);
      console.log("newBoardItems");
      tmpRenderBoardConsole(newBoardItems);

      console.log("copyBoard CON ESPACIONS");
      tmpRenderBoardConsole(clone(copyBoard));

      console.log("originalItemsRemove", originalItemsRemove);
      // Guarda las posiciones desde donde empezarán los ítems a moverse cuando cae...
      const positionsItemsRemove = [];
      // Guarda el índice de los elementos que se adicionan al board...
      // es necesario por si el board no tiene solución...
      const newIndexItemsBoard = [];
      let counterItems = 0;
      // Ahora hacer el merge entre las dos boards...
      for (let i = 0; i < SIZE; i++) {
        for (let c = 0; c < SIZE; c++) {
          if (!copyBoard[i][c].v) {
            copyBoard[i][c].v = newBoardItems[i][c].v;
            copyBoard[i][c].i = originalItemsRemove[counterItems];
            newIndexItemsBoard.push([i, c]);
            positionsItemsRemove.push({
              i: originalItemsRemove[counterItems],
              l: Math.round(CELL * c),
              t: Math.round((CELL * i + CELL) * -1),
            });

            // classList($(`#t-${originalItemsRemove[counterItems]}`), 'v',);
            // classList($(`#t-${originalItemsRemove[counterItems]}`), 'h', "remove");
            // addStyle($(`#t-${originalItemsRemove[counterItems]}`), {
            //   left: `${Math.round(CELL * c)}px`,
            //   top: `${Math.round(((CELL * i) + CELL) * -1)}px`,
            // });
            setHtml(
              $(`#t-${originalItemsRemove[counterItems]}`),
              BOARD_ELEMENTS[newBoardItems[i][c].v - 1]
            );

            counterItems++;
          }
        }
      }

      // Como no es válido, se pondrá un premio de forma aletoria...
      if (!isValidBoard(copyBoard).isValid) {
        console.log("PONER UN PREMIO DE FORMA ALETORIA EN LOS NUEVOS");
        console.log("newIndexItemsBoard", newIndexItemsBoard);
        console.log("EL TAMAÑO: ", newIndexItemsBoard.length);
        const randomPosition = randomNumber(0, newIndexItemsBoard.length - 1);
        const positions = newIndexItemsBoard[randomPosition];
        console.log({ randomPosition, positions });
        copyBoard[positions[0]][positions[1]].v = randomNumber(7, 9);
        setHtml(
          $(`#t-${copyBoard[positions[0]][positions[1]].i}`),
          BOARD_ELEMENTS[copyBoard[positions[0]][positions[1]].v - 1]
        );
      }

      console.log("MERGE!!");
      tmpRenderBoardConsole(copyBoard);
      console.log("newIndexItemsBoard", newIndexItemsBoard);
      await delay(100);
      for (let i = 0; i < positionsItemsRemove.length; i++) {
        classList($(`#t-${positionsItemsRemove[i].i}`), "v");
        addStyle($(`#t-${positionsItemsRemove[i].i}`), {
          left: `${positionsItemsRemove[i].l}px`,
          top: `${positionsItemsRemove[i].t}px`,
        });
      }
      await delay(200);
      for (let i = 0; i < positionsItemsRemove.length; i++) {
        classList($(`#t-${positionsItemsRemove[i].i}`), "h", "remove");
      }

      // await delay(100);
      // // Poner la ubicación de inicio de los nuevos...
      // for(let i = 0; i < originalItemsRemove.length; i++) {
      //   classList($(`#t-${originalItemsRemove[i]}`), 'h', "remove");

      //   classList($(`#t-${originalItemsRemove[counterItems]}`), 'v',);
      // }
      await delay(100);

      // for(let i = 0; i < originalItemsRemove.length; i++) {
      //   classList($(`#t-${originalItemsRemove[i].i}`), 'h', "remove");
      //   addStyle($(`#t-${originalItemsRemove[i].i}`), {
      //     border: `1px solid red`,
      //     top: `${(CELL * (i + 1)) * -1}px`,
      //   });
      // }

      // Prueba de caída...
      for (let i = 0; i < SIZE; i++) {
        for (let c = 0; c < SIZE; c++) {
          if (copyBoard[i][c].v) {
            const item = $(`#t-${copyBoard[i][c].i}`);
            if (hasClass(item, "v")) {
              classList(item, "v", "remove");
            }

            addStyle(item, {
              left: `${copyBoard[i][c].l}px`,
              top: `${copyBoard[i][c].t}px`,
            });
          }
        }
      }

      BOARD = copyBoard;
      await delay(300);

      const { itemsRemove: newItemsRemove = [], prizes: newPrizes = [] } =
        validateMatch(BOARD);
      if (newItemsRemove.length !== 0) {
        removeAnimateBoardElements(BOARD, newItemsRemove, newPrizes);
      } else {
        blockBoard();
      }
    };

    /**
     * Función que valida el movimiento (swipe) dle usuario para saber si hay match...
     * @param {*} move
     */
    const validateMove = async (move = []) => {
      // Se bloquea el board...
      blockBoard(true);
      // Cambia la posición de las figuras..
      changePositionElements(move);
      // Se clona el board y se cambia las posiciones...
      const copyBoard = clone(BOARD);
      for (let i = 0; i < 2; i++) {
        copyBoard[move[i].p.i][move[i].p.c] = {
          ...copyBoard[move[i].p.i][move[i].p.c],
          v: move[+!i].v,
          i: move[+!i].i,
        };
      }
      await delay(200);
      // Se debe validar si hay match...
      const { itemsRemove = [], prizes = [] } = validateMatch(copyBoard);
      if (itemsRemove.length !== 0) {
        removeAnimateBoardElements(copyBoard, itemsRemove, prizes);
      } else {
        // Como no hay match, se devuelve los elementos a su posición original...
        changePositionElements(move, true);
        blockBoard();
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
