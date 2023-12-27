"use client";

import React, { useEffect } from "react";
import { useStore } from "@/context/store";
import { generateEmptyGrid } from "@/utils/gridUtils";
import { Controls } from "./Controls";
import { Grid } from "./Grid";

export const GameOfLife = () => {
  const { numRows, numCols, grid, setGrid } = useStore();

  useEffect(() => {
    setGrid(generateEmptyGrid(numRows, numCols));
  }, [numRows, numCols, setGrid]);

  return (
    <>
      <Controls grid={grid} />
      <Grid />
    </>
  );
};
