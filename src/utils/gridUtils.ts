export const DEFAULT_COL_COUNT = 25;
export const DEFAULT_ROW_COUNT = 25;
export const min = 3;
export const max = 100;

export const generateEmptyGrid = (
  rowCount = DEFAULT_ROW_COUNT,
  colCount = DEFAULT_COL_COUNT
) => {
  rowCount = Math.max(rowCount, min);
  colCount = Math.max(colCount, min);

  return Array.from({ length: rowCount }, () => Array(colCount).fill(0));
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
