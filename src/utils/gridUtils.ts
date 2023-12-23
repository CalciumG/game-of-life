import { produce } from "immer";

export const DEFAULT_COL_COUNT = 25;
export const DEFAULT_ROW_COUNT = 25;
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
