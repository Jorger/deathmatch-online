const MAX_ELEMENTS = 5;
const SIZE = 7;
const HEIGHT = 732;
const WIDTH = 412;
const CELL = WIDTH / 7;

/**
 * Genera un número aleatorio dado un rango
 * @param {*} min
 * @param {*} max
 * @returns
 */
const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Para generar un tocken...
 * @returns
 */
const guid = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
};

/**
 * Establecer el color y el orden que tendrán los juagdores...
 * @param {*} users
 * @returns
 */
const setOrder = (users = []) => {
  const color = randomNumber(0, 1);
  const turn = randomNumber(0, 1);
  users[0][2] = color ? "r": "b";
  users[1][2] = color ? "b": "r";

  return {
    users,
    turn: users[turn][1],
  };
};

/**
 * Valida si los índces de una matriz están en rango...
 * @param {*} r
 * @param {*} c
 * @returns
 */
const isValidIndex = (r, c) => r >= 0 && r < SIZE && c >= 0 && c < SIZE;

/**
 * Dado el tipo, retorna el array con los elementos del mismo tipo...
 * @param {*} board
 * @param {*} type
 * @returns
 */
const elementOnBoard = (board = [], type = 0) => {
  const elements = [];
  for (let i = 0; i < SIZE; i++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[i][c].v === type) {
        elements.push({
          type,
          i,
          c,
        });
      }
    }
  }

  return elements;
};

/**
 * Dada una board, valida si está se puede solucionar...
 * @param {*} board
 * @returns
 */
const isValidBoard = (board = []) => {
  const getThree = () => {
    const lines = [];

    for (let i = 0; i < SIZE; i++) {
      for (let c = 0; c < SIZE; c++) {
        const value = board[i][c].v;
        /**
         * 0 y 1 coordendas para completar tres...
         * 2 posición a moverse...
         * 3 Coordenadas opcionadas de los elementos a moverse del mimo tipo...
         */
        const previus = [
          [
            i - 1,
            c,
            [i - 2, c],
            [
              [i - 2, c - 1],
              [i - 3, c],
              [i - 2, c + 1],
            ],
          ],
          [
            i,
            c - 1,
            [i, c - 2],
            [
              [i, c - 3],
              [i - 1, c - 2],
              [i + 1, c - 2],
            ],
          ],
          [
            i + 1,
            c,
            [i + 2, c],
            [
              [i + 3, c],
              [i + 2, c - 1],
              [i + 2, c + 1],
            ],
          ],
          [
            i,
            c + 1,
            [i, c + 2],
            [
              [i, c + 3],
              [i - 1, c + 2],
              [i + 1, c + 2],
            ],
          ],
          [
            i - 2, //acá
            c,
            [i - 1, c],
            [
              [i - 1, c - 1],
              [i - 1, c + 1],
            ],
          ],
          [
            i + 2,
            c,
            [i + 1, c],
            [
              [i + 1, c - 1],
              [i + 1, c + 1],
            ],
          ],
          [
            i,
            c + 2,
            [i, c + 1],
            [
              [i - 1, c + 1],
              [i + 1, c + 1],
            ],
          ],
          [
            i,
            c - 2,
            [i, c - 1],
            [
              [i - 1, c - 1],
              [i + 1, c - 1],
            ],
          ],
        ]
          .filter((v) => isValidIndex(v[2][0], v[2][1]))
          .filter((v) => board?.[v[0]]?.[v[1]]?.v === value)
          .map((v) => [
            v[0],
            v[1],
            v[2],
            v[3].filter((p) => board?.[p[0]]?.[p[1]]?.v === value),
          ])
          .filter((v) => v[3].length !== 0);

        if (previus.length !== 0) {
          lines.push(previus);
        }
      }
    }

    return lines;
  };

  const getFour = () => {
    const lines = [];
    for (let i = 0; i < SIZE; i++) {
      for (let c = 0; c < SIZE; c++) {
        const value = board[i][c].v;
        /**
         * 0, Tiene coodenadas de los otros dos puntos para hacer 4...
         * 1, la posición de destino a donde se mueve y completa 4.
         * 2, Posociones de los elementos opcionados a moverse...
         */
        const previus = [
          [
            [
              [i - 1, c],
              [i, c - 1],
            ],
            [i - 1, c - 1],
            [
              [
                [i - 2, c - 1],
                [i - 1, c - 2],
              ],
            ],
          ],
          [
            [
              [i + 1, c],
              [i, c - 1],
            ],
            [i + 1, c - 1],
            [
              [i + 2, c - 1],
              [i + 1, c - 2],
            ],
          ],
          [
            [
              [i + 1, c],
              [i, c + 1],
            ],
            [i + 1, c + 1],
            [
              [i + 2, c + 1],
              [i + 1, c + 2],
            ],
          ],
          [
            [
              [i - 1, c],
              [i, c + 1],
            ],
            [i - 1, c + 1],
            [
              [i - 2, c + 1],
              [i - 1, c + 2],
            ],
          ],
        ]
          .filter((v) => isValidIndex(v[1][0], v[1][1]))
          .filter(
            (v) =>
              board?.[v[0][0][0]]?.[v[0][0][1]]?.v === value &&
              board?.[v[0][1][0]]?.[v[0][1][1]]?.v === value
          )
          .map((v) => [
            v[0],
            v[1],
            v[2].filter((p) => board?.[p[0]]?.[p[1]]?.v === value),
          ])
          .filter((v) => v[2].length !== 0);

        if (previus.length !== 0) {
          lines.push(previus);
        }
      }
    }

    return lines;
  };

  // Se busca si hay extra life (6), axe (7), rocket (8), Bomb (9)
  const dynamite = elementOnBoard(board, 6); // 🧨 ❤️
  const axe = elementOnBoard(board, 7); // 🪓 // Horizontal...
  const rocket = elementOnBoard(board, 8); // 💉 🚀 // vertical...
  const bomb = elementOnBoard(board, 9); // 💣
  const three = getThree();
  const four = getFour();

  return {
    isValid:
      [dynamite, axe, rocket, bomb, three, four].filter((v) => v.length !== 0)
        .length !== 0,
    values: {
      axe,
      bomb,
      four,
      dynamite,
      rocket,
      three,
    },
  };
};

/**
 * Genera una nueva board.
 * Además valida que inicialemte no tenga match...
 * @param {*} skip
 * @returns
 */
const generateBoard = (skip = []) => {
  const board = [];

  const is3Lines = (r, c, value) =>
    [board?.[r - 2]?.[c]?.v, board?.[r - 1]?.[c]?.v].every(
      (v) => v === value
    ) ||
    [board?.[r]?.[c - 2]?.v, board?.[r]?.[c - 1]?.v].every((v) => v === value);

  const isSquare = (r, c, value) =>
    [
      [
        board?.[r - 1]?.[c]?.v,
        board?.[r - 1]?.[c + 1]?.v,
        board?.[r]?.[c + 1]?.v,
      ],
      [
        board?.[r + 1]?.[c]?.v,
        board?.[r + 1]?.[c + 1]?.v,
        board?.[r]?.[c + 1]?.v,
      ],
      [
        board?.[r - 1]?.[c]?.v,
        board?.[r - 1]?.[c + 1]?.v,
        board?.[r]?.[c + 1]?.v,
      ],
      [
        board?.[r - 1]?.[c]?.v,
        board?.[r - 1]?.[c - 1]?.v,
        board?.[r]?.[c - 1]?.v,
      ],
    ]
      .map((item) => item.every((v) => v === value))
      .filter((v) => v).length !== 0;

  for (let i = 0; i < SIZE; i++) {
    board[i] = [];

    for (let c = 0; c < SIZE; c++) {
      let value = randomNumber(1, MAX_ELEMENTS);

      do {
        if (
          is3Lines(i, c, value) ||
          isSquare(i, c, value) ||
          skip.includes(value)
        ) {
          value = randomNumber(1, MAX_ELEMENTS);
        } else {
          break;
        }
      } while (1);

      board[i][c] = {
        v: value,
        i: i * SIZE + c,
        l: Math.round(CELL * c),
        t: Math.round(CELL * i),
        p: { i, c },
      };
    }
  }

  return board;
};

/**
 * Función preincipal que valida que una board tiene solución...
 * @param {*} skip
 * @returns
 */
const newBoard = (skip = []) => {
  let board = generateBoard(skip);

  do {
    if (!isValidBoard(board).isValid) {
      board = generateBoard(skip);
    } else {
      break;
    }
  } while (1);

  return board;
};
