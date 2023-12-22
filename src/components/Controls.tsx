"use client";

import { useStore } from "@/context/store";
import { useGameOfLife } from "@/hooks/useGameOfLife";
import { generateEmptyGrid, min, max } from "@/utils/gridUtils";

type ControlsProps = {
  grid: number[][];
};

export const Controls: React.FC<ControlsProps> = () => {
  const { nextStep, countAlive } = useGameOfLife();
  const numCols = useStore((state) => state.numCols);
  const numRows = useStore((state) => state.numRows);
  const alive = useStore((state) => state.alive);
  const setNumCols = useStore((state) => state.setNumCols);
  const setNumRows = useStore((state) => state.setNumRows);
  const setAlive = useStore((state) => state.setAlive);
  const setGrid = useStore((state) => state.setGrid);

  const handleNextStep = (): void => {
    nextStep(numRows, numCols);
  };

  const handleReset = (): void => {
    setNumCols(numCols);
    setNumRows(numRows);
    setAlive(0);
    setGrid(generateEmptyGrid(numRows, numCols));
  };

  const handleSeed = (): void => {
    const seededGrid = generateEmptyGrid(numRows, numCols, 0.1); // 10% density
    setGrid(seededGrid);
    setAlive(countAlive(seededGrid)); // Update the alive count after seeding
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
      </div>
    </div>
  );
};
