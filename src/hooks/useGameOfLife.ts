import { useCallback } from "react";
import { useStore } from "@/context/store";
import { operations } from "@/utils/gridUtils";

type Grid = number[][];

const countAlive = (grid: Grid): number =>
  grid.flat().reduce((acc, cell) => acc + cell, 0);

export const useGameOfLife = () => {
  const grid = useStore((state) => state.grid);
  const setGrid = useStore((state) => state.setGrid);
  const setAlive = useStore((state) => state.setAlive);

  const getAliveNeighbors = (
    row: number,
    col: number,
    numRows: number,
    numCols: number
  ) =>
    operations.reduce((acc, [xOffset, yOffset]) => {
      const newRow = row + xOffset;
      const newCol = col + yOffset;
      const isValidCell =
        newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols;
      return isValidCell ? acc + grid[newRow][newCol] : acc;
    }, 0);

  // Determine the next state of the grid
  const nextStep = useCallback(
    (numRows: number, numCols: number): void => {
      const updatedGrid = grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const neighbors = getAliveNeighbors(
            rowIndex,
            colIndex,
            numRows,
            numCols
          );
          const isAlive = cell === 1;
          const underpopulated = neighbors < 2;
          const overpopulated = neighbors > 3;
          const reproduction = neighbors === 3;

          if (isAlive && (underpopulated || overpopulated)) return 0;
          if (!isAlive && reproduction) return 1;
          return cell;
        })
      );

      setGrid(updatedGrid);
      setAlive(countAlive(updatedGrid));
    },
    [grid, setGrid, setAlive]
  );

  // Update a specific cell's state
  const updateCell = useCallback(
    (row: number, col: number): void => {
      const newGrid = [...grid];
      newGrid[row] = [...newGrid[row]];
      newGrid[row][col] = grid[row][col] ? 0 : 1;
      setGrid(newGrid);
      setAlive(countAlive(newGrid));
    },
    [grid, setGrid, setAlive]
  );

  return { countAlive, nextStep, updateCell };
};
