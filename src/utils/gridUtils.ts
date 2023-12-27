import { produce } from "immer";

export const DEFAULT_ROW_COUNT = 50;
export const DEFAULT_COL_COUNT = 50;

export const min = 3;
export const max = 100;

export const generateEmptyGrid = (
  rowCount = DEFAULT_ROW_COUNT,
  colCount = DEFAULT_COL_COUNT,
  density = 0
) => {
  return Array.from({ length: rowCount }, () =>
    Array.from({ length: colCount }, () => (Math.random() < density ? 1 : 0))
  );
};

export const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

type Shape = number[][];
type ShapeDictionary = { [key: string]: Shape };

export const shapes: ShapeDictionary = {
  glider: [
    [1, 0],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  square: [
    // A simple 2x2 square (Still Life)
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
  blinker: [
    // A vertical line that oscillates to horizontal (Period 2 Oscillator)
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  toad: [
    // A 2x2 square that shifts shape (Period 2 Oscillator)
    [1, 0],
    [2, 0],
    [3, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  beacon: [
    // A 2x2 square that flashes on and off (Period 2 Oscillator)
    [0, 0],
    [1, 0],
    [0, 1],
    [2, 2],
    [3, 2],
    [3, 3],
  ],
  lwss: [
    // Lightweight Spaceship (Period 4 Spaceship)
    [0, 1],
    [0, 3],
    [1, 0],
    [2, 0],
    [3, 0],
    [3, 3],
    [4, 0],
    [4, 2],
  ],
  pulsar: [
    // Pulsar (Period 3 Oscillator)
    [2, 0],
    [3, 0],
    [4, 0],
    [8, 0],
    [9, 0],
    [10, 0],
    [0, 2],
    [5, 2],
    [7, 2],
    [12, 2],
    [0, 3],
    [5, 3],
    [7, 3],
    [12, 3],
    [0, 4],
    [5, 4],
    [7, 4],
    [12, 4],
    [2, 5],
    [3, 5],
    [4, 5],
    [8, 5],
    [9, 5],
    [10, 5],
    [2, 7],
    [3, 7],
    [4, 7],
    [8, 7],
    [9, 7],
    [10, 7],
    [0, 8],
    [5, 8],
    [7, 8],
    [12, 8],
    [0, 9],
    [5, 9],
    [7, 9],
    [12, 9],
    [0, 10],
    [5, 10],
    [7, 10],
    [12, 10],
    [2, 12],
    [3, 12],
    [4, 12],
    [8, 12],
    [9, 12],
    [10, 12],
  ],
  pentaDecathlon: [
    // Penta-decathlon (Period 15 Oscillator)
    [1, 0],
    [2, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [8, 0],
    [9, 0],
    [1, 1],
    [9, 1],
    [1, 2],
    [9, 2],
    [1, 3],
    [2, 3],
    [4, 3],
    [5, 3],
    [6, 3],
    [8, 3],
    [9, 3],
  ],
  galaxy: [
    // Kok's Galaxy (Period 8 Oscillator)
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
    [1, 1],
    [7, 1],
    [0, 2],
    [8, 2],
    [0, 3],
    [8, 3],
    [0, 4],
    [8, 4],
    [0, 5],
    [8, 5],
    [1, 6],
    [7, 6],
    [1, 7],
    [2, 7],
    [3, 7],
    [4, 7],
    [5, 7],
    [6, 7],
    [7, 7],
  ],
  gosperGliderGun: [
    // Gosper Glider Gun
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [10, 2],
    [10, 3],
    [10, 4],
    [11, 1],
    [11, 5],
    [12, 0],
    [12, 6],
    [13, 0],
    [13, 6],
    [14, 3],
    [15, 1],
    [15, 5],
    [16, 2],
    [16, 3],
    [16, 4],
    [17, 3],
    [20, 4],
    [20, 5],
    [20, 6],
    [21, 4],
    [21, 5],
    [21, 6],
    [22, 3],
    [22, 7],
    [24, 2],
    [24, 3],
    [24, 7],
    [24, 8],
    [34, 5],
    [34, 6],
    [35, 5],
    [35, 6],
  ],
  diehard: [
    // Diehard (Vanishes after 130 generations)
    [0, 6],
    [1, 0],
    [1, 1],
    [2, 1],
    [2, 5],
    [2, 6],
    [2, 7],
  ],
};

export const placeShape = (
  grid: any,
  shape: [any, any][],
  numRows: number,
  numCols: number
) => {
  let startX = Math.floor(Math.random() * numRows);
  let startY = Math.floor(Math.random() * numCols);

  const newGrid = produce(
    grid,
    (draft: { [x: string]: { [x: string]: number } }) => {
      shape.forEach(([x, y]) => {
        const posX = startX + x;
        const posY = startY + y;
        if (posX >= 0 && posX < numRows && posY >= 0 && posY < numCols) {
          draft[posX][posY] = 1;
        }
      });
    }
  );

  return newGrid;
};
