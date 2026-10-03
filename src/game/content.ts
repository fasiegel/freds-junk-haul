export type JunkType = "bag" | "box" | "tire" | "tv" | "fridge" | "couch";

export type JunkSpec = { name: string; w: number; pts: number; color: string };

export const TYPES: Record<JunkType, JunkSpec> = {
  bag: { name: "trash bag", w: 1, pts: 10, color: "#2c382c" },
  box: { name: "cardboard", w: 1, pts: 12, color: "#c48a4a" },
  tire: { name: "tire", w: 2, pts: 22, color: "#222222" },
  tv: { name: "old TV", w: 2, pts: 28, color: "#4e5964" },
  fridge: { name: "fridge", w: 3, pts: 40, color: "#d7dde2" },
  couch: { name: "couch", w: 3, pts: 48, color: "#8c4b3a" },
};

export const YARDS = [
  { name: "Maple Court", quota: 10, time: 55, cap: 4, count: 9 },
  { name: "Elm Alley", quota: 14, time: 55, cap: 4, count: 12 },
  { name: "Oak Estates", quota: 18, time: 60, cap: 4, count: 14 },
  { name: "River Lot", quota: 22, time: 60, cap: 5, count: 16 },
  { name: "Dumpster Row", quota: 26, time: 65, cap: 5, count: 18 },
] as const;

export const HATS = [
  { id: "yellow", name: "Classic cap", color: "#e6a31a", need: 0 },
  { id: "green", name: "Route green", color: "#3d8f62", need: 1 },
  { id: "orange", name: "Hazard orange", color: "#e07a2f", need: 3 },
  { id: "blue", name: "Night shift", color: "#2c4c8a", need: 5 },
] as const;

export type HatId = (typeof HATS)[number]["id"];

export const BAY = { x: -9.2, z: 1 };
export const TRUCK = { x: -12, z: 1 };

const BAG: JunkType[] = ["bag", "bag", "box", "box", "tire", "tv", "fridge", "couch"];

export function rollJunk(): JunkType {
  return BAG[Math.floor(Math.random() * BAG.length)]!;
}

export type JunkItem = { id: string; type: JunkType; x: number; z: number };

export function spot(existing: { x: number; z: number }[]): { x: number; z: number } {
  for (let i = 0; i < 24; i++) {
    const x = -1 + Math.random() * 17;
    const z = -8 + Math.random() * 16;
    const clear =
      existing.every((e) => (e.x - x) ** 2 + (e.z - z) ** 2 > 3.2) &&
      (x - BAY.x) ** 2 + (z - BAY.z) ** 2 > 10;
    if (clear) return { x, z };
  }
  return { x: 8, z: 3 };
}

let seq = 1;

export function makeJunk(count: number): JunkItem[] {
  const items: JunkItem[] = [];
  for (let i = 0; i < count; i++) {
    const p = spot(items);
    items.push({ id: `j${seq++}`, type: rollJunk(), ...p });
  }
  return items;
}
