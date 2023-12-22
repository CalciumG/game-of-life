import {
  DEFAULT_COL_COUNT,
  DEFAULT_ROW_COUNT,
  generateEmptyGrid,
} from "@/utils/gridUtils";
import { create } from "zustand";

type State = {
  numRows: number;
  numCols: number;
  alive: number;
  grid: number[][];
  setNumRows: (numRows: number) => void;
  setNumCols: (numCols: number) => void;
  setAlive: (alive: number) => void;
  setGrid: (grid: number[][]) => void;
};

export const useStore = create<State>((set) => ({
  numRows: DEFAULT_ROW_COUNT,
  numCols: DEFAULT_COL_COUNT,
  alive: 0,
  grid: generateEmptyGrid(DEFAULT_ROW_COUNT, DEFAULT_COL_COUNT),
  setNumRows: (numRows) => set(() => ({ numRows })),
  setNumCols: (numCols) => set(() => ({ numCols })),
  setAlive: (alive) => set(() => ({ alive })),
  setGrid: (grid) => set(() => ({ grid })),
}));
