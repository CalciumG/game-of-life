"use client";

import React, { memo } from "react";
import { useStore } from "@/context/store";
import { useGameOfLife } from "@/hooks/useGameOfLife";

const cellStyle = {
  width: 12,
  height: 12,
  border: "solid 0.1px grey",
};

interface CellProps {
  isAlive: boolean;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = memo(({ isAlive, onClick }) => (
  <div
    style={{
      ...cellStyle,
      backgroundColor: isAlive ? "yellow" : "",
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
        gridTemplateColumns: `repeat(${numCols}, 12px)`,
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
