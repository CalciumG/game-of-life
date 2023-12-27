"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { produce } from "immer";
import { useStore } from "@/context/store";
import { useGameOfLife } from "@/hooks/useGameOfLife";
import { generateEmptyGrid, min, max, shapes } from "@/utils/gridUtils";

type ControlsProps = {
  grid: number[][];
};

export const Controls: React.FC<ControlsProps> = () => {
  const intervalRef = useRef<NodeJS.Timeout | number | null>(null);
  const [seeded, setSeeded] = useState(false);
  const { nextStep, countAlive } = useGameOfLife();
  const { numCols, numRows, alive, setNumCols, setNumRows, setAlive, setGrid } =
    useStore((state) => state);

  const handleNextStep = useCallback(() => {
    nextStep(numRows, numCols);
  }, [numRows, numCols]);

  const handleReset = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setNumCols(numCols);
    setNumRows(numRows);
    setAlive(0);
    setGrid(generateEmptyGrid(numRows, numCols));
    setSeeded(false);
  };

  const handleStop = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSeeded(false);
  };

  const handleSeed = () => {
    const shapeKeys = Object.keys(shapes);
    let seededGrid = generateEmptyGrid(numRows, numCols);

    for (let i = 0; i < 30; i++) {
      const randomShapeKey =
        shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
      const randomShape = shapes[randomShapeKey];

      seededGrid = produce(seededGrid, (draftGrid) => {
        let startX = Math.floor(Math.random() * numRows);
        let startY = Math.floor(Math.random() * numCols);

        randomShape.forEach(([x, y]) => {
          const posX = startX + x;
          const posY = startY + y;
          if (posX >= 0 && posX < numRows && posY >= 0 && posY < numCols) {
            draftGrid[posX][posY] = 1;
          }
        });
      });
    }

    setGrid(seededGrid);
    setAlive(countAlive(seededGrid));
    setSeeded(true);
  };

  useEffect(() => {
    if (seeded) {
      intervalRef.current = window.setInterval(handleNextStep, 300);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [seeded, handleNextStep]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 p-4">
      <label htmlFor="columns">Columns:</label>
      <input
        data-test="x"
        className="text-black rounded p-1"
        type="number"
        min={min}
        max={max}
        value={numCols}
        onChange={(e) => {
          setNumCols(e.target.valueAsNumber);
          setAlive(0);
        }}
      />
      <label htmlFor="rows">Rows:</label>
      <input
        data-test="y"
        className="text-black rounded p-1"
        type="number"
        min={min}
        max={max}
        value={numRows}
        onChange={(e) => {
          setNumRows(e.target.valueAsNumber);
          setAlive(0);
        }}
      />
      <label htmlFor="alive">Alive:</label>
      <input
        data-test="alive-count"
        className="text-black bg-white p-1 rounded"
        disabled={true}
        type="number"
        value={alive}
      />
      <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="flex items-center space-x-2">
          <button data-test="seed" onClick={handleSeed}>
            Seed
          </button>
          <button data-test="next" onClick={handleNextStep}>
            Next
          </button>
          <button data-test="reset" onClick={handleReset}>
            Reset
          </button>
          <button onClick={handleStop}>Stop</button>
        </div>
      </div>
    </div>
  );
};
