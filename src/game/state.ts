import type { GameState } from "./types";
import { INITIAL_METRICS, INITIAL_STATS, INITIAL_TAGS } from "./data/character";

export function createInitialState(): GameState {
  return {
    day: 1,
    metrics: { ...INITIAL_METRICS },
    stats: { ...INITIAL_STATS },
    tags: [...INITIAL_TAGS],
    history: [],
    acceptedDeals: [],
  };
}
