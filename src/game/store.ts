import { create } from "zustand";
import { blip } from "./audio";
import { HATS, TYPES, YARDS, makeJunk, rollJunk, spot, type HatId, type JunkItem, type JunkType } from "./content";
import { resetPose, timeLeft } from "./pose";

const SAVE_KEY = "fred-haul-v1";

type Save = { bestYards: number; bestScore: number; hatId: HatId };

function loadSave(): Save {
  const blank: Save = { bestYards: 0, bestScore: 0, hatId: "yellow" };
  if (typeof localStorage === "undefined") return blank;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return blank;
    const p = JSON.parse(raw) as Partial<Save>;
    const hatId = HATS.some((h) => h.id === p.hatId) ? (p.hatId as HatId) : "yellow";
    return {
      bestYards: Number(p.bestYards) || 0,
      bestScore: Number(p.bestScore) || 0,
      hatId,
    };
  } catch {
    return blank;
  }
}

function writeSave(s: Save) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
  } catch {
    /* private mode */
  }
}

export type Phase = "menu" | "play" | "between" | "win" | "lose";

type State = {
  phase: Phase;
  yardIndex: number;
  score: number;
  load: number;
  shownTime: number;
  carry: number;
  carried: JunkType[];
  junk: JunkItem[];
  toast: string;
  hatId: HatId;
  bestYards: number;
  bestScore: number;
  hydrated: boolean;
  hydrate: () => void;
  setHat: (id: HatId) => void;
  startRun: () => void;
  nextYard: () => void;
  collect: (id: string) => "ok" | "heavy" | "no";
  dump: () => void;
  tick: (dt: number) => void;
};

let hudAcc = 0;

export const useGame = create<State>((set, get) => ({
  phase: "menu",
  yardIndex: 0,
  score: 0,
  load: 0,
  shownTime: YARDS[0].time,
  carry: 0,
  carried: [],
  junk: [],
  toast: "Thumb stick or WASD. Yellow ring dumps the load.",
  hatId: "yellow",
  bestYards: 0,
  bestScore: 0,
  hydrated: false,
  hydrate: () => {
    const s = loadSave();
    set({ ...s, hydrated: true });
  },
  setHat: (id) => {
    const best = get().bestYards;
    const hat = HATS.find((h) => h.id === id);
    if (!hat || best < hat.need) return;
    set({ hatId: id });
    writeSave({ bestYards: best, bestScore: get().bestScore, hatId: id });
  },
  startRun: () => {
    resetPose();
    timeLeft.current = YARDS[0].time;
    hudAcc = 0;
    set({
      phase: "play",
      yardIndex: 0,
      score: 0,
      load: 0,
      shownTime: YARDS[0].time,
      carry: 0,
      carried: [],
      junk: makeJunk(YARDS[0].count),
      toast: `${YARDS[0].name} — fill the truck`,
    });
  },
  nextYard: () => {
    const i = get().yardIndex + 1;
    const y = YARDS[i];
    if (!y) return;
    resetPose();
    timeLeft.current = y.time;
    hudAcc = 0;
    set({
      phase: "play",
      yardIndex: i,
      load: 0,
      shownTime: y.time,
      carry: 0,
      carried: [],
      junk: makeJunk(y.count),
      toast: `${y.name} — fill the truck`,
    });
  },
  collect: (id) => {
    const s = get();
    if (s.phase !== "play") return "no";
    const item = s.junk.find((j) => j.id === id);
    if (!item) return "no";
    const spec = TYPES[item.type];
    const cap = YARDS[s.yardIndex]!.cap;
    if (s.carry + spec.w > cap) return "heavy";
    const junk = s.junk.filter((j) => j.id !== id);
    const quota = YARDS[s.yardIndex]!.quota;
    if (junk.length < 4 && s.load + s.carry + spec.w < quota) {
      const p = spot(junk);
      junk.push({ id: `j${Math.random().toString(36).slice(2, 8)}`, type: rollJunk(), ...p });
    }
    set({
      junk,
      carried: [...s.carried, item.type],
      carry: s.carry + spec.w,
      toast: spec.name,
    });
    blip(520);
    return "ok";
  },
  dump: () => {
    const s = get();
    if (s.phase !== "play" || s.carried.length === 0) return;
    let load = s.load;
    let score = s.score;
    for (const t of s.carried) {
      load += TYPES[t].w;
      score += TYPES[t].pts;
    }
    const yard = YARDS[s.yardIndex]!;
    blip(220);
    if (load >= yard.quota) {
      score += Math.ceil(Math.max(0, timeLeft.current)) * 2;
      const cleared = s.yardIndex + 1;
      const bestYards = Math.max(s.bestYards, cleared >= YARDS.length ? 5 : cleared);
      const bestScore = Math.max(s.bestScore, score);
      const hatId = s.hatId;
      writeSave({ bestYards, bestScore, hatId });
      set({
        load,
        score,
        carried: [],
        carry: 0,
        bestYards,
        bestScore,
        phase: s.yardIndex >= YARDS.length - 1 ? "win" : "between",
        toast: s.yardIndex >= YARDS.length - 1 ? "Route complete" : "Yard cleared",
      });
      return;
    }
    set({
      load,
      score,
      carried: [],
      carry: 0,
      toast: `Dumped. Truck ${load}/${yard.quota}`,
    });
  },
  tick: (dt) => {
    const s = get();
    if (s.phase !== "play") return;
    timeLeft.current -= dt;
    if (timeLeft.current <= 0) {
      timeLeft.current = 0;
      const bestScore = Math.max(s.bestScore, s.score);
      writeSave({ bestYards: s.bestYards, bestScore, hatId: s.hatId });
      set({ phase: "lose", shownTime: 0, bestScore, toast: "Time ran out" });
      return;
    }
    hudAcc += dt;
    if (hudAcc >= 0.25) {
      hudAcc = 0;
      set({ shownTime: timeLeft.current });
    }
  },
}));
