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
  const [playing, setPlaying] = useState(false);
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
  };

  const handleTogglePlay = () => {
    setPlaying(!playing);
  };

  const handleSeed = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPlaying(false);

    const shapeKeys = Object.keys(shapes);
    let seededGrid = generateEmptyGrid(numRows, numCols);

    for (let i = 0; i < 15; i++) {
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
  };

  useEffect(() => {
    if (playing) {
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
        intervalRef.current = null;
      }
    };
  }, [playing, handleNextStep]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 p-4">
      <label htmlFor="columns">Columns:</label>
      <input
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
        className="text-black bg-white p-1 rounded"
        disabled={true}
        type="number"
        value={alive}
      />
      <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="flex items-center space-x-2">
          <button onClick={handleTogglePlay}>
            {playing ? <span>Stop ⏯</span> : <span>Play ⏯</span>}
          </button>
          <button onClick={handleSeed}>Seed</button>
          <button onClick={handleNextStep}>Next</button>
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>
    </div>
  );
};
