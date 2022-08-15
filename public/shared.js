"use strict";
const SIZE = 7;

const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const isValidBoard = (board = []) => {
  const elementOBoard = (type = 0) => {
    const elements = [];
    for (let i = 0; i < SIZE; i++) {
      for (let c = 0; c < SIZE; c++) {
        if (board[i][c] === type) {
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

  const getThree = () => {
    const lines = [];

    for (let i = 0; i < SIZE; i++) {
      for (let c = 0; c < SIZE; c++) {
        const value = board[i][c];
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
          .filter((v) => board?.[v[0]]?.[v[1]] === value)
          .map((v) => [
            v[0],
            v[1],
            v[2],
            v[3].filter((p) => board?.[p[0]]?.[p[1]] === value),
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
        const value = board[i][c];
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
              board?.[v[0][0][0]]?.[v[0][0][1]] === value &&
              board?.[v[0][1][0]]?.[v[0][1][1]] === value
          )
          .map((v) => [
            v[0],
            v[1],
            v[2].filter((p) => board?.[p[0]]?.[p[1]] === value),
          ])
          .filter((v) => v[2].length !== 0);

        if (previus.length !== 0) {
          lines.push(previus);
        }
      }
    }

    return lines;
  };

  // Se busca si hay libros (6), cohetes (7) ó bombas (8)...
  const book = elementOBoard(6);
  const rocket = elementOBoard(6);
  const bomb = elementOBoard(7);
  const three = getThree();
  const four = getFour();

  return {
    isValid:
      [book, rocket, bomb, three, four].filter((v) => v.length !== 0).length !==
      0,
    values: {
      book,
      rocket,
      bomb,
      three,
      four,
    },
  };
};

const generateBoard = () => {
  const board = [];

  const is3Lines = (r, c, value) =>
    [board?.[r - 2]?.[c], board?.[r - 1]?.[c]].every((v) => v === value) ||
    [board?.[r]?.[c - 2], board?.[r]?.[c - 1]].every((v) => v === value);

  const isSquare = (r, c, value) =>
    [
      [board?.[r - 1]?.[c], board?.[r - 1]?.[c + 1], board?.[r]?.[c + 1]],
      [board?.[r + 1]?.[c], board?.[r + 1]?.[c + 1], board?.[r]?.[c + 1]],
      [board?.[r - 1]?.[c], board?.[r - 1]?.[c + 1], board?.[r]?.[c + 1]],
      [board?.[r - 1]?.[c], board?.[r - 1]?.[c - 1], board?.[r]?.[c - 1]],
    ]
      .map((item) => item.every((v) => v === value))
      .filter((v) => v).length !== 0;

  for (let i = 0; i < SIZE; i++) {
    board[i] = [];

    for (let c = 0; c < SIZE; c++) {
      let value = randomNumber(1, 5);

      do {
        if (is3Lines(i, c, value) || isSquare(i, c, value)) {
          value = randomNumber(1, 5);
        } else {
          break;
        }
      } while (1);

      board[i][c] = value;
    }
  }

  return board;
};

const newBoard = () => {
  console.clear();
  let board = generateBoard();

  do {
    if (!isValidBoard(board).isValid) {
      board = generateBoard();
    } else {
      break;
    }
  } while (1);

  return board;
};
