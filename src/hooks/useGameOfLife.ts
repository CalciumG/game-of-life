import { produce } from "immer";
import { useCallback } from "react";
import { useRef, useEffect } from "react";
import { useStore } from "@/context/store";
import { operations } from "@/utils/gridUtils";

type Grid = number[][];

export const useGameOfLife = () => {
  const grid = useStore((state) => state.grid);
  const setGrid = useStore((state) => state.setGrid);
  const setAlive = useStore((state) => state.setAlive);

  const gridRef = useRef(grid);
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  const countAlive = (grid: Grid): number =>
    grid.flat().reduce((acc, cell) => acc + cell, 0);

  const nextStep = useCallback(
    (numRows: number, numCols: number): void => {
      const currentGrid = gridRef.current;

      const newGrid = produce(currentGrid, (gridCopy: Grid) => {
        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newRow = row + x;
              const newCol = col + y;
              if (
                newRow >= 0 &&
                newRow < numRows &&
                newCol >= 0 &&
                newCol < numCols
              ) {
                neighbors += currentGrid[newRow][newCol];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[row][col] = 0;
            } else if (currentGrid[row][col] === 0 && neighbors === 3) {
              gridCopy[row][col] = 1;
            }
          }
        }
      });

      setGrid(newGrid);
      setAlive(countAlive(newGrid));
    },
    [setGrid, setAlive]
  );

  const updateCell = (row: number, col: number): void => {
    const newGrid = produce(grid, (gridCopy: Grid) => {
      gridCopy[row][col] = grid[row][col] ? 0 : 1;
    });

    setGrid(newGrid);
    setAlive(countAlive(newGrid));
  };

  return {
    countAlive,
    nextStep,
    updateCell,
  };
};
