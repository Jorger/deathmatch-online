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
        console.log("ANTES DEL CAMBIO");
        console.log(clone(BOARD));
        console.log(move);
        console.log("ORIGEN MUEVE A: ", `#t-${move[0].i}`, { left : `${move[1].l}px`, top: `${move[1].t}px` });
        console.log("DESTINO MUEVE A: ", `#t-${move[1].i}`, { left : `${move[0].l}px`, top: `${move[0].t}px` });
        addStyle($(`#t-${move[0].i}`), { left : `${move[1].l}px`, top: `${move[1].t}px` });
        addStyle($(`#t-${move[1].i}`), { left : `${move[0].l}px`, top: `${move[0].t}px` });
        console.log(move[0].p, move[1].p);
        // const origin = clone(BOARD[move[0].p.c][move[0].p.c]);
        // const destinity = clone(BOARD[move[1].p.c][move[1].p.c]);
        BOARD[move[0].p.i][move[0].p.c] = {
          ...BOARD[move[0].p.i][move[0].p.c],
          l: move[1].l,
          t: move[1].t,
          v: move[1].v,
        };
  
        BOARD[move[1].p.i][move[1].p.c] = {
          ...BOARD[move[1].p.i][move[1].p.c],
          l: move[0].l,
          t: move[0].t,
          v: move[0].v,
        };
        console.log("DESPUÉS DEL CAMBIO");
        console.log(BOARD);
      };
  
      // Agregra los eventos...
      // 0 Guarda el índice del elemento que está ene sa posición...
      /*
        0: La posición fila y columna de elemento seleccionado {}
      */
      let eventMove = {};
      const calculateDirection = (angle = 0) => {
        let jResult = "";
        switch (true) {
          // LEFT
          case angle < -170 || angle > 170:
            jResult = "left";
            break;
          // RIGHT
          case angle > -10 && angle < 10:
            jResult = "right";
            break;
          // UP
          case angle < -67.5 && angle > -112.5:
            jResult = "bottom";
            break;
          // Down
          case angle > 67.5 && angle < 112.5:
            jResult = "top";
            break;
        }
        return jResult;
      };
  
      const getAngleBetweenTwoPoints = (
        p1 = { x: 0, y: 0 },
        p2 = { x: 0, y: 0 }
      ) => calculateDirection((Math.atan2(p1.y - p2.y, p1.x - p2.x) * 180) / Math.PI);
  
      //Para la captura de los eventos...
      const getIndexCell = ({x = 0, y = 0}) => {
        for (let i = 0; i < SIZE; i++) {
          for (let c = 0; c < SIZE; c++) {
            const { l, t } = BOARD[i][c];
            if (x >= l && x <= l + CELL && y >= t && y <= t + CELL) {
              return BOARD[i][c];
            }
          }
        }
      };
  
      const getPosition = (e) => {
        const { left, top } = e.target.getBoundingClientRect();
        const event = ["touchstart", "touchmove"].includes(e.type)
          ? e.touches[0] || e.changedTouches[0]
          : e;
  
        return {
          x : Math.floor(event.pageX - left),
          y : Math.floor(event.pageY - top),
        };
      };
  
      const handleEvent = {
        start: (e) => {
          if (eventMove.start) return;
          eventMove.start = getPosition(e);
          // eventActionType[0] =
          // console.log(tmpPositiosn);
          // eventActionType[0] = getIndexCell(tmpPositiosn);
          // console.log("INICIAL:", eventActionType[0]);
        },
        move: (e) => {
          if (eventMove.start && !eventMove.end) {
            console.clear();
            const coordenates = getPosition(e);
            const direction = getAngleBetweenTwoPoints(eventMove.start, coordenates);
            if(direction) {
              eventMove.end = coordenates;
              console.log("destinity", eventMove.end);
  
              const element = getIndexCell(eventMove.start);
              console.log("element", element);
              const destinity = {
                left : [element.p.i, element.p.c + 1],
                right : [element.p.i, element.p.c - 1],
                bottom: [element.p.i + 1, element.p.c],
                top: [element.p.i - 1, element.p.c],
              }[direction];
              console.log({direction});
              console.log("destinity", destinity);
              console.log(BOARD[destinity[0]][destinity[1]]);
              // console.log(destinity[direction]);
              validateMove([element, BOARD[destinity[0]][destinity[1]]]);
            }
  
            /*
              FILAS HORIZINTAL..
              COlumnas Vertical...
              */
            //   const tmpPosible = [
              //     [eventActionType[0].p.i, eventActionType[0].p.c - 1],
              //     [eventActionType[0].p.i - 1, eventActionType[0].p.c],
              //     [eventActionType[0].p.i, eventActionType[0].p.c + 1],
              //     [eventActionType[0].p.i + 1, eventActionType[0].p.c],
              //   ];
  
  
  
            // validateMove([]);
            
  
            
          }
        },
        end: (e) => {
          console.log("EN end:", e.type);
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
  