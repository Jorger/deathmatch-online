"use strict";
const MAX_ELEMENTS = 5;
const SIZE = 7;
const HEIGHT = 732;
const WIDTH = 412;
const CELL = WIDTH / 7;

const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * dado el tipo, retorna el array con los elementos del mismo tipo...
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
              [i - 1, c + 1],
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
            i - 2,
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

  // Se busca si hay extra life (6), axe (7), syringe (8), Bomb (9)
  const extraLife = elementOnBoard(board, 6); // 🧨 ❤️
  const axe = elementOnBoard(board, 7); // 🪓 // Horizontal...
  const syringe = elementOnBoard(board, 8); // 💉 🚀 // vertical...
  const bomb = elementOnBoard(board, 9); // 💣
  const three = getThree();
  const four = getFour();

  return {
    isValid:
      [extraLife, axe, syringe, bomb, three, four].filter((v) => v.length !== 0)
        .length !== 0,
    values: {
      axe,
      bomb,
      four,
      extraLife,
      syringe,
      three,
    },
  };
};

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
