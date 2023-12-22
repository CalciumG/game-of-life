export const DEFAULT_COL_COUNT = 25;
export const DEFAULT_ROW_COUNT = 25;
export const min = 3;
export const max = 100;

export const generateEmptyGrid = (
  rowCount = DEFAULT_COL_COUNT,
  colCount = DEFAULT_ROW_COUNT,
) => {
  const rows = [];

  rowCount = rowCount >= min ? rowCount : DEFAULT_ROW_COUNT;
  colCount = colCount >= min ? colCount : DEFAULT_COL_COUNT;

  if (rowCount >= 3 && colCount >= 3) {
    for (let i = 0; i < rowCount; i++) {
      rows.push(Array.from(Array(colCount), () => 0));
    }
  }
  return rows;
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
