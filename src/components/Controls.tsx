"use client";

import { useStore } from "@/context/store";
import { useGameOfLife } from "@/hooks/useGameOfLife";
import { generateEmptyGrid, min, max, shapes } from "@/utils/gridUtils";
import { produce } from "immer";
import { useState, useEffect, useCallback, SetStateAction } from "react";

type ControlsProps = {
  grid: number[][];
};

export const Controls: React.FC<ControlsProps> = () => {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | number | null>(
    null
  );
  const [seeded, setSeeded] = useState(false);

  const { nextStep, countAlive } = useGameOfLife();
  const numCols = useStore((state) => state.numCols);
  const numRows = useStore((state) => state.numRows);
  const alive = useStore((state) => state.alive);
  const setNumCols = useStore((state) => state.setNumCols);
  const setNumRows = useStore((state) => state.setNumRows);
  const setAlive = useStore((state) => state.setAlive);
  const setGrid = useStore((state) => state.setGrid);

  const handleNextStep = useCallback((): void => {
    nextStep(numRows, numCols);
  }, [nextStep, numRows, numCols]);

  const handleReset = (): void => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setNumCols(numCols);
    setNumRows(numRows);
    setAlive(0);
    setGrid(generateEmptyGrid(numRows, numCols));
    setSeeded(false);
  };

  const handleSeed = (): void => {
    const shapeKeys = Object.keys(shapes);

    let seededGrid = generateEmptyGrid(numRows, numCols);
    for (let i = 0; i < 10; i++) {
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
      const newIntervalId = setInterval(handleNextStep, 300) as
        | NodeJS.Timeout
        | number;

      setIntervalId(newIntervalId);
    } else {
      if (intervalId !== null) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [seeded, numRows, numCols, handleNextStep, intervalId]);

  const handleStop = (): void => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setSeeded(false);
    }
  };

  return (
    <div className="flex flex-row items-center justify-center space-x-2">
      <label htmlFor="columns">Columns: </label>
      <input
        data-test="x"
        className="text-black"
        type="number"
        min={min}
        max={max}
        value={numCols}
        onChange={(e) => {
          setNumCols(e.target.valueAsNumber);
          setAlive(0);
        }}
      />
      <label htmlFor="rows">Rows: </label>
      <input
        data-test="y"
        className="text-black"
        type="number"
        min={min}
        max={max}
        value={numRows}
        onChange={(e) => {
          setNumRows(e.target.valueAsNumber);
          setAlive(0);
        }}
      />
      <label htmlFor="alive">Alive: </label>
      <input
        data-test="alive-count"
        className="text-black bg-white"
        disabled={true}
        type="number"
        value={alive}
      />

      <div>
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
  );
};
