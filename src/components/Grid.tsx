"use client";

import React from "react";
import { useStore } from "@/context/store";
import { useGameOfLife } from "@/hooks/useGameOfLife";

const cellStyle = {
  width: 20,
  height: 20,
  border: "solid 1px white",
};

interface CellProps {
  isAlive: boolean;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = React.memo(({ isAlive, onClick }) => (
  <div
    style={{
      ...cellStyle,
      backgroundColor: isAlive ? "grey" : "",
    }}
    onClick={onClick}
  />
));

Cell.displayName = "Cell";

export const Grid: React.FC = () => {
  const { updateCell } = useGameOfLife();
  const grid = useStore((state) => state.grid);
  const numCols = useStore((state) => state.numCols);

  const handleCellClick = (row: number, col: number) => () => {
    updateCell(row, col);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, 20px)`,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            isAlive={cell === 1}
            onClick={handleCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};
