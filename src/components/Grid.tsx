"use client";

import { useStore } from "@/context/store";
import useGameOfLife from "@/hooks/useGameOfLife";

export const Grid: React.FC = () => {
  const { updateCell } = useGameOfLife();
  const grid = useStore((state) => state.grid);
  const numCols = useStore((state) => state.numCols);

  const handleCellClick = (row: number, col: number): void => {
    updateCell(row, col);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, 20px)`,
      }}
    >
      {grid.map((rows, i) =>
        rows.map((k, j) => (
          <div
            data-test={`cell-${j}-${i}-${grid[i][j] ? "alive" : "dead"}`}
            key={`${i}-${j}`}
            onClick={() => handleCellClick(i, j)}
            style={{
              width: 20,
              height: 20,
              backgroundColor: grid[i][j] ? "grey" : "",
              border: "solid 1px white",
            }}
          />
        ))
      )}
    </div>
  );
};
