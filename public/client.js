(() => {
  // Utilidades
  const CACHE_KEY = "death-match";
  const COLOR = { b: "#1e90ff", r: "#ff0000" };
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  $(
    "html"
  ).style.cssText += `--h: ${HEIGHT}px; --w: ${WIDTH}px; --db: ${CELL}px`;
  const setHtml = (element, html) => {
    if (element) element.innerHTML = html;
  };
  const ObjectKeys = (obj) => Object.keys(obj);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const clone = (value) => JSON.parse(JSON.stringify(value));

  //STORAGE
  /**
   * Guadar la información dada en localStorage/sessionStorage
   * @param {*} data
   */
  const saveCache = (data) =>
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));

  /**
   * Obtener la data que está guardarda en localStorage
   */
  const getDataCache = () =>
    localStorage.getItem(CACHE_KEY)
      ? JSON.parse(localStorage.getItem(CACHE_KEY))
      : {};

  /**
   * Guarda valores de una propiedad en localstorage
   * @param {*} property
   * @param {*} value
   */
  const savePropierties = (property, value) => {
    const localCache = getDataCache();
    localCache[property] = value;
    saveCache(localCache);
  };

  /**
   * Dada una propiedad, devuelve la información de la misma
   */
  const getValueFromCache = (key = "", initial) =>
    getDataCache()[key] || initial;

  const getUser = () => [
    ...["name", "token"].map((v) => getValueFromCache(v, "")),
  ];
  // FIN STORAGE

  const debounce = (fn, delay) => {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, delay);
    };
  };

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
      for (let classText of className.split(" ")) {
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

  const chronometer = (cb, options) => {
    console.log(options);
    const { base = 100, inc = -1, int = 250 } = options || {};
    let interval;
    let counter = base;

    const pause = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const tick = () => {
      interval = setInterval(() => {
        counter += inc;
        if (counter <= 0) {
          pause();
        }

        cb(counter);
      }, int);
    };

    const start = () => {
      counter = base;
      tick();
    };

    return {
      tick,
      start,
      pause,
    };
  };

  const newArray = (size = 2, cb) =>
    new Array(size)
      .fill(null)
      .map((_, i) => cb(i, (v) => v))
      .join("");

  const Back = () => `<button id=back>⬅️</button>`;
  // $on($("#back"), "click", () => Screen("Lobby"))
  /*
  FILAS HORIZINTAL..
  COlumnas Vertical...
  */

  /*
  type:
  0, vs mismo device...
  1, vs la máquina...
  2, realtime...
  */
  const Game = ({
    BOARD = newBoard(),
    typeGame = 0,
    users = {},
    level = 0,
  }) => {
    const BOARD_ELEMENTS = [
      "💀",
      "🎃",
      "🧛",
      "🔥",
      "👹",
      "🧨",
      "🪓",
      "🚀",
      "💣",
    ];
    // 💀 ⚰️ ⚱️ 👻 🩸 🪓 💣 🚀 🔫 🦇 🎃 🗡️ 🔥 💉 🧨 🕯️ 🧟‍♂️ 😈
    const indexCurrentUser = users.users.findIndex(
      (v) => v[1] === getUser()[1]
    );
    const orderUsers = [indexCurrentUser, !indexCurrentUser ? 1 : 0];
    const userData = [
      ["one", "c"],
      ["two", "o"],
    ]
      .map((v, i) => ({
        [v[0]]: {
          p: 0,
          m: 2,
          c: COLOR[users.users[orderUsers[i]][2]],
          n: users.users[orderUsers[i]][0],
          t: users.users[orderUsers[i]][1],
        },
      }))
      .reduce((a, s) => ({ ...a, ...s }), {});

    console.log("userData");
    console.log(userData);

    // // let counterProgress = 100;
    let counterTimer = 0;
    let playerHasTurn = users.turn === userData.one.t ? "one" : "two";
    console.log({ playerHasTurn });

    const progress = chronometer((counter) => {
      if (counter > 0) {
        counterTimer = counter;
        if ($("progress")) {
          $("progress").value = counter;
        }
      } else {
        validateTurn();
      }
    });

    const validateTurn = (initial = false) => {
      playerHasTurn = !initial
        ? playerHasTurn === "one"
          ? "two"
          : "one"
        : playerHasTurn;
      setHtml(
        $("#tupl"),
        playerHasTurn === "one" ? "Your Turn" : "Opponent's Turn"
      );
      // Poner el número de  movimientos para ambos de nuevo...
      userData.two.m = userData.one.m = 2;
      const isBoardBlocked = typeGame !== 1 ? playerHasTurn === "two" : false;
      blockBoard(isBoardBlocked, isBoardBlocked);

      progress.start();

      if (typeGame === 2 && playerHasTurn === "two") {
        console.log("DEBE JUGAR EL BOT");
        playIA();
      }
    };

    const playIA = debounce(() => {
      // Obtener los posibles movimientos...
      if (playerHasTurn === "one") return;
      const moves = isValidBoard(BOARD).values;
      const difficulty = level === 2 ? (randomNumber(0, 1) ? 1 : 3) : level;
      const elements = ["three", "dynamite", "axe", "rocket", "four", "bomb"];
      const order =
        difficulty === 1
          ? [0, 1, 2, 3, 4, 5]
          : counterTimer <= 30
          ? [5, 3, 2, 1, 4, 0]
          : [4, 5, 3, 2, 1, 0];
      const posible = {};
      for (let i = 0; i < order.length; i++) {
        console.log(elements[order[i]]);
        if (moves[elements[order[i]]].length !== 0) {
          posible.type = elements[order[i]];
          posible.value = moves[elements[order[i]]];
          break;
        }
      }
      const indexLaunch = randomNumber(0, posible.value.length - 1);
      console.log("posible", posible);
      console.log(moves);
      console.log({ difficulty, indexLaunch });
      if (["three", "four"].includes(posible.type)) {
        const movingValues = [];
        if (posible.type === "three") {
          // Random de las opciones...
          const randomPosition = randomNumber(
            0,
            posible.value[indexLaunch].length - 1
          );
          const indexCanMove = randomNumber(
            0,
            posible.value[indexLaunch][randomPosition][3].length - 1
          );
          const origin = posible.value[indexLaunch][randomPosition][2];
          const destinity =
            posible.value[indexLaunch][randomPosition][3][indexCanMove];
          console.log({ randomPosition, indexCanMove, origin, destinity });
          movingValues[0] = BOARD[origin[0]][origin[1]];
          movingValues[1] = BOARD[destinity[0]][destinity[1]];
        }
        validateMove(movingValues);

        // const indexes = posible.type === "three" ? [3, 2] : [2, 1];
        // const indexCanMove = randomNumber(0, posible.value[indexLaunch][indexes[0]].length - 1);
        // const origin = posible.value[indexLaunch][indexes[1]];
        // const destinity = posible.value[indexLaunch][indexes[0]][indexCanMove];
        // const movingValues = [BOARD[origin[0]][origin[1]], BOARD[destinity[0]][destinity[1]]];
        // validateMove(movingValues);
      }

      // if(["dynamite", "axe", "rocket", "bomb"].includes(posible.type)) {
      //   validateClick();
      // }
    }, [2000, 500, 300][level - 1]);

    /**
     * Blquea el board y le pone una capa si es necesario...
     * @param {*} d
     * @param {*} o
     * @returns
     */
    const blockBoard = (d = false, o = false) =>
      classList(
        $("board"),
        `d${o || hasClass($("board"), "o") ? " o" : ""}`,
        d || o ? "add" : "remove"
      );

    /**
     * Dada un board, valida si se ha hecho match...
     * @param {*} copyBoard
     * @returns
     */
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

    /**
     * Dado un tipo de premio y la matriz, se devuelve los ítems que se debe eliminar en el board...
     * Además si entre los ítems que se eliminan hay un premio, se llama de forma recursiva
     * para así eliminar sus vlaores...
     * @param {*} prize
     * @param {*} copyBoard
     * @param {*} previusPrizes
     * @returns
     */
    const removeItemsFromPrize = (
      prize = [],
      copyBoard = [],
      previusPrizes = []
    ) => {
      let itemsRemove = [[prize[0][0], prize[0][1]]];
      // 🧨
      if (prize[1] === 6) {
        const items = [
          [-1, 0],
          [-1, -1],
          [0, -1],
          [1, -1],
          [1, 0],
          [-1, 1],
          [0, 1],
          [1, 1],
        ];

        for (let i = 0; i < items.length; i++) {
          const row = prize[0][0] + items[i][0];
          const col = prize[0][1] + items[i][1];
          if (copyBoard?.[row]?.[col]) {
            itemsRemove.push([row, col]);
          }
        }
      }

      // 🪓 ó 🚀
      if (prize[1] === 7 || prize[1] === 8) {
        const base = prize[0][prize[1] === 8 ? 1 : 0];
        for (let counter = 0; counter < SIZE; counter++) {
          const row = prize[1] === 7 ? base : counter;
          const col = prize[1] === 7 ? counter : base;
          if (copyBoard?.[row]?.[col]) {
            itemsRemove.push([row, col]);
          }
        }
      }

      // 💣
      if (prize[1] === 9) {
        const initialRow = prize[0][0] - 2;
        const initialCol = prize[0][1] - 2;

        for (let i = initialRow; i < initialRow + 5; i++) {
          for (let c = initialCol; c < initialCol + 5; c++) {
            if (copyBoard?.[i]?.[c]) {
              itemsRemove.push([i, c]);
            }
          }
        }
      }

      itemsRemove = uniqueValues(itemsRemove);
      let newItemsRemove = [];
      for (let i = 0; i < itemsRemove.length; i++) {
        const position = itemsRemove[i];
        const value = copyBoard[position[0]][position[1]].v;

        if (itemIsPrize(value)) {
          const isCurretPrize =
            position[0] === prize[0][0] && position[1] === prize[0][1];
          let prizeProcessed = false;

          if (!isCurretPrize) {
            for (let d = 0; d < previusPrizes.length; d++) {
              const previusPosition = previusPrizes[d][0];

              if (
                previusPosition[0] === position[0] &&
                previusPosition[1] === position[1]
              ) {
                prizeProcessed = true;
                break;
              }
            }
          }

          if (!isCurretPrize && !prizeProcessed) {
            newItemsRemove.push(
              removeItemsFromPrize([position, value], copyBoard, [
                ...previusPrizes,
                ...[prize],
              ])
            );
          }
        }
      }
      itemsRemove = uniqueValues([...itemsRemove, ...newItemsRemove.flat()]);
      return itemsRemove;
    };

    /**
     * Mueve las figuras a su posición o la devuelve a donde estaban
     * @param {*} move
     * @param {*} reverse
     */
    const changePositionElements = (move = [], reverse = false) => {
      for (let i = 0; i < 2; i++) {
        addStyle($(`#t-${move[i].i}`), {
          left: `${move[reverse ? i : +!i].l}px`,
          top: `${move[reverse ? i : +!i].t}px`,
        });
      }
    };

    /**
     * Agrega el label de movimiento extra en el board...
     * Pasado un tiempo, lo elimina del Dom
     * @param {*} row
     * @param {*} col
     */
    const renderExtraMove = async (row = 0, col = 0) => {
      const element = document.createElement("div");
      const id = `ex-${randomNumber(1, 1000)}`;
      element.innerHTML = "EXTRA MOVE!";
      element.className = "df a c extra";
      const posiblePositions = [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ];
      for (let i = 0; i < posiblePositions.length; i++) {
        const newRow = row + posiblePositions[i][0];
        const newCol = col + posiblePositions[i][1];
        if (newRow >= 0 && newRow < SIZE && newCol >= 0 && newCol < SIZE) {
          element.style.left = Math.round(CELL * newCol) + "px";
          element.style.top = Math.round(CELL * newRow) + "px";
          break;
        }
      }
      element.setAttribute("id", id);
      if ($("board")) {
        $("board").appendChild(element);
        await delay(10);
        classList($(`#${id}`), "s");
        await delay(1000);
        classList($(`#${id}`), "h");
        await delay(500);
        $(`#${id}`)?.remove();
      }
    };

    /**
     * Dada la board, los premios y los ítemas a eliminar
     * realiza la animación, además ontiene el nuevo board que se generará...
     * @param {*} copyBoard
     * @param {*} itemsRemove
     * @param {*} prizes
     */
    const removeAnimateBoardElements = async (
      copyBoard = [],
      itemsRemove = [],
      prizes = []
    ) => {
      progress.pause();
      // Se establecen los premios...
      for (let i = 0; i < prizes.length; i++) {
        // Se cambia en el board el valor del premio...
        copyBoard[prizes[i][0][0]][prizes[i][0][1]].v = prizes[i][1];
        // Se renderiza el primeio en el HTML...
        setHtml(
          $(`#t-${copyBoard[prizes[i][0][0]][prizes[i][0][1]].i}`),
          BOARD_ELEMENTS[prizes[i][1] - 1]
        );

        if (itemIsPrize(prizes[i][1]) && prizes[i][1] !== 9) {
          renderExtraMove(prizes[i][0][0], prizes[i][0][1]);
        }
      }

      // Se ocultan los elementos que se destruyen...
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

        // TODO: se debe mostrar el puntage dependiendo del usuario
        // Para establecer el puntaje
      }

      // Para la puntuación...
      userData[playerHasTurn].p += itemsRemove.length;
      setHtml(
        $(`#scv-${playerHasTurn === "one" ? 1 : 2}`),
        userData[playerHasTurn].p
      );

      // Ahora se debe traer la cantidad de elementos que hay en el board...
      // Para así determinar cuales no se deben mostrar en la nueva board...
      // const BOARD_ELEMENTS = ["💀", "🔥", "🧛", "🧟‍♂️", "👹"];
      const newBoardItems = newBoard(
        new Array(MAX_ELEMENTS)
          .fill(null)
          .map((_, i) => [i + 1, elementOnBoard(copyBoard, i + 1).length])
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2)
          .filter((v) => v[1] >= 4)
          .map((v) => v?.[0])
      );
      // Ahora se debe determinar los espacios vacíos que han quedado...
      // En este caso hacia abajo para así saber los espacios que quedan arriba
      // y que se deben completar con los nuevos ítemas de la nueva board...
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

      // Saber los espacios que quedan, para así indicar el punto de partida de las figuras...
      const spaces = [];
      for (let i = 0; i < SIZE; i++) {
        let counter = 0;
        for (let c = 0; c < SIZE; c++) {
          counter += +!copyBoard[c][i].v;
        }
        spaces.push(counter);
      }

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
              t: Math.round(CELL * (spaces[c] - i) * -1),
            });

            counterItems++;
          }
        }
      }

      // Como no es válido, se pondrá un premio de forma aletoria...
      if (!isValidBoard(copyBoard).isValid) {
        const randomPosition = randomNumber(0, newIndexItemsBoard.length - 1);
        const positions = newIndexItemsBoard[randomPosition];
        copyBoard[positions[0]][positions[1]].v = randomNumber(7, 9);
      }

      await delay(100);
      for (let i = 0; i < positionsItemsRemove.length; i++) {
        classList($(`#t-${positionsItemsRemove[i].i}`), "v");
        addStyle($(`#t-${positionsItemsRemove[i].i}`), {
          left: `${positionsItemsRemove[i].l}px`,
          top: `${positionsItemsRemove[i].t}px`,
        });
      }
      await delay(100);
      for (let i = 0; i < positionsItemsRemove.length; i++) {
        classList($(`#t-${positionsItemsRemove[i].i}`), "h", "remove");
      }

      await delay(100);

      // Caída...
      for (let i = 0; i < SIZE; i++) {
        for (let c = 0; c < SIZE; c++) {
          if (copyBoard[i][c].v) {
            const item = $(`#t-${copyBoard[i][c].i}`);
            if (hasClass(item, "v")) {
              classList(item, "v", "remove");
              setHtml(item, BOARD_ELEMENTS[copyBoard[i][c].v - 1]);
            }

            addStyle(item, {
              left: `${copyBoard[i][c].l}px`,
              top: `${copyBoard[i][c].t}px`,
            });
          }
        }
      }

      BOARD = copyBoard;
      await delay(200);

      const { itemsRemove: newItemsRemove = [], prizes: newPrizes = [] } =
        validateMatch(BOARD);
      if (newItemsRemove.length !== 0) {
        removeAnimateBoardElements(BOARD, newItemsRemove, newPrizes);
      } else {
        progress.tick();
        if (typeGame === 1 || (typeGame > 1 && playerHasTurn === "one")) {
          blockBoard();
        }

        if (typeGame === 2 && playerHasTurn === "two") {
          playIA();
        }
      }
    };

    /**
     * Determina si el valor dado es un valor de premio...
     * @param {*} value
     * @returns
     */
    const itemIsPrize = (value) => [6, 7, 8, 9].includes(value);

    /**
     * Valida sí sólo se ha hecho click/touch a un elemento
     * En este caso para saber si es un premio, el cual se puede ejecutar
     * dando sólo click...
     * @param {*} element
     */
    const validateClick = (element = {}) => {
      if (itemIsPrize(element?.v)) {
        removeAnimateBoardElements(
          BOARD,
          removeItemsFromPrize([[element.p.i, element.p.c], element.v], BOARD)
        );
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
      const movesPrizes = [];
      for (let i = 0; i < 2; i++) {
        const row = move[i].p.i;
        const col = move[i].p.c;
        const value = move[+!i].v;
        const id = move[+!i].i;
        copyBoard[row][col] = {
          ...copyBoard[row][col],
          v: value,
          i: id,
        };

        if (itemIsPrize(value)) {
          movesPrizes.push([[row, col], value]);
        }
      }
      await delay(200);
      // Se debe validar si hay match...
      let { itemsRemove = [], prizes = [] } = validateMatch(copyBoard);
      // Se han movido premios, así que se debe validar los elementos que se eliminan...
      if (movesPrizes.length !== 0) {
        for (let i = 0; i < movesPrizes.length; i++) {
          itemsRemove = uniqueValues([
            ...itemsRemove,
            ...removeItemsFromPrize(movesPrizes[i], copyBoard),
          ]);
        }

        // Sacar los premios que se habían calculado...
        itemsRemove = itemsRemove.filter(
          (r) =>
            !(
              (
                prizes?.find(
                  (v) => v?.[0]?.[0] === r[0] && v?.[0]?.[1] === r[1]
                ) || []
              ).length !== 0
            )
        );
      }

      if (itemsRemove.length !== 0) {
        removeAnimateBoardElements(copyBoard, itemsRemove, prizes);
      } else {
        // Como no hay match, se devuelve los elementos a su posición original...
        changePositionElements(move, true);
        blockBoard();
      }
    };

    const RenderScore = () =>
      `<div class="sc df a c f wi"><div class="scn"><div class="df wi he">${newArray(
        2,
        (i) =>
          `<div class="scv df a c" id=scv-${i + 1} ${inlineStyles({
            background: userData[!i ? "one" : "two"].c,
          })}>0</div>`
      )}</div><div class="sci wi df a s">${newArray(
        5,
        (i) => `<div id=in-${i + 1}>${i + 1}</div>`
      )}</div></div></div>`;

    // Your Turn - Opponent's Turn
    const RenderTurn = () => {
      const Names = (name = "", id = 1) =>
        `<div class="tuna df a c" id="na-${id}">${name}</div>`;

      const Turns = (p) =>
        newArray(
          2,
          (i) =>
            `<div class="tuni" id=mov-${p}-${i} ${inlineStyles({
              background: userData[p === 1 ? "one" : "two"].c,
            })}></div>`
        );

      return `<div class="tu wi"><div class="tun df a s wi">${Names(
        userData.one.n
      )}<div class="df">${newArray(
        2,
        (i) => `<div class="df">${Turns(i + 1)}</div>`
      )}</div>${Names(
        userData.two.n,
        2
      )}</div><div class="tup wi"><progress class="wi" value="100" max="100"></progress><div class="wi" id="tupl"></div></div></div>`;
    };

    // Renderizar la parte superior del juego...
    const RenderTop = () =>
      `<top class="wi">${RenderScore()}${RenderTurn()}</top>`;

    const RenderBoard = () =>
      `<board>${BOARD.map((cell) =>
        cell
          .map(
            (v) =>
              `<item class="df a c" id="t-${`${v.i}`}" ${inlineStyles({
                left: `${v.l}px`,
                top: `${v.t}px`,
              })}>${BOARD_ELEMENTS[v.v - 1]}</item>`
          )
          .join("")
      ).join("")}</board>`;

    const Overlay = () => `<div class="df a c wi he" id=ov></div>`;

    // Renderizar el UI...
    setHtml(
      $("#render"),
      `<div class="ba df f wi he">${Overlay()}${Back()}${RenderTop()}${RenderBoard()}</div>`
    );

    // Back()[1];

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
      start: (e) => {
        if (typeGame === 1 || (typeGame > 1 && playerHasTurn === "one")) {
          eventMove.start = getPosition(e);
        }
      },
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
              validateClick(getIndexCell(eventMove.start));
              eventMove = {};
            }
          }
        }
      },
      end: () => {
        eventMove?.start &&
          !eventMove?.end &&
          validateClick(getIndexCell(eventMove.start));
        eventMove = {};
      },
    };

    //Para los eventos...
    const addListenerMulti = (el, evts) => {
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
      [
        [["mousedown", "touchstart"], "start"],
        [["mousemove", "touchmove"], "move"],
        [["mouseup", "touchend", "mouseleave"], "end"],
      ]
        .map((v) => v[0].map((d) => [d, handleEvent[v[1]]]))
        .flat()
    );

    // Inicia el juego...
    // console.log({ playerHasTurn });
    // console.log("userData", userData);
    console.log("EL TIPO", { typeGame });
    console.log("LOS USERS", users);
    console.log("el level:", level);
    // blockBoard(true, true);
    // progress.start(() => {
    //   blockBoard(true, true);
    //   // console.log("TERMINA");
    // });

    const initialCounter = 3;
    setHtml($("#ov"), initialCounter);
    const initialTimer = chronometer(
      (counter) => {
        setHtml($("#ov"), counter);
        if (counter === 0) {
          console.log("INICIA EL JUEGO");
          $("#ov").remove();
          validateTurn(true);
        }
      },
      { base: initialCounter, int: 1000 }
    );
    initialTimer.start();

    $on($("#back"), "click", () => {
      initialTimer.pause();
      progress.pause();
      Screen("Lobby");
    });
  };

  const RenderListButtons = (btns = []) =>
    `<div class="df a c f mBs">${btns
      .map((v, i) => `<button id="el-${i}" class="mB wi">${v}</button>`)
      .join("")}</div>`;

  const evenListButtons = (cb) =>
    $$(".mBs > button").forEach((btn) =>
      $on(btn, "click", (e) => cb(+e.target.id.split("-")[1]))
    );

  // <span>💀</span>
  const Logo = () => `<div class="lg df a c f"><h1>DEATH MATCH</h1></div>`;

  const Difficulty = () => {
    setHtml(
      $("#render"),
      `<div class="ba df f a wi he">${Back()}${Logo()}${RenderListButtons([
        "EASY",
        "MEDIUM",
        "HARD",
      ])}</div>`
    );

    evenListButtons((type) => {
      Screen("Game", {
        typeGame: 2,
        level: type + 1,
        users: setOrder([getUser(), ["Bot", "bot"]]),
      });
    });
  };

  const Lobby = () => {
    setHtml(
      $("#render"),
      `<div class="ba df f a wi he">${Logo()}${RenderListButtons([
        "TWO PLAYERS",
        "VS BOT",
        "PLAY WITH FRIENDS",
        "PLAY ONLINE",
      ])}</div>`
    );

    evenListButtons((type) => {
      if (type === 0) {
        return Screen("Game", {
          typeGame: 1,
          users: setOrder([getUser(), ["Guest", "guest"]]),
        });
      }

      if (type === 1) {
        return Screen("Difficulty");
      }
    });
  };

  const Screen = (screen = "Lobby", params = {}) => {
    const Handler = { Game, Lobby, Difficulty };
    Handler[screen](params);
  };

  const onWindowResize = debounce(
    () =>
      addStyle($("#render"), {
        transform:
          window.innerWidth < WIDTH || window.innerHeight < HEIGHT
            ? `scale(${Math.min(
                window.innerWidth / WIDTH,
                window.innerHeight / HEIGHT
              )}) translate(${
                window.innerWidth < WIDTH
                  ? Math.round((window.innerWidth - WIDTH) / 2)
                  : 0
              }px, 0)`
            : "none",
      }),
    50
  );

  if (!ObjectKeys(getDataCache()).length) {
    [
      ["name", `Zombie ${randomNumber(2, 100)}`],
      ["token", guid()],
    ].forEach((v) => savePropierties(v[0], v[1]));
  }

  // Renderizar la base del juego...
  setHtml($("#root"), `<div id="render" class="df c wi he"></div>`);
  Screen();
  $on(document, "contextmenu", (event) => event.preventDefault());
  $on(window, "resize", onWindowResize);
  onWindowResize();
})();
